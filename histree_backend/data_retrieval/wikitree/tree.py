from abc import abstractmethod
import requests
import json
from json import JSONDecodeError
from typing import Dict, List, Tuple
from data_retrieval.query.parser import WikiResult, DBResult
from data_retrieval.wikitree.flower import (
    WikiFlower,
    WikiPetal,
    WikiStem,
    UpWikiStem,
    DownWikiStem,
)
from database.neo4j_db import Neo4jDB
from database.cypher_runner import (
    find_children,
    find_flowers,
    find_parent,
    merge_nodes_into_db,
    merge_relation_into_db,
)


class WikiSeed:
    def __init__(
        self,
        self_stem: WikiStem,
        up_stem: UpWikiStem,
        down_stem: DownWikiStem,
        petals: List[WikiPetal],
    ):
        self.self_stem = self_stem
        self.up_stem, self.down_stem = up_stem, down_stem
        self.petal_map = {
            petal.label: petal
            for petal in petals
            + ([] if up_stem is None else up_stem.unique_petals)
            + ([] if down_stem is None else down_stem.unique_petals)
        }
        self.lazy_petals = {petal for petal in petals if petal.lazy_seed is not None}

        _headers = dict(petal.to_dict_pair() for petal in petals)
        for stem in (self.self_stem, self.up_stem, self.down_stem):
            if stem is not None:
                stem.set_query_template(_headers)

    def branch_up(self, ids: List[str], tree: "WikiTree") -> List[WikiFlower]:
        if self.up_stem is None:
            return []

        # Query for parents
        parents = tree.watering(ids, find_parent, self.up_stem.get_query, True)

        # Store parents in tree
        for parent in parents:
            tree.flowers[parent.id] = parent

            if parent.id not in tree.branches:
                tree.branches[parent.id] = set()
            tree.branches[parent.id].add(parent.petals[self.up_stem.caller])

        for id in ids:
            tree.flowers[id].branched_up = True

        return parents

    def branch_down(self, ids: List[str], tree: "WikiTree") -> List[WikiFlower]:
        if self.down_stem is None:
            return []

        children = tree.watering(ids, find_children, self.down_stem.get_query, True)

        seen_ids = set(ids)
        unseen_parent_ids = set()

        # Add children to tree and record unseen parents (children's another parent)
        for child in children:
            tree.flowers[child.id] = child

            for parent_petal_label in self.down_stem.parents:
                if parent_petal_label in child.petals:
                    parent_id = child.petals[parent_petal_label]
                    if parent_id not in tree.flowers and parent_id not in seen_ids:
                        unseen_parent_ids.add(parent_id)
                    if parent_id not in tree.branches:
                        tree.branches[parent_id] = set()
                    tree.branches[parent_id].add(child.id)

        # Find information about parents not in tree
        if unseen_parent_ids:
            self.sprout(list(unseen_parent_ids), tree)

        for child in children:
            child.branched_up = True

        for id in ids:
            tree.flowers[id].branched_down = True

        return children

    def sprout(self, ids: List[str], tree: "WikiTree") -> List[WikiFlower]:
        flowers = tree.watering(ids, find_flowers, self.self_stem.get_query, False)

        for flower in flowers:
            tree.flowers[flower.id] = flower

        return flowers


class WikiAPI:
    @abstractmethod
    def query(self, query_string: str) -> Dict[str, any]:
        pass


class WikidataAPI(WikiAPI):
    _instance = None

    def query(self, query_string: str) -> Dict[str, any]:
        try:
            response = requests.get(
                "https://query.wikidata.org/sparql",
                params={"format": "json", "query": query_string},
            ).json()
        except JSONDecodeError:
            response = dict()
        return response

    @classmethod
    def instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance


class WikiTree:
    def __init__(self, seed: WikiSeed, api: WikiAPI = WikidataAPI.instance()):
        self.seed = seed
        self.flowers = dict()
        self.branches = dict()
        self.api = api
        self.db = Neo4jDB.instance()

    def grow(
        self,
        ids: List[str],
        branch_up: bool = True,
        branch_down: bool = True,
    ) -> Tuple[List[WikiFlower], List[WikiFlower]]:
        flowers_above, flowers_below = [], []
        # We only sprout (from db or wiki) if we don't have it in our flowers
        unseen_ids = [id for id in ids if id not in self.flowers]
        unseen_set = set(unseen_ids)
        if unseen_set:
            self.seed.sprout(unseen_ids, self)
        # seed.sprout/seed.branch_up/seed.branch_down will give back
        # unseen_flowers/parents/children
        # They will find a source(db/wiki) themselves.

        # Branch from flowers which are incomplete
        if branch_up:
            unbranched_up = [
                id for id in ids if id in unseen_set or not self.flowers[id].branched_up
            ]
            if unbranched_up:
                flowers_above.extend(self.seed.branch_up(unbranched_up, self))

        if branch_down:
            unbranched_down = [
                id
                for id in ids
                if id in unseen_set or not self.flowers[id].branched_down
            ]
            if unbranched_down:
                flowers_below.extend(self.seed.branch_down(unbranched_down, self))

        return flowers_above, flowers_below

    def grow_levels(
        self,
        ids: List[str],
        branch_up_levels: int,
        branch_down_levels: int,
        is_entry_point: bool = False,
    ) -> None:
        above, below = self.grow(
            ids,
            branch_up_levels > 0,
            branch_down_levels > 0,
        )
        if above and branch_up_levels - 1 > 0:
            self.grow_levels([flower.id for flower in above], branch_up_levels - 1, 0)
        if below and branch_down_levels - 1 > 0:
            self.grow_levels([flower.id for flower in below], 0, branch_down_levels - 1)

        # Only run when entirety of tree is constructed
        if is_entry_point:
            for lazy_petal in self.seed.lazy_petals:
                rel_flowers = [
                    flower
                    for flower in self.flowers.values()
                    if lazy_petal.label in flower.petals
                ]
                lazy_ids = [flower.petals[lazy_petal.label] for flower in rel_flowers]
                lazy_result = self.api.query(
                    lazy_petal.lazy_seed.self_stem.get_query(lazy_ids)
                )
                sub_flowers = WikiResult(lazy_result).parse(
                    lazy_petal.lazy_seed.petal_map
                )

                # Need to have a caller petal here to distinguish results
                sub_tree = {
                    sub_flower.petals["caller"]: sub_flower.to_json()
                    for sub_flower in sub_flowers
                }
                for flower in rel_flowers:
                    flower.petals[lazy_petal.label] = sub_tree[
                        flower.petals[lazy_petal.label]
                    ]

    def watering(self, ids, db_query, wiki_query, branching=True):
        # Combine multiple queries
        result = self.db.read_db(db_query, ids)
        incomplete_ids = []
        flowers_in_db = []
        if branching:
            # try to fetch from the DB
            id_im_pairs = DBResult(result).parse_immediate(self.seed.petal_map)

            for id, ims in id_im_pairs:
                if ims is None:
                    incomplete_ids.append(id)
                else:
                    flowers_in_db.extend(ims)
                    # ims is a list of flower
        else:
            id_it_pairs = DBResult(result).parse_itself(self.seed.petal_map)
            for id, it in id_it_pairs:
                if it is None:
                    incomplete_ids.append(id)
                else:
                    flowers_in_db.append(it)
                    # it is a flower, so we warp it

        # Incomplete ids should query the wiki
        if not incomplete_ids:
            return flowers_in_db

        result = self.api.query(wiki_query(incomplete_ids))
        flowers = WikiResult(result).parse(self.seed.petal_map)
        return flowers_in_db + flowers

    def to_json(self, for_db: bool = False) -> Dict[str, any]:
        data = {
            "flowers": [
                flower.to_json(for_db=for_db) for flower in self.flowers.values()
            ],
            "branches": {id: list(adj_set) for (id, adj_set) in self.branches.items()},
        }
        return data

    def write_to_database(self) -> None:
        flabels = {"name", "description", "branched_up", "branched_down"}
        json_data = json.dumps(self.to_json(for_db=True))
        self.db.write_db(merge_nodes_into_db, json_data, flabels, self.seed.petal_map)
        self.db.write_db(merge_relation_into_db, json_data)

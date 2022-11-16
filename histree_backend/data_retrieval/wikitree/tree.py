from abc import abstractmethod
from json import JSONDecodeError
from typing import Dict, List, Tuple
from qwikidata.sparql import return_sparql_query_results
from data_retrieval.query.parser import WikiResult
from .flower import WikiFlower, WikiPetal, WikiStem, UpWikiStem, DownWikiStem


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
            for petal in petals + up_stem.unique_petals + down_stem.unique_petals
        }

        _headers = dict(petal.to_dict_pair() for petal in petals)
        for stem in (self.self_stem, self.up_stem, self.down_stem):
            stem.set_query_template(_headers)

    def branch_up(self, ids: List[str], tree: "WikiTree") -> List[WikiFlower]:
        # Query for parents
        result = tree.api.query(self.up_stem.get_query(ids))
        parents = WikiResult(result).parse(self.petal_map)

        # Store parents in tree
        for parent in parents:
            tree.flowers[parent.id] = parent

            if parent.id not in tree.branches:
                tree.branches[parent.id] = set()
            tree.branches[parent.id].add(parent.petals[self.up_stem.caller])

        return parents

    def branch_down(self, ids: List[str], tree: "WikiTree") -> List[WikiFlower]:
        result = tree.api.query(self.down_stem.get_query(ids))
        children = WikiResult(result).parse(self.petal_map)

        seen_ids = set(ids)
        unseen_parent_ids = set()

        # Add children to tree and record unseen parents
        for child in children:
            tree.flowers[child.id] = child

            for parent_petal_label in self.down_stem.parents:
                parent_id = child.petals[parent_petal_label]
                if parent_id not in tree.flowers and parent_id not in seen_ids:
                    unseen_parent_ids.add(parent_id)
                if parent_id not in tree.branches:
                    tree.branches[parent_id] = set()
                tree.branches[parent_id].add(child.id)

        # Find information about parents not in tree
        parents = self.sprout(unseen_parent_ids, tree)
        for parent in parents:
            tree.flowers[parent.id] = parent

        return children

    def sprout(self, ids: List[str], tree: "WikiTree") -> List[WikiFlower]:
        result = tree.api.query(self.self_stem.get_query(ids))
        flowers = WikiResult(result).parse(self.petal_map)
        return flowers


class WikiAPI:
    @abstractmethod
    def query(self, query_string: str) -> Dict[str, any]:
        pass


class WikidataAPI(WikiAPI):
    _instance = None

    def query(self, query_string: str) -> Dict[str, any]:
        try:
            response = return_sparql_query_results(query_string)
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
        self.db = Neo4jDB.get_instance()

    def grow(
        self,
        ids: List[str],
        branch_up: bool = True,
        branch_down: bool = True,
    ) -> Tuple[List[WikiFlower], List[WikiFlower]]:
        flowers_above, flowers_below = [], []

        # Complete ids can be ignored as either:
        # - we don't need to branch up or down from them
        # - we have already branched from them and their immediates are in ids
        incomplete_ids = [
            id
            for id in ids
            if id not in self.flowers
            or (branch_up and not self.flowers[id].branched_up)
            or (branch_down and not self.flowers[id].branched_down)
        ]

        # Find petals of all unseen flowers
        
        # Uncomment below for database integration
        # unseen_flowers, unseen_ids = find_ids_in_database(incomplete_ids)

        # Keep uncommented below for w/o database integration
        unseen_flowers, unseen_ids = [], incomplete_ids

        unseen_flowers.extend(self.seed.sprout(unseen_ids, self))

        # Branch from flowers which are incomplete
        if branch_up:
            unbranched_up = [
                flower.id
                for flower in unseen_flowers
                if flower.id not in self.flowers
                or not self.flowers[flower.id].branched_up
            ]
            if unbranched_up:
                flowers_above.extend(self.seed.branch_up(unbranched_up, self))

        if branch_down:
            unbranched_down = [
                flower.id
                for flower in unseen_flowers
                if flower.id not in self.flowers
                or not self.flowers[flower.id].branched_down
            ]
            if unbranched_down:
                flowers_below.extend(self.seed.branch_down(unbranched_down, self))

        for flower in unseen_flowers:
            self.flowers[flower.id] = flower
        if branch_up:
            for id in unbranched_up:
                self.flowers[id].branched_up = True
        if branch_down:
            for id in unbranched_down:
                self.flowers[id].branched_down = True

        return flowers_above, flowers_below

    def grow_levels(
        self, ids: List[str], branch_up_levels: int, branch_down_levels: int
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

    def watering(self, id, query):
        # Combine multiple queries
        result = self.db.read_db(find_person, id)
        if not result:
            result = self.api.query(self.info_query_template % id)
            flowers = WikiResult(result).parse(self.petal_map)
        else :
            flowers = DBResult(result).parse(self.petal_map)
        return flowers

    def to_json(self) -> Dict[str, any]:
        return {
            "flowers": [flower.to_json() for flower in self.flowers.values()],
            "branches": {id: list(adj_set) for (id, adj_set) in self.branches.items()},
        }

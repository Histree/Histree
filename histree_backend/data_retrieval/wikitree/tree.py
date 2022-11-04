from abc import abstractmethod
from typing import Dict, List
from qwikidata.entity import WikidataItem
from qwikidata.linked_data_interface import get_entity_dict_from_api
from .flower import WikiFlower, WikiPetal, WikiStem


class WikiSeed:
    def __init__(self, up_stem: WikiStem, down_stem: WikiStem, partner_stem: WikiStem, petals: List[WikiPetal]):
        self.up_stem, self.down_stem = up_stem, down_stem
        self.partner_stem = partner_stem
        self.petals = set(petals)

    def branch_up(self, item: WikidataItem, tree: "WikiTree") -> None:
        parent_flowers = self.up_stem.parse(
            item, tree.flowers)

        for parent_flower in parent_flowers:
            tree.grow(parent_flower.id,
                      branch_up=False, branch_down=False)
            if parent_flower.id not in tree.branches:
                tree.branches[parent_flower.id] = set()
            tree.branches[parent_flower.id].add(
                item.entity_id)

    def branch_down(self, item: WikidataItem, tree: "WikiTree") -> None:
        # Add children flowers to collection
        children_flowers = self.down_stem.parse(
            item, tree.flowers)

        if children_flowers and item.entity_id not in tree.branches:
            tree.branches[item.entity_id] = set()

        # Find petals and parents of each child flower
        for child_flower in children_flowers:
            tree.grow(child_flower.id,
                      branch_up=True, branch_down=False)
            tree.branches[item.entity_id].add(
                child_flower.id)


class WikiAPI:
    @abstractmethod
    def get_wikidata_item(id: str) -> WikidataItem:
        pass


class WikidataAPI(WikiAPI):
    _instance = None

    def get_wikidata_item(self, id: str) -> WikidataItem:
        return WikidataItem(get_entity_dict_from_api(id))

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

    def grow(self, id: str, branch_up: bool = True, branch_down: bool = True) -> None:
        if id in self.flowers and self.flowers[id].branched_up and self.flowers[id].branched_down:
            return
        item = self.api.get_wikidata_item(id)
        # Find petals of the flower
        if id not in self.flowers:
            self.flowers[id] = WikiFlower(id, dict())
            self.flowers[id].name = item.get_label()
        flower = self.flowers[id]

        if not flower.petals:
            flower_petals = {petal.label: petal.parse(
                item) for petal in self.seed.petals}
            flower.petals = flower_petals

        # Branch off from the flower to find immediate nearby flowers
        if branch_up and not flower.branched_up:
            self.seed.branch_up(item, self)
            flower.branched_up = True
        if branch_down and not flower.branched_down:
            self.seed.branch_down(item, self)
            flower.branched_down = True

    def to_json(self) -> Dict[str, any]:
        return {
            'flowers': [flower.to_json() for flower in self.flowers.values()],
            'branches': self.branches
        }

from typing import List
from qwikidata.entity import WikidataItem
from qwikidata.linked_data_interface import get_entity_dict_from_api
from wikitree.flower import WikiFlower, WikiPair, WikiPetal, WikiStem


class WikiSeed:
    def __init__(self, up_stem: WikiStem, down_stem: WikiStem, partner_stem: WikiStem, petals: List[WikiPetal]):
        self.up_stem, self.down_stem = up_stem, down_stem
        self.partner_stem = partner_stem
        self.petals = set(petals)

    def branch(self, item: WikidataItem, tree: "WikiTree") -> None:
        parent_flowers = self.up_stem.parse(
            item, tree.flowers)

        if len(parent_flowers) < 2:
            # If missing parents, then pad until enough
            parent_flowers.extend(
                [tree.flowers.get('')] * (2 - len(parent_flowers)))

        # Store item/flower's parents as a WikiPair
        parent_pair = WikiPair(
            parent_flowers[0], parent_flowers[1])
        tree.pairs[parent_pair.id] = parent_pair

        # Store item/flower and its partner as a WikiPair
        partner_flowers = self.partner_stem.parse(
            item, tree.flowers)
        flower_pair = WikiPair(
            tree.flowers[item.entity_id], partner_flowers[0] if partner_flowers else tree.flowers.get(''))
        tree.pairs[flower_pair.id] = flower_pair

        # Add children flowers to collection
        children_flowers = self.down_stem.parse(
            item, tree.flowers)
        for child_flower in children_flowers:
            child_flower.pair = flower_pair.id
            tree.flowers[child_flower.id] = child_flower


class WikiTree:
    def __init__(self, seed: WikiSeed):
        self.seed = seed
        self.flowers = {'': WikiFlower('', dict())}
        self.pairs = dict()

    def grow(self, id: str) -> None:
        if id in self.flowers and self.flowers[id].branched:
            return
        item = WikidataItem(
            get_entity_dict_from_api(id))

        # Find petals of the flower
        flower_petals = {petal.label: petal.parse(
            item) for petal in self.seed.petals}
        self.flowers[id] = WikiFlower(id, flower_petals)

        # Branch off from the flower to find immediate nearby flowers
        self.seed.branch(item, self)
        self.flowers[id].branched = True

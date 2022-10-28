from typing import Dict, List
from qwikidata.entity import WikidataItem
from qwikidata.linked_data_interface import get_entity_dict_from_api
from wikitree.flower import WikiFlower, WikiPair, WikiPetal, WikiStem


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

        if len(parent_flowers) < 2:
            # If missing parents, then pad until enough
            parent_flowers.extend(
                [tree.flowers.get('')] * (2 - len(parent_flowers)))

        # Store item/flower's parents as a WikiPair
        parent_pair = WikiPair(
            parent_flowers[0], parent_flowers[1])
        tree.pairs[parent_pair.id] = parent_pair

        # Keep track of parents from the origin flower
        tree.flowers[item.entity_id].pair = parent_pair.id

    def branch_down(self, item: WikidataItem, tree: "WikiTree") -> None:
        # # May not be necessary if we don't consider spouse without children
        # # Store item/flower and its partner as a WikiPair
        # partner_flowers = self.partner_stem.parse(
        #     item, tree.flowers)
        # for partner_flower in partner_flowers:
        #     if not partner_flower:
        #         continue
        #     flower_pair = WikiPair(tree.flowers[item.entity_id], partner_flower)
        #     tree.pairs[flower_pair.id] = flower_pair

        # Add children flowers to collection
        children_flowers = self.down_stem.parse(
            item, tree.flowers)

        # Find petals and parents of each child flower
        for child_flower in children_flowers:
            tree.grow(child_flower.id,
                      branch_up=True, branch_down=False)


class WikiTree:
    def __init__(self, seed: WikiSeed):
        self.seed = seed
        self.flowers = {'': WikiFlower('', dict())}
        self.pairs = dict()

    def grow(self, id: str, branch_up: bool = True, branch_down: bool = True) -> None:
        if id in self.flowers and self.flowers[id].branched_up and self.flowers[id].branched_down:
            return
        item = WikidataItem(
            get_entity_dict_from_api(id))

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
            'pairs': [pair.to_json() for pair in self.pairs.values()]
        }

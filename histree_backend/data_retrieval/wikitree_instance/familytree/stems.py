from typing import Dict, List

from data_retrieval.wikitree.flower import WikiFlower, WikiStem
from qwikidata.entity import WikidataItem
from data_retrieval.wikitree_instance.familytree.property import PROPERTY_MAP



class HumanStem(WikiStem):
    def __init__(self, id):
        super().__init__(id)

    def parse(self, item: WikidataItem, flowers: Dict[str, WikiFlower]) -> List[WikiFlower]:
        humans = [claim.mainsnak.datavalue.value['id'] for claim in item.get_claim_group(
            self.id)._claims if claim.mainsnak.datavalue]
        if not humans:
            return []
        return [flowers.get(human, WikiFlower(human, dict())) for human in humans]


class ChildStem(HumanStem):
    def __init__(self):
        super().__init__(PROPERTY_MAP["stems"]["child"])


class FatherStem(HumanStem):
    def __init__(self):
        super().__init__(PROPERTY_MAP["stems"]["father"])


class MotherStem(HumanStem):
    def __init__(self):
        super().__init__(PROPERTY_MAP["stems"]["mother"])


class ParentStem(WikiStem):
    def __init__(self):
        super().__init__(PROPERTY_MAP["stems"]["parent"])

    def parse(self, item: WikidataItem, flowers: Dict[str, WikiFlower]) -> List[WikiFlower]:
        return sum([parent_stem.instance().parse(item, flowers) for parent_stem in (FatherStem, MotherStem)], [])


class SpouseStem(WikiStem):
    def __init__(self):
        super().__init__(PROPERTY_MAP["stems"]["spouse"])

    def parse(self, item: WikidataItem, flowers: Dict[str, WikiFlower]) -> List[WikiFlower]:
        spouses = [claim.mainsnak.datavalue.value['id'] for claim in item.get_claim_group(
            self.id)._claims if claim.mainsnak.datavalue]
        if not spouses:
            return []
        return [flowers.get(spouse, WikiFlower(spouse, dict())) for spouse in spouses]

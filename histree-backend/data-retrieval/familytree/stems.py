from typing import Dict, List
from wikitree.flower import WikiFlower, WikiStem
from qwikidata.entity import WikidataItem


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
        super().__init__("P40")


class FatherStem(HumanStem):
    def __init__(self):
        super().__init__("P22")


class MotherStem(HumanStem):
    def __init__(self):
        super().__init__("P25")


class ParentStem(WikiStem):
    def __init__(self):
        super().__init__("P8810")

    def parse(self, item: WikidataItem, flowers: Dict[str, WikiFlower]) -> List[WikiFlower]:
        return sum([parent_stem.instance().parse(item, flowers) for parent_stem in (FatherStem, MotherStem)], [])


class SpouseStem(WikiStem):
    def __init__(self):
        super().__init__("P26")

    def parse(self, item: WikidataItem, flowers: Dict[str, WikiFlower]) -> List[WikiFlower]:
        spouses = [claim.mainsnak.datavalue.value['id'] for claim in item.get_claim_group(
            self.id)._claims if claim.mainsnak.datavalue]
        if not spouses:
            return []
        return [flowers.get(spouse, WikiFlower(spouse, dict())) for spouse in spouses]

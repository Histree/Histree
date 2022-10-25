from abc import abstractmethod
from typing import Dict, List
from qwikidata.entity import WikidataItem


class WikiFlower:
    def __init__(self, id: str, petals: Dict[str, str]):
        self.id = id
        self.petals = petals
        self.branched = False
        self.pair = None


class WikiPair:
    def __init__(self, parent: WikiFlower, other: WikiFlower):
        self.id = self._hash_id_pair(parent.id, other.id)
        self.flowers = [flower for flower in (
            parent, other) if flower]

    def _hash_id_pair(self, id: str, other_id: str) -> str:
        return ''.join(sorted((id, other_id)))


class WikiPetal:
    undefined = "undefined"

    def __init__(self, id: str, label: str):
        self.id = id
        self.label = label

    @abstractmethod
    def parse(self, item: WikidataItem) -> str:
        pass


class WikiStem:
    def __init__(self, id: str):
        self.id = id

    @abstractmethod
    def parse(self, item: WikidataItem, flowers: Dict[str, WikiFlower]) -> List[WikiFlower]:
        pass

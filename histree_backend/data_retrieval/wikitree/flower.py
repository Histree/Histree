from abc import abstractmethod
from typing import Dict, List
from qwikidata.entity import WikidataItem


class WikiFlower:
    def __init__(self, id: str, petals: Dict[str, str]):
        self.id = id
        self.name = ""
        self.description = ""
        self.petals = petals
        self.branched_up = False
        self.branched_down = False

    def to_json(self) -> Dict[str, any]:
        json_dict = {
            "id": self.id,
            "name": self.name,
            "petals": self.petals
        }
        if self.description:
            json_dict["description"] = self.description
        return json_dict


# Currently unused
class WikiPair:
    def __init__(self, parent: WikiFlower, other: WikiFlower):
        self.id = self._hash_id_pair(parent.id, other.id)
        self.flowers = [flower for flower in (
            parent, other) if flower]

    def _hash_id_pair(self, id: str, other_id: str) -> str:
        return ''.join(sorted((id, other_id)))

    def to_json(self) -> Dict[str, any]:
        return {
            "id": self.id,
            "flowers": [flower.id for flower in self.flowers]
        }


class WikiPetal:
    _instance = None
    undefined = "undefined"

    def __init__(self, id: str, label: str):
        self.id = id
        self.label = label

    @abstractmethod
    def parse(self, item: WikidataItem) -> str:
        pass

    @classmethod
    def instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance


class WikiStem:
    _instance = None

    def __init__(self, id: str):
        self.id = id

    @abstractmethod
    def parse(self, item: WikidataItem, flowers: Dict[str, WikiFlower]) -> List[WikiFlower]:
        pass

    @classmethod
    def instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

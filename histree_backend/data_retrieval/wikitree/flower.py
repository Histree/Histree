from abc import abstractmethod
from typing import Dict, List, Tuple
from qwikidata.entity import WikidataItem


class WikiFlower:
    _hidden_petals = {"caller", "father", "mother"}
    _defaults = {"name", "description", "branched_up", "branched_down"}

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
            "petals": {k: v for (k, v) in self.petals.items() if k not in self._hidden_petals},
            "branched_up": self.branched_up,
            "branched_down": self.branched_down
        }
        if self.description:
            json_dict["description"] = self.description
        return json_dict


# Currently unused
class WikiPair:
    def __init__(self, parent: WikiFlower, other: WikiFlower):
        self.id = self._hash_id_pair(parent.id, other.id)
        self.flowers = [flower for flower in (parent, other) if flower]

    def _hash_id_pair(self, id: str, other_id: str) -> str:
        return "".join(sorted((id, other_id)))

    def to_json(self) -> Dict[str, any]:
        return {"id": self.id, "flowers": [flower.id for flower in self.flowers]}


class WikiPetal:
    _instance = None
    undefined = "undefined"

    def __init__(
        self, id: str, label: str, optional: bool = True, sample: bool = False
    ):
        self.id = id
        self.label = label
        self.optional = optional
        self.sample = sample

    def to_dict_pair(self) -> Tuple[str, Dict[str, any]]:
        return self.label, {
            "id": self.id,
            "optional": self.optional,
            "sample": self.sample,
        }

    @abstractmethod
    def parse(self, value: str) -> str:
        pass

    @classmethod
    def instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance


class WikiStem:
    _instance = None
    _TEMPLATE = "temp"
    _TEMPLATE_STR = f"%({_TEMPLATE})s"

    def __init__(self, id: str):
        self.id = id
        self.template = None
        self.unique_petals = []

    def get_query(self, ids: List[str]) -> str:
        return self.template % {self._TEMPLATE: " ".join(f"wd:{id}" for id in ids)}

    @abstractmethod
    def set_query_template(self, headers: Dict[str, any]) -> None:
        pass

    @classmethod
    def instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance


class UpWikiStem(WikiStem):
    def __init__(self, id: str, caller_petal: WikiPetal):
        super().__init__(id)

        self.caller = caller_petal.label
        self.unique_petals = [caller_petal]


class DownWikiStem(WikiStem):
    def __init__(self, id: str, parent_petals: List[WikiPetal]):
        super().__init__(id)

        self.parents = [petal.label for petal in parent_petals]
        self.unique_petals = parent_petals

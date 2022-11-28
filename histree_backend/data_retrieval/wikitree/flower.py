from abc import abstractmethod
from typing import Dict, List, Tuple


class WikiFlower:
    _hidden_petals = {"caller", "father", "mother"}
    _defaults = {"name", "description", "article", "branched_up", "branched_down"}

    def __init__(self, id: str, petals: Dict[str, str]):
        self.id = id
        self.name = ""
        self.description = ""
        self.article = ""
        self.petals = petals
        self.branched_up = False
        self.branched_down = False

    def to_json(self, flatten: bool = False, for_db: bool = False) -> Dict[str, any]:
        json_dict = {"id": self.id, "name": self.name}
        petals = {
            k: v for (k, v) in self.petals.items() if k not in self._hidden_petals
        }
        if flatten:
            json_dict.update(petals)
        else:
            json_dict["petals"] = petals

        if for_db:
            json_dict["branched_up"] = self.branched_up
            json_dict["branched_down"] = self.branched_down

            # Only return id for nested properties as db can only handle primitives
            for k, v in json_dict["petals"].items():
                if isinstance(v, dict):
                    json_dict["petals"][k] = v["id"]

        if self.description:
            json_dict["description"] = self.description
        if self.article:
            json_dict["article"] = self.article
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
        self,
        id: str,
        label: str,
        optional: bool = True,
        sample: bool = False,
        label_only: bool = False,
        lazy_seed: "WikiSeed" = None,
    ):
        """
        id:             wikidata property id
        label:          property label
        optional:       specifies if entries MUST have this attribute
        sample:         specifies if only a sample of possibly many should be taken
        lazy_seed:      specifies the seed of how the attribute is to be queried further
        label_only:     specifies if attribute is given by an id but only label is required
        """
        self.id = id
        self.label = label
        self.optional = optional
        self.sample = sample
        self.lazy_seed = lazy_seed
        self.label_only = label_only

    def to_dict_pair(self) -> Tuple[str, Dict[str, any]]:
        return self.label, {
            "id": self.id,
            "optional": self.optional,
            "sample": self.sample,
            "lazy_seed": self.lazy_seed,
            "label_only": self.label_only,
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

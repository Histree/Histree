from typing import List
from data_retrieval.wikitree.flower import WikiPetal
from data_retrieval.wikitree_instance.familytree.property import PROPERTY_MAP
from data_retrieval.wikitree_instance.locationtree.seed import LocationSeed

# Date Attributes
class DatePetal(WikiPetal):
    def __init__(self, id, label):
        super().__init__(id, label, optional=True, sample=True)

    def parse(self, value: str) -> str:
        if not value:
            return self.undefined
        return value.split("T")[0]


class BirthDatePetal(DatePetal):
    def __init__(self):
        label = "date_of_birth"
        super().__init__(PROPERTY_MAP["petals"][label], label)


class DeathDatePetal(DatePetal):
    def __init__(self):
        label = "date_of_death"
        super().__init__(PROPERTY_MAP["petals"][label], label)


# Location Attributes
class LocationPetal(WikiPetal):
    def __init__(self, id, label):
        super().__init__(id, label, optional=True, lazy_seed=LocationSeed.instance())

    def parse(self, value: str) -> str:
        if not value:
            return self.undefined
        return value.split("/")[-1]


class BirthPlacePetal(LocationPetal):
    def __init__(self):
        label = "place_of_birth"
        super().__init__(PROPERTY_MAP["petals"][label], label)


class DeathPlacePetal(LocationPetal):
    def __init__(self):
        label = "place_of_death"
        super().__init__(PROPERTY_MAP["petals"][label], label)


# Personal Attributes
class GenderPetal(WikiPetal):
    gender_map = {
        "Q6581097": "male",
        "Q6581072": "female",
        "Q48270": "non-binary",
        "Q1097630": "intersex",
        "Q2449503": "transgender male",
        "Q1052281": "transgender female",
        "Q505371": "agender",
    }
    genders = set(gender_map.values())

    def __init__(self):
        label = "gender"
        super().__init__(
            PROPERTY_MAP["petals"][label], label, optional=True, sample=True
        )

    def parse(self, value: str) -> str:
        if value in self.genders:
            return value
        id = value.split("/")[-1]
        return self.gender_map.get(id, self.undefined)


class BirthNamePetal(WikiPetal):
    def __init__(self):
        label = "birth_name"
        super().__init__(
            PROPERTY_MAP["petals"][label], label, optional=True, sample=True
        )

    def parse(self, value: str) -> str:
        return value


# Miscellaneous Attributes
class ImagePetal(WikiPetal):
    def __init__(self):
        label = "image"
        super().__init__(
            PROPERTY_MAP["petals"][label], label, optional=True, sample=True
        )

    def parse(self, value: str) -> str:
        return value


class CallerPetal(WikiPetal):
    def __init__(self):
        super().__init__(-1, "caller")

    def parse(self, value: str) -> str:
        return value.split("/")[-1]


# Relationship Attributes
class RelationPetal(WikiPetal):
    def __init__(self, id, label):
        super().__init__(id, label, optional=True, sample=True)

    def parse(self, value: str) -> str:
        return value.split("/")[-1]


class FatherPetal(RelationPetal):
    def __init__(self):
        label = "father"
        super().__init__(PROPERTY_MAP["stems"][label], label)


class MotherPetal(RelationPetal):
    def __init__(self):
        label = "mother"
        super().__init__(PROPERTY_MAP["stems"][label], label)


class SpousePetal(WikiPetal):
    def __init__(self):
        label = "spouse"
        super().__init__(PROPERTY_MAP["stems"][label], label, grouped=True)

    def parse(self, value: str) -> List[str]:
        if not value:
            return []
        return [id_str.split("/")[-1] for id_str in value.split(",")]

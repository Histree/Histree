from data_retrieval.wikitree.flower import WikiPetal
from data_retrieval.wikitree_instance.locationtree.property import PROPERTY_MAP

# Location Attributes
class CoordinatesPetal(WikiPetal):
    def __init__(self):
        label = "coordinate_location"
        super().__init__(PROPERTY_MAP["petals"][label], label, optional=True)

    def parse(self, value: str) -> str:
        longitude, latitude = value.removeprefix("Point(").removesuffix(")").split(" ")
        return {"latitude": latitude, "longitude": longitude}


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


class LocationPetal(RelationPetal):
    def __init__(self):
        label = "location"
        super().__init__(PROPERTY_MAP["stems"][label], label)

from data_retrieval.wikitree.tree import WikiSeed, WikiTree
from data_retrieval.wikitree_instance.locationtree.petals import *
from data_retrieval.wikitree_instance.locationtree.stems import *


class LocationSeed(WikiSeed):
    _instance = None

    def __init__(self):
        super().__init__(
            self_stem=SelfStem.instance(),
            up_stem=None,
            down_stem=None,
            petals=[
                CallerPetal.instance(),
                CoordinatesPetal.instance(),
                ImagePetal.instance(),
            ],
        )

    @classmethod
    def instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance


class LocationTree(WikiTree):
    _instance = None

    def __init__(self):
        super.__init__(LocationSeed.instance())

    def instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

from data_retrieval.wikitree.tree import WikiSeed, WikiTree
from data_retrieval.wikitree_instance.familytree.petals import *
from data_retrieval.wikitree_instance.familytree.stems import *


class FamilySeed(WikiSeed):
    _instance = None

    def __init__(self):
        super().__init__(
            self_stem=SelfStem.instance(),
            up_stem=ParentStem.instance(),
            down_stem=ChildStem.instance(),
            petals=[
                BirthNamePetal.instance(),
                GenderPetal.instance(),
                BirthDatePetal.instance(),
                BirthPlacePetal.instance(),
                DeathDatePetal.instance(),
                DeathPlacePetal.instance(),
                ImagePetal.instance(),
            ],
        )

    @classmethod
    def instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance


class FamilyTree(WikiTree):
    _instance = None

    def __init__(self):
        super.__init__(FamilySeed.instance())

    def instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

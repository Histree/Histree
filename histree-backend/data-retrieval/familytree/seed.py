from wikitree.tree import WikiSeed
from familytree.petals import *
from familytree.stems import *


class FamilySeed(WikiSeed):
    def __init__(self):
        super().__init__(
            up_stem=ParentStem.instance(),
            down_stem=ChildStem.instance(),
            partner_stem=SpouseStem.instance(),
            petals=[
                NamePetal.instance(),
                GenderPetal.instance(),
                BirthDatePetal.instance(),
                DeathDatePetal.instance()
            ]
        )

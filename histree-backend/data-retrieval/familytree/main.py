from seed import FamilySeed
from wikitree.tree import WikiTree
from wrapper import WikiNetwork
from queryBuilder import HistreeQuery


query = HistreeQuery()
seed = query.queryBuilder()

tree = WikiTree(FamilySeed())
tree.grow(seed)
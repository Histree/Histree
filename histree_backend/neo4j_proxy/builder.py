from abc import abstractmethod
from ..data_retrieval.wikitree.tree import WikiSeed, WikiFlower
class CypherBuilder:

    def __init__(self) -> None:
        pass
    
    @abstractmethod
    def build(self) -> str:
        pass

# query -> driver: rows of result (reutrn type in query) -> parse to tc

class FindSingleNodeBuilder(CypherBuilder):
    
    def __init__(self, type, key, value) -> None:
        super().__init__()
        self.type = None
        pass


    def build(self) -> str:
        pass


FLOWER_ATTR = ['name', 'desciption', 'petals']

def merge_line(flower: 'WikiFlower'):

    type = f':{flower.type}' if flower.type else ''

    #merging must be searched by id to be safe
    return f"MERGE (node{type}" + "{" f"id: flower.{flower.id}" +"}) "

def find_node(flower: 'WikiFlower'):
    type = f':{flower.type}' if flower.type else ''

    #merging must be searched by id to be safe
    return (f"MATCH (node{type}" + "{" f"id: flower.{flower.id}" +"}) "
            "RETURN node"
    )


def setting_props(flow_props, seed: 'WikiSeed') -> str:
    ret = ''
    for label in flow_props:
        ret += f"node.{label} = flower.{label}, "
    for petal in seed.petals:
        label = petal.label
        ret += f"node.{label} = petal.{label}, "
    return "ON CREATE SET \n" + ret.rstrip(', ')


def merge_node_query(seed: 'WikiSeed', json_data: str, flower: 'WikiFlower'):
    query = (
            "WITH $json_data AS document "
            "UNWIND document.flowers AS flower "
            "UNWIND flower.petals AS petal "
            f"{merge_line(flower)}"
            f"{setting_props(FLOWER_ATTR, seed)}"
            "RETURN node" # what to retrun with parser?
    )

def merge_relation_query(seed: 'WikiSeed', json_data: str):
    query = (
        "WITH $json_data AS document "
        "UNWIND document.branches AS branch "
        "UNWIND keys(branch) AS parent "
        "UNWIND branch[from] AS child "
        "MATCH (from:Person {id: parent}), \
                (to:Person {id: child}) "
        "MERGE (from)-[r:PARENT_OF]->(to) "
        "RETURN from, r, to"
    )

def setting_relation():
    pass

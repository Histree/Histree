from typing import Dict
from wrapper import WikiNetwork
from wikitree.tree import WikiTree
from familytree.seed import FamilySeed

class HistreeQuery:
    def __init__(self) -> None:
        pass

    def queryBuilder(self) -> str:
        seed = input("Name to Query: ")

        network = WikiNetwork()
        matches = network.retrieve_potential_seeds(seed)

        print("Potential matches for Query: ")

        for i in range(0, len(matches)):
            (_, label) = matches[i]
            print(f"{i + 1}. {label}") 

        qid = int(input("Choose the option you wish to query: ")) - 1

        return matches[qid][0]
    
    def disambiguateQuery(self, name) -> Dict[str, str]:
        network = WikiNetwork()

        matches = dict()

        # want to cache this or use a trie so that we don't query it each time
        for (qid, label) in network.retrieve_potential_seeds(name):
            matches[label] = qid
        
        return matches
    
    def getTreeFromQuery(self, qid, seed) -> WikiTree:
        tree = WikiTree(seed)
        tree.grow(qid)
        return tree
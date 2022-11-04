import re
from typing import Dict
from data_retrieval.wikitree.tree import WikiSeed, WikiTree
from data_retrieval.wikitree_instance.familytree.seed import FamilySeed
from qwikidata.sparql import return_sparql_query_results


class HistreeQuery:
    @staticmethod
    def processQueryString(name: str) -> str:
        # standardises the capitalisation of query string to be consistent with Wikidata expectations
        
        prepos = {"the", "of", "in", "and"}
        isRomanNumeral = lambda w : bool(re.search(r"^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$",w))

        words = name.split()
        for i in range(len(words)):
            word = words[i]
            if word not in prepos:
                if isRomanNumeral(word.upper()):
                    words[i] = word.upper()
                else:
                    words[i] = word.capitalize()
        
        return " ".join(words)

    @staticmethod
    def search_matching_names(name: str, instance_of: str = "Q5", language: str = "en") -> Dict[str, str]:
        # Check if name has been queried before in db and return if so
        input = HistreeQuery.processQueryString(name)
        # Otherwise, query wikidata directly
        query = f'''
            SELECT distinct ?item ?itemLabel ?itemAltLabel WHERE{{  
                ?item ?label "{input}"@{language}.  
                ?item wdt:P31 wd:{instance_of} .
                ?article schema:about ?item .
                ?article schema:inLanguage "{language}" .
                ?article schema:isPartOf <https://en.wikipedia.org/>.	
                SERVICE wikibase:label {{ bd:serviceParam wikibase:language "{language}". }}    
            }}
        '''

        res = return_sparql_query_results(query)
        
        qid_label_map = dict()
        unique_labels = set()

        for row in res["results"]["bindings"]:
            qid = row["item"]["value"].split('/')[-1]
            label = row["itemLabel"]["value"]
            unique_label = True

            
            # Generate a unique label for each query item by looking at list of
            # alternate names. If no unique alternative labels exist for the item,
            # it is not included in the results dictionary.
            if label in unique_labels:
                unique_label = False
                if row.get("itemAltLabel") != None:
                    for l in [s.strip() for s in row["itemAltLabel"]["value"].split(',')]:
                        if l not in unique_labels:
                            unique_labels.add(l)
                            unique_label = True
                            label = l
                            break
            else:
                unique_labels.add(label)

            if unique_label :
                qid_label_map[qid] = label

        return qid_label_map

    @staticmethod
    def get_tree_from_id(qid: str, seed: WikiSeed=FamilySeed.instance(), branch_up_levels: int = 2, branch_down_levels: int = 2) -> Dict[str, any]:
        tree = WikiTree(seed)
        tree.grow_levels(qid, branch_up_levels, branch_down_levels)
        return tree.to_json()


    def _query_cli() -> None:
        name = input("Name to Query: ")
        matches = list(HistreeQuery.search_matching_names(name).items())

        print("Potential matches for Query: ")
        for (i, label) in enumerate(matches):
            print(f"{i + 1}. {label[1]}")

        index = int(
            input("Choose the option you wish to query: ")) - 1
        qid = matches[index][0]

        tree_json = HistreeQuery.get_tree_from_id(qid)
        print(tree_json)

    
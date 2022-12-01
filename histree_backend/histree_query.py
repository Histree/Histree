import re
import concurrent.futures
from typing import Dict, List
from data_retrieval.query.name_query import NameQueryBuilder
from data_retrieval.wikitree.tree import WikiSeed, WikiTree
from data_retrieval.wikitree_instance.familytree.seed import FamilySeed
from qwikidata.sparql import return_sparql_query_results


class HistreeQuery:
    @staticmethod
    def processQueryString(name: str) -> str:
        # standardises the capitalisation of query string to be consistent with Wikidata expectations

        prepos = {"the", "of", "in", "and"}

        def isRomanNumeral(w):
            return bool(
                re.search(
                    r"^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$", w
                )
            )

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
    def search_matching_names(
        name: str,
        instance: str = "Q5",
        pages: int = 2,
        language: str = "en",
    ) -> Dict[int, Dict[str, str]]:
        # Check if name has been queried before in db and return if so

        # Otherwise, query wikidata directly
        queries = [
            NameQueryBuilder(pagination=i)
            .with_name(name)
            .with_instance(instance)
            .matches_regex(name)
            .ordered_by("?num")
            .build()
            for i in range(pages)
        ]

        results = []
        with concurrent.futures.ThreadPoolExecutor(max_workers=pages) as executor:
            results = executor.map(return_sparql_query_results, queries)

        qid_label_map = []
        for res in results:
            for row in res["results"]["bindings"]:
                qid_label_map.append(
                    {
                        "id": row["item"]["value"].split("/")[-1],
                        "label": row["label"]["value"],
                        "description": row["description"]["value"],
                    }
                )

        return qid_label_map

    @staticmethod
    def get_tree_from_ids(
        qids: List[str],
        seed: WikiSeed = FamilySeed.instance(),
        branch_up_levels: int = 1,
        branch_down_levels: int = 1,
    ) -> Dict[str, any]:
        tree = WikiTree(seed)
        tree.grow_levels(qids, branch_up_levels, branch_down_levels, is_entry_point=True)
        tree.write_to_database()
        return tree.to_json()

    def _query_cli() -> None:
        name = input("Name to Query: ")
        matches = list(HistreeQuery.search_matching_names(name).items())

        print("Potential matches for Query: ")
        for (i, label) in enumerate(matches):
            print(f"{i + 1}. {label[1]}")

        index = int(input("Choose the option you wish to query: ")) - 1
        qid = matches[index][0]

        tree_json = HistreeQuery.get_tree_from_ids([qid])
        print(tree_json)

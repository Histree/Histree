from queue import Empty
from tokenize import String
from typing import Dict, List, Tuple
from qwikidata.entity import WikidataItem
from qwikidata.linked_data_interface import get_entity_dict_from_api
from property import PROPERTY_MAP
from qwikidata.sparql import return_sparql_query_results

class WikiNetwork:
    def __init__(self):
        self.network = dict()

    def add_person(self, id: str) -> None:
        self.network[id] = WikiPerson(id, self)

    def add_person_and_immediates(self, id: str) -> None:
        self.add_person(id)
        self.network[id].add_relationships_to_network()
    
    def retrieve_potential_seeds(self, name) -> List[Tuple[str, str]]:
        id_to_person = []

        query = '''
            SELECT distinct ?item ?itemLabel WHERE{  
                ?item ?label \"''' + name + '''\"@en.  
                ?item wdt:P31 wd:Q5 .
                ?article schema:about ?item .
                ?article schema:inLanguage "en" .
                ?article schema:isPartOf <https://en.wikipedia.org/>.	
                SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }    
            }
        '''

        res = return_sparql_query_results(query)

        for row in res["results"]["bindings"]:
            qid = row["item"]["value"].split('/')[-1]
            wikiLabel = row["itemLabel"]["value"]
            id_to_person.append((qid, wikiLabel))
        
        return id_to_person


class WikiPerson:
    def __init__(self, id: str, network: WikiNetwork):
        self.id = id
        self.name = ""
        self.network = network

        self.attributes = dict()
        self.relationships = dict()
        self._populate_info()

    def _populate_info(self) -> None:
        entity_dict = get_entity_dict_from_api(self.id)
        item = WikidataItem(entity_dict)
        self.name = item.get_label()

        for (property, label) in PROPERTY_MAP['relationships']['direct'].items():
            claim_group = item.get_claim_group(
                property)._claims
            if not claim_group:
                continue
            self.relationships[label] = set(
                claim.mainsnak.datavalue.value['id'] for claim in claim_group)

        # Attributes need to be parsed individually as not all have the id
        # property - some involve dates or numerical values.

        # for (property, label) in PROPERTY_MAP['attributes'].items():
        #     claim_group = item.get_claim_group(
        #         property)._claims
        #     if not claim_group:
        #         continue
        #     self.attributes[label] = set(
        #         claim.mainsnak.datavalue.value['id'] for claim in claim_group)

    def add_relationships_to_network(self) -> None:
        for relations in self.relationships.values():
            for person in relations:
                if person not in self.network.network:
                    self.network.add_person(person)

    def __str__(self) -> str:
        return self.name

    __repr__ = __str__

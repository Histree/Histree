from typing import Dict, List, Tuple
from qwikidata.entity import WikidataItem
from qwikidata.linked_data_interface import get_entity_dict_from_api
from property import PROPERTY_MAP
from qwikidata.sparql import return_sparql_query_results


class WikiNetwork:
    def __init__(self):
        self.network: Dict[str, WikiPerson] = dict()
        self.families: Dict[str, WikiFamily] = dict()

    def add_person(self, id: str) -> None:
        self.network[id] = WikiPerson(id, self)

    def add_person_and_immediates(self, id: str) -> None:
        self.add_person(id)
        self.network[id].add_relationships_to_network()

    def add_family(self, parents: Tuple[str, str]) -> str:
        family = WikiFamily(parents)

        if family.id not in self.families:
            self.families[family.id] = family
        return family.id

    def to_json(self) -> Dict[str, any]:
        output = dict()
        output['person'] = [person.to_json()
                            for person in self.network.values()]
        output['family'] = [family.to_json()
                            for family in self.families.values()]
        return output

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
        self.parents = ""
        self.network = network

        self.attributes = dict()
        self.relationships = dict()
        self._populate_info()

    def _populate_info(self) -> None:
        entity_dict = get_entity_dict_from_api(self.id)
        item = WikidataItem(entity_dict)
        self.name = item.get_label()

        # Store immediate relationships
        for (label, property) in PROPERTY_MAP['relationships']['direct'].items():
            claim_group = item.get_claim_group(
                property)._claims
            if not claim_group:
                continue
            self.relationships[label] = set(
                claim.mainsnak.datavalue.value['id'] for claim in claim_group)

        # Keep track of family
        self.parents = self.network.add_family(
            self._get_parent_ids())

        # Attributes need to be parsed individually as not all have the id
        # property - some involve dates or numerical values.

        # for (label, property) in PROPERTY_MAP['attributes'].items():
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

    def to_json(self) -> Dict[str, any]:
        output = dict()
        output['id'] = self.id
        output['name'] = self.name
        output['parents'] = self.parents
        output['metadata'] = list(self.attributes.items())
        return output

    def _get_parent_ids(self) -> Tuple[str, str]:
        parents = [next(iter(self.relationships.get(parent, {''})))
                   for parent in ('mother', 'father')]
        return (parents[0], parents[1])

    def __str__(self) -> str:
        return self.name

    __repr__ = __str__


class WikiFamily:
    def __init__(self, parents: Tuple[str, str], metadata: Dict[str, any] = None):
        self.id = self._hash_id_pair(parents[0], parents[1])
        self.parents = parents
        self.metadata = metadata

    def to_json(self) -> Dict[str, any]:
        output = dict()
        output['id'] = self.id
        output['parents'] = list(self.parents)
        if self.metadata:
            output['metadata'] = list(self.metadata.items())
        return output

    def _hash_id_pair(self, id: str, other_id: str) -> str:
        return ''.join(sorted((id, other_id)))

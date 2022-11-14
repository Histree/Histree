from typing import Dict, List
from data_retrieval.query.builder import SPARQLBuilder
from data_retrieval.wikitree.flower import WikiFlower, WikiStem
from qwikidata.entity import WikidataItem
from data_retrieval.wikitree_instance.familytree.property import PROPERTY_MAP


class HumanStem(WikiStem):
    def __init__(self, id):
        super().__init__(id)

    def set_query_template(self, headers: Dict[str, any]) -> None:
        self.template = (
            SPARQLBuilder(headers)
            .with_property(self.id, self._TEMPLATE_STR)
            .build()
        )


class ChildStem(HumanStem):
    def __init__(self):
        super().__init__(PROPERTY_MAP["stems"]["child"])

    def set_query_template(self, headers: Dict[str, any]) -> None:
        self.template = (
            SPARQLBuilder(headers)
            .with_any_property(
                [
                    PROPERTY_MAP["stems"][label]
                    for label in ("mother", "father", "parent")
                ],
                self._TEMPLATE_STR,
            )
            .build()
        )


class ParentStem(WikiStem):
    def __init__(self):
        super().__init__(PROPERTY_MAP["stems"]["parent"])

    def set_query_template(self, headers: Dict[str, any]) -> None:
        self.template = (
            SPARQLBuilder(headers)
            .with_property(
                PROPERTY_MAP["stems"]["child"],
                self._TEMPLATE_STR,
            )
            .build()
        )


class SpouseStem(HumanStem):
    def __init__(self):
        super().__init__(PROPERTY_MAP["stems"]["spouse"])

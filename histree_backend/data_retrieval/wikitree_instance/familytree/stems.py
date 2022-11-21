from typing import Dict, List
from data_retrieval.query.builder import SPARQLBuilder
from data_retrieval.wikitree.flower import WikiStem, UpWikiStem, DownWikiStem
from data_retrieval.wikitree_instance.familytree.property import PROPERTY_MAP
from .petals import FatherPetal, MotherPetal, CallerPetal


class SelfStem(WikiStem):
    def __init__(self):
        super().__init__(-1)

    def set_query_template(self, headers: Dict[str, any]) -> None:
        value_label = "?people"
        self.template = (
            SPARQLBuilder(headers)
            .with_values(value_label, [self._TEMPLATE_STR], prefix=False)
            .bounded_to("?item", value_label)
            .build()
        )


class ChildStem(DownWikiStem):
    def __init__(self):
        super().__init__(
            PROPERTY_MAP["stems"]["child"],
            parent_petals=[FatherPetal.instance(), MotherPetal.instance()],
        )

    def set_query_template(self, headers: Dict[str, any]) -> None:
        value_label = "?people"
        headers.update(petal.to_dict_pair() for petal in self.unique_petals)
        self.template = (
            SPARQLBuilder(headers)
            .with_values(value_label, [self._TEMPLATE_STR], prefix=False)
            .with_any_property(
                [
                    PROPERTY_MAP["stems"][label]
                    for label in ("mother", "father", "parent")
                ],
                value_label,
                prefix_property=True,
                prefix_value=False,
            )
            .build()
        )


class ParentStem(UpWikiStem):
    def __init__(self):
        super().__init__(
            PROPERTY_MAP["stems"]["parent"], caller_petal=CallerPetal.instance()
        )

    def set_query_template(self, headers: Dict[str, any]) -> None:
        value_label = "?people"
        headers.update(petal.to_dict_pair() for petal in self.unique_petals)
        self.template = (
            SPARQLBuilder(headers)
            .bounded_to("?caller", self._TEMPLATE_STR)
            .with_values(value_label, [self._TEMPLATE_STR], prefix=False)
            .with_property(PROPERTY_MAP["stems"]["child"], value_label, prefix=False)
            .build()
        )

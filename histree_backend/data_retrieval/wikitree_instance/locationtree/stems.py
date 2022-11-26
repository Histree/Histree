from typing import Dict
from data_retrieval.query.builder import SPARQLBuilder
from data_retrieval.wikitree.flower import WikiStem


class SelfStem(WikiStem):
    def __init__(self):
        super().__init__(-1)

    def set_query_template(self, headers: Dict[str, any]) -> None:
        value_label = "?place"
        self.template = (
            SPARQLBuilder(headers)
            .bounded_to("?caller", value_label)
            .with_values(value_label, [self._TEMPLATE_STR], prefix=False)
            .bounded_to("?item", value_label)
            .build()
        )

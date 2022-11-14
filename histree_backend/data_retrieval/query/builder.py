from typing import Dict


class SPARQLBuilder:
    def __init__(
        self, headers: Dict[str, Dict[str, any]] = dict(), language: str = "en"
    ):
        self.language = language
        self.predicate = ""
        self.limit = None
        self.order_by = ""
        self.other = ""
        self.bounds = dict()
        self.headers = headers
        self.filters = dict()
        self.other_filters = ""

    def build(self) -> str:
        bounds = " ".join(f"BIND({value} as {variable})" for (variable, value) in self.bounds.items())
        header_selections = " ".join(
            f"(SAMPLE(?{header}) as ?{header}_)" if config["sample"] else f"?{header}"
            for (header, config) in self.headers.items()
        )
        header_bindings = " ".join(
            ("OPTIONAL{%s}" if config["optional"] else "%s")
            % f"?item wdt:{config['id']} ?{header}."
            for (header, config) in self.headers.items()
        )
        header_access = " ".join(
            f"?{header}" + ("_" if config["sample"] else "")
            for (header, config) in self.headers.items()
        )
        filtering = ""
        if self.filters:
            for (property, values) in self.filters.items():
                filtering += f"VALUES ?filter_{property} {{ {' '.join([f'wd:{v}' for v in values])} }}."
                filtering += (
                    f"FILTER NOT EXISTS {{?item wdt:{property} ?filter_{property}.}}."
                )
        return f"""
            SELECT ?item ?label ?description {header_selections}
            WHERE {{
                SELECT * WHERE {{
                    {bounds}
                    {self.other}
                    ?item {self.predicate}
                        rdfs:label ?label;
                        schema:description ?description.
                    {header_bindings}
                    {filtering}
                    {self.other_filters}
                    FILTER(lang(?label) = "{self.language}" && lang(?description) = "{self.language}")
                }}
                GROUP BY ?item ?label ?description ?num {header_access}
            }}
            {self.order_by}
            {f"LIMIT {self.limit}" if self.limit is not None else ""}
        """

    def with_limit(self, limit: int) -> "SPARQLBuilder":
        self.limit = limit
        return self

    def ordered_by(self, value: str, ascending: bool = True) -> "SPARQLBuilder":
        self.order_by = f"ORDER BY {'ASC' if ascending else 'DSC'}({value})"
        return self

    def under_class(self, cls: str) -> "SPARQLBuilder":
        self.predicate += f"p:P31/ps:P31/wdt:P279* wd:{cls};"
        return self

    def with_property(self, property: str, value: str) -> "SPARQLBuilder":
        self.predicate += f"wdt:{property} wd:{value};"
        return self

    def with_instance(self, instance: str) -> "SPARQLBuilder":
        return self.with_property("P31", instance)

    def without_property(self, property: str, value: str) -> "SPARQLBuilder":
        if property not in self.filters:
            self.filters[property] = []
        self.filters[property].append(value)
        return self

    def without_instance(self, instance: str) -> "SPARQLBuilder":
        return self.without_property("P31", instance)

    def bounded_to(self, variable: str, value: str) -> "SPARQLBuilder":
        self.bounds[variable] = value
        return self
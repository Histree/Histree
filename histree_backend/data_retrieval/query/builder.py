class QueryBuilder:
    def __init__(self):
        self.language = "en"
        self.predicate = ""
        self.limit = None
        self.headers = dict()
        self.filters = dict()

    def build(self) -> str:
        header_selections = " ".join(
            f"(SAMPLE(?{header} as ?{header}_))" if config["sample"] else f"?{header}"
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
              ?item {self.predicate}
                rdfs:label ?label;
                schema:description ?description.
              {header_bindings}
              {filtering}
              FILTER(lang(?label) = "{self.language}" && lang(?description) = "{self.language}")
            }}
            GROUP BY ?item ?label ?description {header_access}
            {f"LIMIT {self.limit}" if self.limit is not None else ""}
        """

    def with_limit(self, limit: int) -> "QueryBuilder":
        self.limit = limit
        return self

    def with_property(self, property: str, value: str) -> "QueryBuilder":
        self.predicate += f"wdt:{property} wd:{value};"
        return self

    def with_instance(self, instance: str) -> "QueryBuilder":
        return self.with_property("P31", instance)

    def under_class(self, cls: str) -> "QueryBuilder":
        self.predicate += f"p:P31/ps:P31/wdt:P279* wd:{cls};"
        return self

    def without_property(self, property: str, value: str) -> "QueryBuilder":
        if property not in self.filters:
            self.filters[property] = []
        self.filters[property].append(value)
        return self

    def without_instance(self, instance: str) -> "QueryBuilder":
        return self.without_property("P31", instance)

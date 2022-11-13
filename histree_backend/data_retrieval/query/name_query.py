from .builder import SPARQLBuilder


class NameQueryBuilder(SPARQLBuilder):
    def __init__(self):
        super().__init__()

    def with_name(self, name: str) -> "NameQueryBuilder":
        self.other = f"""
            SERVICE wikibase:mwapi {{
                bd:serviceParam wikibase:api "EntitySearch" .
                bd:serviceParam wikibase:endpoint "www.wikidata.org" .
                bd:serviceParam mwapi:search "{name}" .
                bd:serviceParam mwapi:language "{self.language}" .
                ?item wikibase:apiOutputItem mwapi:item .
                ?num wikibase:apiOrdinal true .
            }}
        """
        return self

    def starts_with(self, match: str) -> "NameQueryBuilder":
        self.other_filters += f'FILTER(REGEX(?item, "^{match}")) '
        return self

    def matches_regex(self, expr: str) -> "NameQueryBuilder":
        self.other_filters += f'FILTER(REGEX(?item, "{expr}")) '
        return self

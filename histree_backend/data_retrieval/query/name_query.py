from typing import Dict
from .builder import SPARQLBuilder


class NameQueryBuilder(SPARQLBuilder):
    def __init__(
        self,
        pagination: int = 0,
        search_limit: int = 50,
        language: str = "en",
        headers: Dict[str, Dict[str, any]] = dict(),
    ):
        super().__init__(language=language, headers=headers)

        # Note: this limit corresponds to MediaWiki search results
        # By their conventions, results are capped at 50.
        self.search_limit = search_limit
        self.pagination = pagination

    def with_name(self, name: str) -> "NameQueryBuilder":
        self.other = f"""
                SERVICE wikibase:mwapi {{
                    bd:serviceParam wikibase:api "EntitySearch";
                                    wikibase:endpoint "www.wikidata.org";
                                    mwapi:search "{name}";
                                    mwapi:language "{self.language}";
                                    mwapi:limit {self.search_limit} ;
                                    mwapi:continue {self.search_limit * self.pagination} .
                    ?item wikibase:apiOutputItem mwapi:item .
                    ?num wikibase:apiOrdinal true .
                }}
        """
        return self

    def starts_with(self, match: str) -> "NameQueryBuilder":
        self.other_filters += f'FILTER(REGEX(LCASE(STR(?label)), "^{match.lower()}")) '
        return self

    def matches_regex(self, expr: str) -> "NameQueryBuilder":
        self.other_filters += f'FILTER(REGEX(LCASE(STR(?label)), "{expr.lower()}")) '
        return self

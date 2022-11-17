from typing import Dict, List, Optional

from data_retrieval.wikitree.flower import WikiFlower, WikiPetal


class WikiResult:
    def __init__(self, results: Dict[str, any]):
        _empty_dict = dict()
        self.headers = results.get("head", _empty_dict).get("vars", [])
        _bindings = results.get("results", _empty_dict).get("bindings", [])
        self.info = [
            {
                label.rstrip("_"): value.get("value", None)
                for (label, value) in binding.items()
            }
            for binding in _bindings
        ]

    def parse(self, petal_map: Dict[str, WikiPetal]) -> List[WikiFlower]:
        flowers = []
        defaults = ("item", "label", "description")

        for item_dict in self.info:

            id, name, description = map(item_dict.get, defaults)
            flower = WikiFlower(
                id.split("/")[-1],
                {
                    label: petal_map[label].parse(value)
                    for (label, value) in item_dict.items()
                    if label not in defaults
                },
            )
            flower.name = name
            flower.description = description
            flowers.append(flower)
        return flowers

class DBResult:

    def __init__(self, result) -> None:
        self.result = result

    def parse_immediate(self, petal_map: Dict[str, WikiPetal]) -> list[tuple[str, Optional[list[WikiFlower]]]]:
        # self.result is list of (id, bool(reliability),[flower])
        return [(id,
                [DBResult._parse_flower(f, petal_map) for f in flowers] if reliable else None)
                for id, reliable, flowers in self.result
                ]

    def parse_itself(self, petal_map: Dict[str, WikiPetal]) -> list[tuple[str, Optional[list[WikiFlower]]]]:
        # self.result is list of (id, flower)
        return [(id, 
                DBResult._parse_flower(flower, petal_map) if flower else None) 
                for id, flower in self.result
                ]


    def _parse_flower(raw_flower: dict, petal_map: Dict[str, WikiPetal]) -> WikiFlower:
        defaults = ("id", "name", "description")

        id, name, description = map(raw_flower.get, defaults)
        flower = WikiFlower(
            id,
            {
                label: petal_map[label].parse(value)
                for (label, value) in raw_flower.items()
                if label not in defaults
            },
        )
        flower.name = name
        flower.description = description
        return flower

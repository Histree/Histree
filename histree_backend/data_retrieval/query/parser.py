from typing import Dict, List

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
        for item_dict in self.info:
            id, name, description = (
                self.info["id"],
                self.info["label"],
                self.info["description"],
            )
            flower = WikiFlower(
                id,
                {label: petal_map[label].parse(value) for (label, value) in item_dict},
            )
            flower.name = name
            flower.description = description
            flowers.append(flower)
        return flowers

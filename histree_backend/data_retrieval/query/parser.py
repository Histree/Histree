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

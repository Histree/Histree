from typing import Dict, List
import unittest
from unittest.mock import patch, MagicMock
from qwikidata.entity import WikidataItem
from wikitree.flower import WikiFlower
from wikitree.tree import WikiTree


class TestWikiTreeMethods(unittest.TestCase):
    def _create_dummy_parents(self, item: WikidataItem, tree: WikiTree, params: Dict[str, any]) -> None:
        tree.grow(params["father"]["id"],
                  branch_up=False, branch_down=False)
        tree.grow(params["mother"]["id"],
                  branch_up=False, branch_down=False)
        self.assertTrue(params["father"]["id"] in tree.flowers,
                        msg="Father is not stored in WikiTree.")
        self.assertTrue(params["mother"]["id"] in tree.flowers,
                        msg="Mother is not stored in WikiTree.")

        father = tree.flowers[params["father"]["id"]]
        mother = tree.flowers[params["mother"]["id"]]
        father.petals = params["father"]["petals"]
        mother.petals = params["mother"]["petals"]

        for parent in (father, mother):
            if parent not in tree.branches:
                tree.branches[parent.id] = set()
            tree.branches[parent.id].add(item.entity_id)

    def _create_dummy_children(self, item: WikidataItem, tree: WikiTree, params: List[Dict[str, any]]) -> None:
        for child in params:
            child_flower = WikiFlower(
                child["id"], child["petals"])
            tree.grow(child["other_parent"],
                      branch_up=False, branch_down=False)
            self.assertTrue(child["other_parent"] in tree.flowers,
                            msg="Spouse is not stored in WikiTree.")
            tree.flowers[child_flower.id] = child_flower

            if item.entity_id not in tree.branches:
                tree.branches[item.entity_id] = set()
            tree.branches[item.entity_id].add(
                child_flower.id)

    @patch("wikitree.tree.WikidataAPI")
    @patch("wikitree.tree.WikiSeed")
    def test_grow(self, MockSeedClass, MockWikidataAPIClass):
        MockSeedClass.branch_up, MockSeedClass.branch_down = MagicMock(), MagicMock()
        MockSeedClass.branch_up.side_effect = lambda it, tr: self._create_dummy_parents(it, tr, {
            "father": {
                "id": "Q0",
                "petals": dict(),
            },
            "mother": {
                "id": "Q1",
                "petals": dict(),
            }
        })
        mock_flower_data = {
            "aliases": [],
            "claims": [],
            "descriptions": "",
            "id": "Q2",
            "labels": {"en": {"language": "en", "value": "name"}},
            "sitelinks": [],
            "type": "item",
        }
        MockSeedClass.branch_down.side_effect = lambda it, tr: self._create_dummy_children(it, tr, [
            {
                "id": "Q10",
                "other_parent": "Q3",
                "petals": dict()
            },
            {
                "id": "Q11",
                "other_parent": "Q4",
                "petals": dict()
            }
        ])

        def mock_flower_data(id: str) -> WikidataItem:
            return WikidataItem({
                "aliases": [],
                "claims": [],
                "descriptions": "",
                "id": id,
                "labels": {"en": {"language": "en", "value": "name"}},
                "sitelinks": [],
                "type": "item",
            })

        MockWikidataAPIClass.get_wikidata_item.side_effect = mock_flower_data

        tree = WikiTree(MockSeedClass, MockWikidataAPIClass)
        tree.grow("Q2")

        # Flower is correctly stored in the WikiTree
        self.assertTrue("Q2" in tree.flowers,
                        msg="Flower is not stored in the WikiTree.")
        self.assertTrue(
            tree.flowers["Q2"].name == "name", msg="Flower has unexpected name.")
        flower = tree.flowers["Q2"]

        # Parents are correctly stored in the WikiTree
        MockSeedClass.branch_up.assert_called_once()
        self.assertTrue("Q1" in tree.branches and "Q2" in tree.branches,
                        msg="Parents are not stored in the WikiTree.")

        self.assertTrue("Q0" in tree.flowers,
                        msg="Father is not stored in the WikiTree")
        self.assertTrue("Q1" in tree.flowers,
                        msg="Mother is not stored in the WikiTree.")
        self.assertTrue(flower.id in tree.branches["Q0"] and flower.id in tree.branches["Q1"],
                        msg="Incorrect parents assigned to flower.")

        # Children are correctly stored in the WikiTree
        MockSeedClass.branch_down.assert_called_once()
        for child_id in ("Q10", "Q11"):
            self.assertTrue(child_id in tree.flowers,
                            msg="Child is not stored in the WikiTree.")
            self.assertTrue(child_id in tree.branches[flower.id],
                            msg="Flower is not assigned as parent of child.")

        # Spouses are correctly stored in the WikiTree
        for spouse_id in ("Q3", "Q4"):
            self.assertTrue(spouse_id in tree.flowers,
                            msg="Spouse is not stored in the WikiTree.")

    @patch("wikitree.tree.WikidataAPI")
    @patch("wikitree.tree.WikiSeed")
    def test_to_json(self, MockSeedClass, MockWikidataAPIClass):
        tree = WikiTree(MockSeedClass(),
                        MockWikidataAPIClass())

        father_petals = {"dob": "1968-10-20",
                         "metadata": "father_data"}
        father_flower = WikiFlower("Q0", father_petals)
        father_flower.name = "father"

        mother_petals = {"dob": "1967-08-08",
                         "metadata": "mother_data"}
        mother_flower = WikiFlower("Q1", mother_petals)
        mother_flower.name = "mother"

        child_petals = {"dob": "2000-01-02",
                        "metadata": "child_data"}
        child_flower = WikiFlower("Q2", child_petals)
        child_flower.name = "child"

        tree.flowers = {flower.id: flower for flower in (
            father_flower, mother_flower, child_flower)}
        tree.branches = {flower.id: [child_flower.id] for flower in (
            father_flower, mother_flower)}

        self.assertEqual(tree.to_json(), {
            "flowers": [
                {
                    "id": "Q0",
                    "name": "father",
                    "petals": {
                        "dob": "1968-10-20",
                        "metadata": "father_data"
                    }
                },
                {
                    "id": "Q1",
                    "name": "mother",
                    "petals": {
                        "dob": "1967-08-08",
                        "metadata": "mother_data"
                    }
                },
                {
                    "id": "Q2",
                    "name": "child",
                    "petals": {
                        "dob": "2000-01-02",
                        "metadata": "child_data"
                    }
                },
            ],
            "branches": {
                "Q0": ["Q2"],
                "Q1": ["Q2"]
            }
        }, msg="JSON representation of WikiTree does not meet expected.")

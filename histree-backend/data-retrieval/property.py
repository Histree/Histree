'''
from frontend, identify the property labels that user requested
e.g. just fathers 
default option: parents + children (direct relationships)
'''
PROPERTY_MAP = {
    "relationships": {
        "direct": {
           "father": "P22",
            "mother": "P25",
            "spouse": "P26",
            "child": "P40",
            "sibling": "P3373",
            "parent": "P8810"
        },
        "indirect": {
            "family": "P53"
        },
        "qualifier": {
            "kinship to subject": "P1039"
        }
    },
    "attributes": {
        "place of birth": "P19",
        "sex/gender": "P21",
        "position held": "P39",
        "family name": "P734",
        "given name": "P735",
        "date of birth": "P569",
        "date of death": "P570",
        "birthday": "P3150"
    }
}

PROPERTY_LABEL = {
    "Q6581097": "male",
    "Q6581072": "female",
    "Q48270": "non-binary",
    "Q1097630": "intersex",
    "Q2449503": "transgender male",
    "Q1052281": "transgender female",
    "Q505371": "agender"
}

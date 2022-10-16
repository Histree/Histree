'''
from frontend, identify the property labels that user requested
e.g. just fathers 
default option: parents + children (direct relationships)
'''
PROPERTY_MAP = {
    "relationships": {
        "direct": {
            "P22": "father",
            "P25": "mother",
            "P26": "spouse",
            "P40": "child",
            "P3373": "sibling",
            "P8810": "parent"
        },
        "indirect": {
            "P53": "family"
        },
        "qualifier": {
            "P1039": "kinship to subject"
        }
    },
    "attributes": {
        "P19": "place of birth",
        "P21": "sex/gender",
        "P39": "position held",
        "P734": "family name",
        "P735": "given name",
        "P569": "date of birth",
        "P570": "date of death",
        "P3150": "birthday"
    }
}

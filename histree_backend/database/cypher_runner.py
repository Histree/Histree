def cypher_runner(query_func):
    def wrapper(tx, *args):
        query, labels = query_func(tx, *args)
        result = tx.run(query)
        return parser(result, labels)
    return wrapper

def parser(result, labels) -> list[dict]:
    return [
        tuple(res[label] for label in labels) for res in result 
    ]

@cypher_runner
def find_children(tx, ids) -> tuple[str, list]:
    query = (
            f"UNWIND {ids} AS i "
            "OPTIONAL MATCH (parent {id: i, branched_down: TRUE}) "
            "OPTIONAL MATCH (parent) --> (child)"
            "RETURN i, parent IS NOT NULL AS b, collect(child) AS children"
            )
    label = ['i', 'b', 'children']
    # if b is Fasle, we need to query the ids from wiki
    # if b is True, we use children
    return query, label

@cypher_runner
def find_parent(tx, ids) -> tuple[str, list]:
    query = (
            f"UNWIND {ids} AS i "
            "OPTIONAL MATCH (child {id: i, branched_up: TRUE}) "
            "OPTIONAL MATCH (parent) --> (child)"
            "RETURN i, child IS NOT NULL AS b, collect(parent) AS parents"
            )
    label = ['i', 'b', 'parents']
    return query, label

@cypher_runner
def find_flowers(tx, ids) -> tuple[str, list]:
    query = (
        f"UNWIND {ids} AS i "
        "OPTIONAL MATCH (flower {id: i}) "
        "RETURN i, flower"
        )
    label = ['i', 'flower']
    return query, label

@cypher_runner
def merge_nodes_into_db(tx, json_data, fcreates, ptcreates):
    setting = ', '.join(
        [f"node.{label} = flower.{label}" for label in fcreates] 
        +
        [f"node.{label} = petal.{label}" for label in ptcreates]
        )
    query = (
            f"WITH apoc.convert.fromJsonMap(\'{json_data}\') AS document "
            "UNWIND document.flowers AS flower "
            "UNWIND flower.petals AS petal "
            "MERGE (node:Person { id: flower.id }) "
            "ON CREATE SET "
            f"{setting} "
            "ON MATCH SET "
            "node += (CASE flower.branched_up WHEN TRUE THEN {branched_up: TRUE} ELSE {} END) "
            "ON MATCH SET "
            "node += (CASE flower.branched_down WHEN FALSE THEN {branched_down: TRUE} ELSE {} END) "
            "RETURN NULL"
    )

    label = []
    return query, label

@cypher_runner
def merge_relation_into_db(tx, json_data):
    query = (
        f"WITH apoc.convert.fromJsonMap(\'{json_data}\') AS document "
        "UNWIND document.branches AS branch "
        "UNWIND keys(branch) AS parent "
        "UNWIND branch[parent] AS child "
        "MATCH (from:Person {id: parent}), \
                (to:Person {id: child}) "
        "MERGE (from)-[:PARENT_OF]->(to) "
        "SET \
            to += (CASE from.gender \
                    WHEN 'female' THEN {mother: from.id} \
                    WHEN 'male' THEN {father: from.id} \
                    ELSE {} \
                    END) "
        "RETURN from, to"
    )

    label = []
    return query, label
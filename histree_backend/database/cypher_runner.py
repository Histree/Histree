def cypher_runner(query_func):
    def wrapper(tx, **kwargs):
        query, labels = query_func()
        result = tx.run(query, **kwargs)
        return parser(result, labels)
    return wrapper

def parser(result, labels) -> list[dict]:
    return [
        tuple(res[label] for label in labels) for res in result 
    ]

@cypher_runner
def find_children(tx, ids) -> tuple[str, list]:
    query = (
            "UNWIND $ids AS i "
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
            "UNWIND $ids AS i "
            "OPTIONAL MATCH (child {id: i, branched_up: TRUE}) "
            "OPTIONAL MATCH (parent) --> (child)"
            "RETURN i, child IS NOT NULL AS b, collect(parent) AS parents"
            )
    label = ['i', 'b', 'parents']
    return query, label

@cypher_runner
def find_flowers(tx, ids) -> tuple[str, list]:
    query = (
        "UNWIND $ids AS i "
        "OPTIONAL MATCH (flower {id: i}) "
        "RETURN i, flower"
        )
    label = ['i', 'flower']
    return query, label
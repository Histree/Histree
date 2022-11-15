def cypher_runner(query_func):
    def wrapper(tx, **kwargs):
        query, labels = query_func()
        result = tx.run(query, **kwargs)
        return parser(result, labels)
    return wrapper

def parser(result, labels):
    return [
        res[label] for res in result for label in labels
    ]

@cypher_runner
def find_person(tx, id) -> tuple[str, list]:
    query = (
            "MATCH (p:Person) "
            "WHERE p.id = $id "
            "RETURN p"
            )
    label = ['p']
    return query, label

    




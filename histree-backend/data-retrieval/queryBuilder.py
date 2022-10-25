from wrapper import WikiNetwork

class HistreeQuery:
    def __init__(self) -> None:
        pass

    def queryBuilder(self) -> str:
        seed = input("Name to Query: ")

        network = WikiNetwork()
        matches = network.retrieve_potential_seeds(seed)

        print("Potential matches for Query: ")

        for i in range(0, len(matches)):
            (_, label) = matches[i]
            print(f"{i + 1}. {label}") 

        qid = int(input("Choose the option you wish to query: ")) - 1

        return matches[qid][0]
from wrapper import WikiNetwork


seed = input("Name to Query: ")

network = WikiNetwork()
matches = network.retrieve_potential_seeds(seed)

print("Potential matches for Query: ")

for i in range(0, len(matches)):
    (_, label) = matches[i]
    print(f"{i + 1}. {label}") 

qid = int(input("Choose the option you wish to query: ")) - 1

network.add_person_and_immediates(matches[qid][0]) 

print(network.network)
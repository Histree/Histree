from wrapper import WikiNetwork

network = WikiNetwork()
qid = network.retrieve_potential_seeds("Elizabeth II")[0][0]
network.add_person_and_immediates(qid) # Elizabeth II
print(network.network)
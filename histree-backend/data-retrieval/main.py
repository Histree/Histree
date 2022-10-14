from wrapper import WikiNetwork

network = WikiNetwork()
network.add_person_and_immediates("Q9682") # Elizabeth II
print(network.network)
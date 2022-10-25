from wrapper import WikiNetwork
from queryBuilder import HistreeQuery

query = HistreeQuery()
network = WikiNetwork()


seed = query.queryBuilder()

network.add_person_and_immediates(seed) 

print(network.to_json())
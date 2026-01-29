import os
from pymongo import MongoClient

MONGO_URI = os.getenv("MONGO_URI")

#Mongo client (created once, reused everywhere)
mongo_client = MongoClient(MONGO_URI)

# database
db = mongo_client["github_events"]
events_collection = db["events"]

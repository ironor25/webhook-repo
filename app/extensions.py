import os
from pymongo import MongoClient

# Read Mongo URI from environment
MONGO_URI = os.getenv("MONGO_URI")

# Create Mongo client (created once, reused everywhere)
mongo_client = MongoClient(MONGO_URI)

# Database
db = mongo_client["github_events"]

# Collection
events_collection = db["events"]

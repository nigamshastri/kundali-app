from pymongo import MongoClient
from config import MONGO_URI

_client = None

def get_db():
    global _client
    if _client is None:
        _client = MongoClient(MONGO_URI)
    return _client["kundali_db"]
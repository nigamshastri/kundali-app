from pymongo import MongoClient
from config import Config

client = MongoClient(Config.MONGO_URI)
db = client.get_database("kundali_db")

# Collections
users_col       = db["users"]
kundali_col     = db["kundali_records"]
appointments_col = db["appointments"]

import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://nigamshastri4_db_user:R5gqwa97@cluster0.2njphyw.mongodb.net/kundali_db?retryWrites=true&w=majority")
JWT_SECRET = os.getenv("JWT_SECRET", "kundali_jwt_secret_2024_shastri")
GOOGLE_SCRIPT_URL = os.getenv("GOOGLE_SCRIPT_URL", "https://script.google.com/macros/s/AKfycbzvS2f9BMDVE8NxCaWiQq5yvZhlyh5uP6WVvsSj58SxZ7mD_2iB9A38KEPAwWiKlPjfNg/exec")
JWT_EXPIRY_HOURS = 24

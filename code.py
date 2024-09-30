import json
from pymongo import MongoClient
import pandas as pd

# Load the country code mapping file only once
country_df = pd.read_excel('./Country_Code.xlsx')
country_mapping = dict(zip(country_df['Country Code'], country_df['Country']))

# Function to upload a JSON file to MongoDB
def upload_restaurants_to_mongodb(json_file_path):
    """
    Uploads restaurant data from a JSON file to MongoDB after transforming the data.
    
    Parameters:
    json_file_path (str): The path to the JSON file containing restaurant data.
    """
    # Connect to the MongoDB server (localhost)
    client = MongoClient("mongodb://localhost:27017/")

    # Create or access the database
    db = client['zomatoDB']

    # Access the collection where you want to insert the data
    collection = db['restaurants']

    # Load the original JSON file
    with open(json_file_path, 'r') as file:
        data = json.load(file)

    # Create an empty list to store the transformed restaurant objects
    new_restaurant_list = []

    # Iterate through each object in the original data
    for obj in data:
        restaurant_list = obj.get('restaurants', [])
        for item in restaurant_list:
            restaurant = item['restaurant']

            # Rename has_online_delivery to online
            restaurant['online'] = restaurant.pop('has_online_delivery', None)

            # Replace the R object with res_id
            if 'R' in restaurant and 'res_id' in restaurant['R']:
                restaurant['res_id'] = restaurant['R']['res_id']
            restaurant.pop('R', None)

            # Extract location fields and add them to the restaurant object
            location = restaurant.pop('location', {})
            restaurant['latitude'] = location.get('latitude', '')
            restaurant['longitude'] = location.get('longitude', '')
            restaurant['address'] = location.get('address', '')
            restaurant['city'] = location.get('city', '')

            # Replace country_id with country name using the mapping
            country_id = location.get('country_id', '')
            restaurant['country'] = country_mapping.get(int(country_id), '') if country_id else ''

            restaurant['locality_verbose'] = location.get('locality_verbose', '')

            # Drop unwanted fields (additional fields)
            restaurant.pop('zomato_events', None)
            restaurant.pop('events_url', None)
            restaurant.pop('establishment_types', None)
            restaurant.pop('offers', None)
            restaurant.pop('price_range', None)
            restaurant.pop('photos_url', None)
            restaurant.pop('apikey', None)
            restaurant.pop('deeplink', None)
            restaurant.pop('book_url', None)
            restaurant.pop('switch_to_order_menu', None)
            restaurant.pop('has_table_booking', None)
            restaurant.pop('id', None)

            # Append the transformed restaurant to the new list
            new_restaurant_list.append(restaurant)

    # Insert the transformed restaurant objects into MongoDB
    if new_restaurant_list:
        collection.insert_many(new_restaurant_list)
        print(f"Inserted {len(new_restaurant_list)} restaurants from {json_file_path} into MongoDB!")
    else:
        print(f"No restaurants found in {json_file_path} to insert.")


# Example usage to upload multiple files
upload_restaurants_to_mongodb('./file1.json')
upload_restaurants_to_mongodb('./file2.json')
upload_restaurants_to_mongodb('./file3.json')
upload_restaurants_to_mongodb('./file4.json')
upload_restaurants_to_mongodb('./file5.json')


# Zomato Restaurant Listing & Searching

This is a project assignment that implements a restaurant listing and search system using the MERN (MongoDB, Express, React, Node.js) stack. The goal of the project is to allow users to load restaurant data into a database, build a web API service for fetching and searching restaurants, and create a user interface to display and search through the restaurant data.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Frontend Implementation](#frontend-implementation)
- [Usage](#usage)
- [Future Enhancements](#future-enhancements)
- [Technologies Used](#technologies-used)


## Project screenshot

![image](https://github.com/user-attachments/assets/a14dacb8-90ab-44ad-b85d-d1a81559d884)

![image](https://github.com/user-attachments/assets/d0d82734-521f-4add-b1a5-33a6a7be8ee5)

![image](https://github.com/user-attachments/assets/32a92a2e-7714-433c-a640-8ab2a073e073)

![image](https://github.com/user-attachments/assets/ac093591-98a0-492e-8e4b-58a00916372d)

![image](https://github.com/user-attachments/assets/4a21dbfd-c5c9-4a0f-aff7-27f8542ea44f)

![image](https://github.com/user-attachments/assets/fd951d5c-8520-48ac-b0f9-a35810d1934e)

![image](https://github.com/user-attachments/assets/a055821b-77ca-446e-a76f-403d1fd2f44c)

![image](https://github.com/user-attachments/assets/37516354-858a-40b3-94d9-b8f60c4185a2)

![image](https://github.com/user-attachments/assets/af12f6e3-0f37-49da-8019-2a27ccd72640)

![image](https://github.com/user-attachments/assets/04d11cd4-818b-42f6-99c5-60211c7f9148)

![image](https://github.com/user-attachments/assets/bfa8c6e1-5606-4aac-a979-e09e0604852f)














## Project Overview

This project implements the following key use cases:
1. **Data Loading**: An independent script loads Zomato restaurant data into MongoDB. The data includes restaurant details such as name, address, latitude, longitude, cuisine, and more.

2. **Web API Service**: A RESTful API service allows fetching restaurant details by ID, listing all restaurants with pagination, searching by location, and searching restaurants based on a food image.

3. **User Interface**: A web application with pages to display a list of restaurants, show restaurant details, and provide search functionality (location and image-based).

## Features

### 1. **Data Loading**
A script was created to load Zomato restaurant data into MongoDB. The data includes restaurant details such as name, address, latitude, longitude, cuisine, and more.

### 2. **Web API Service**
The API service has several key endpoints, as described below:

- **Get Restaurant by ID**: Allows retrieving details of a specific restaurant by its unique ID. 
    - Endpoint: `GET /api/restaurants/:id`
    - Example: `GET /api/restaurants/1` retrieves the details of restaurant with ID 1.

- **Get List of Restaurants**: Fetches a paginated list of restaurants. Users can specify the page number and the number of restaurants per page. 
    - Endpoint: `GET /api/restaurants?page=<page>&limit=<limit>`
    - Example: `GET /api/restaurants?page=2&limit=10`

- **Location Search**: Users can search for restaurants within a specific radius from a given latitude and longitude.
    - Endpoint: `POST /api/restaurants/location`
    - Example: Search for restaurants within a 3 km radius of latitude 12.9716 and longitude 77.5946.

- **Image Search**: Users can upload an image (e.g., food like ice cream or pasta), and the system will detect the type of food and search for restaurants that serve that cuisine. This feature uses **Google Generative AI** for image analysis.
    - Endpoint: `POST /api/restaurants/image-search`
    - Uploads an image and returns matching restaurants.

### 3. **User Interface**
The frontend was built using React and provides the following pages:

- **Restaurant List Page**: Displays a list of restaurants, with pagination and clickable restaurant cards that navigate to the restaurant detail page.
- **Restaurant Detail Page**: Displays details of a specific restaurant, including name, address, cuisines, ratings, and more.
- **Location Search**: Users can enter latitude, longitude, and a radius to search for restaurants within that range.
- **Image Search**: Users can upload an image, and the system will search for restaurants serving the detected cuisine.

## Installation

### Backend
1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/zomato-restaurant-search.git
    cd zomato-restaurant-search/backend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Set up environment variables:
   Create a `.env` file in the `backend` directory with the following details:
   ```env
   MONGO_URI=<your_mongo_connection_string>
   API_KEY=<your_google_ai_api_key>
   ```

4. Run the server:
    ```bash
    npm start
    ```
   The server will run on `http://localhost:5000`.

### Frontend
1. Navigate to the frontend directory:
    ```bash
    cd ../frontend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Run the frontend application:
    ```bash
    npm start
    ```
   The frontend will be accessible at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint | Description |
|--------|-----------|-------------|
| `GET`  | `/api/restaurants/:id` | Retrieve restaurant by ID |
| `GET`  | `/api/restaurants` | Get paginated list of restaurants |
| `POST` | `/api/restaurants/location` | Search restaurants by location (latitude, longitude, radius) |
| `POST` | `/api/restaurants/image-search` | Upload an image and search restaurants by cuisine |

## Frontend Implementation

- **Restaurant List**: The restaurant list page fetches a list of restaurants from the API and displays them in a grid format with pagination.
- **Restaurant Details**: Clicking on a restaurant in the list navigates to the restaurant details page, showing more detailed information.
- **Location Search**: Users can input coordinates and a radius to find nearby restaurants.
- **Image Search**: Users can upload an image, and the system will display matching restaurants based on the detected cuisine.

## Usage

1. **Search by ID**: Enter a restaurant ID and retrieve its details.
2. **View All Restaurants**: Browse through all available restaurants with pagination.
3. **Search by Location**: Input latitude, longitude, and radius to find restaurants within the specified area.
4. **Search by Image**: Upload a food image (e.g., pasta, ice cream), and the system will find restaurants serving that cuisine.

## Future Enhancements

- **Filtering Options**:
  - By Country
  - By Average Spend for Two People
  - By Cuisines
- **Search Functionality**: Enable search for restaurants by name and description.
- **Deployment**: Deploy the project on a cloud service like AWS or Heroku.
- **Improve Image Recognition**: Enhance the image search functionality to support more complex dishes and cuisines.

## Technologies Used

- **Frontend**: React, CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Image Analysis**: Google Generative AI (for image search functionality)


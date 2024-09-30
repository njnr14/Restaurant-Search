import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/restaurants';

export const getRestaurantById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching restaurant by ID:", error);
        throw error;
    }
};

export const getRestaurants = async (page = 1, limit = 12) => {
    try {
        const response = await axios.get(`${API_BASE_URL}?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching restaurants:", error);
        throw error;
    }
};

export const searchByLocation = async (latitude, longitude, radius) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/location`, { latitude, longitude, radius });
        return response.data;
    } catch (error) {
        console.error("Error searching by location:", error);
        throw error;
    }
};

export const searchByImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('foodImage', imageFile);

    try {
        const response = await axios.post(`${API_BASE_URL}/image-search`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error searching by image:", error);
        throw error;
    }
};

const express = require('express');
const Restaurant = require('../models/Restaurant');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const fileManager = new GoogleAIFileManager(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })



// Get restaurant by ID
router.get('/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ res_id: parseInt(req.params.id) });
        if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get list of restaurants with pagination
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const total = await Restaurant.countDocuments();
        const restaurants = await Restaurant.find().skip(skip).limit(limit);
        // console.log(restaurants);
        res.json({ restaurants, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Search by location with pagination
function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRad = (value) => value * Math.PI / 180;
    const R = 6371; // Radius of Earth in kilometers

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in kilometers
}

function calculateBoundingBox(lat, lon, radius) {
    const earthRadius = 6371; // Earth’s radius in kilometers
    const radiusInRadians = radius / earthRadius;

    const latInRadians = lat * (Math.PI / 180);
    const lonInRadians = lon * (Math.PI / 180);

    const minLat = latInRadians - radiusInRadians;
    const maxLat = latInRadians + radiusInRadians;

    const minLon = lonInRadians - radiusInRadians / Math.cos(latInRadians);
    const maxLon = lonInRadians + radiusInRadians / Math.cos(latInRadians);

    return {
        minLat: minLat * (180 / Math.PI),
        maxLat: maxLat * (180 / Math.PI),
        minLon: minLon * (180 / Math.PI),
        maxLon: maxLon * (180 / Math.PI),
    };
}

router.post('/location', async (req, res) => {
    const { latitude, longitude, radius} = req.body;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { minLat, maxLat, minLon, maxLon } = calculateBoundingBox(parseFloat(latitude), parseFloat(longitude), parseFloat(radius));

    try {
        const total = await Restaurant.countDocuments({
            latitude: { $gte: minLat, $lte: maxLat },
            longitude: { $gte: minLon, $lte: maxLon }
        });

        const restaurants = await Restaurant.find({
            latitude: { $gte: minLat, $lte: maxLat },
            longitude: { $gte: minLon, $lte: maxLon }
        })
        .skip(skip)
        .limit(limit);

        // Filter restaurants by calculating distance
        const filteredRestaurants = restaurants.filter(restaurant => {
            const distance = haversineDistance(parseFloat(latitude), parseFloat(longitude), restaurant.latitude, restaurant.longitude);
            return distance <= radius;
        });

        res.json({
            restaurants: filteredRestaurants,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Image search (upload and search for matching cuisine)




// Set up Google Generative AI API


router.post('/image-search', upload.single('foodImage'), async (req, res) => {
    try {
        // Step 1: Upload the image to the Google API
        // console.log(req.file.path)
        const uploadResult = await fileManager.uploadFile(req.file.path, {
            mimeType: req.file.mimetype,
            displayName: req.file.originalname,
        });

        // Step 2: Use the uploaded image to classify cuisine
        const result = await model.generateContent([
            "identify the given dish as dessert , if it is dessert just return the dessert and if it is not dessert then return the cuisine which that dish belongs too just return the cuisine name for example if the answer is Chinese cuisine return Chinese. If possible classify the indian food as north indian or south indian",
            {
                fileData: {
                    fileUri: uploadResult.file.uri,
                    mimeType: uploadResult.file.mimeType,
                },
            },
        ]);

        const detectedCuisine = result.response.text().trim(); // Get the classified cuisine
        console.log(detectedCuisine);
        // Step 3: Find restaurants that serve the detected cuisine
        const restaurants = await Restaurant.find({ cuisines: { $regex: detectedCuisine, $options: 'i' } });

        // Optionally delete the uploaded file from local storage after processing
        const fs = require('fs');
        fs.unlinkSync(req.file.path); // Delete the file after processing

        // Step 4: Return the found restaurants
        res.json(restaurants);

    } catch (error) {
        console.error("Error during image search:", error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

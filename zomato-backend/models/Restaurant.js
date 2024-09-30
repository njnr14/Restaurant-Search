const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
    res_id: { type: Number },
    name: { type: String },
    online: { type: Boolean },
    latitude: { type: String },
    longitude: { type: String },
    address: { type: String },
    city: { type: String },
    country: { type: String },
    locality_verbose: { type: String },
    cuisines: { type: String },
    average_cost_for_two: { type: Number },
    thumb: { type: String }
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);

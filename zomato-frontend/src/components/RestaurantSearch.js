import React, { useState } from 'react';
import { getRestaurantById, getRestaurants, searchByLocation, searchByImage } from '../service/api';
import './RestaurantSearch.css';

const RestaurantSearch = () => {
    const [resId, setResId] = useState('');
    const [restaurant, setRestaurant] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [radius, setRadius] = useState('');
    const [image, setImage] = useState(null);
    const [activeTab, setActiveTab] = useState('id');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [imageSearchResults, setImageSearchResults] = useState([]);
    const [displayedImageResults, setDisplayedImageResults] = useState(20);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);

    const handleFetchById = async () => {
        setIsLoading(true);
        try {
            const data = await getRestaurantById(resId);
            setRestaurant(data);
        } catch (error) {
            console.error("Error fetching restaurant by ID:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFetchRestaurants = async (page = 1) => {
        setIsLoading(true);
        try {
            const data = await getRestaurants(page, itemsPerPage);
            setRestaurants(data.restaurants);
            setTotalPages(data.totalPages);
            setCurrentPage(page);
        } catch (error) {
            console.error("Error fetching restaurants:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchByLocation = async (page = 1) => {
        setIsLoading(true);
        try {
            const data = await searchByLocation(latitude, longitude, radius, page, itemsPerPage);
            setRestaurants(data.restaurants);
            setTotalPages(data.totalPages);
            setCurrentPage(page);
        } catch (error) {
            console.error("Error searching by location:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSearchByImage = async () => {
        setIsLoading(true);
        try {
            const data = await searchByImage(image);
            setImageSearchResults(data);
            setDisplayedImageResults(20);
        } catch (error) {
            console.error("Error searching by image:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoadMoreImageResults = () => {
        setDisplayedImageResults(prevDisplayed => prevDisplayed + 20);
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        if (activeTab === 'all') {
            handleFetchRestaurants(page);
        } else if (activeTab === 'location') {
            handleSearchByLocation(page);
        }
    };

    const RestaurantCard = ({ restaurant }) => (
        <div className="restaurant-card" onClick={() => setSelectedRestaurant(restaurant)}>
            <img src={restaurant.thumb || '/placeholder.svg?height=200&width=200'} alt={restaurant.name} className="restaurant-image" />
            <div className="restaurant-info">
                <h3>{restaurant.name}</h3>
                {restaurant.cuisines && <p>Cuisines: {restaurant.cuisines}</p>}
                {restaurant.average_cost_for_two && <p>Average cost for two: {restaurant.average_cost_for_two}</p>}
                {restaurant.user_rating && (
                    <div className="rating">
                        Rating: {restaurant.user_rating.aggregate_rating}
                        <span className="rating-text">({restaurant.user_rating.rating_text})</span>
                    </div>
                )}
            </div>
        </div>
    );

    const RestaurantModal = ({ restaurant, onClose }) => (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>&times;</button>
                <h2>{restaurant.name}</h2>
                <img src={restaurant.thumb || '/placeholder.svg?height=400&width=600'} alt={restaurant.name} className="modal-image" />
                <p><strong>Address:</strong> {restaurant.address}</p>
                <p><strong>City:</strong> {restaurant.city}</p>
                <p><strong>Country:</strong> {restaurant.country}</p>
                <p><strong>Cuisines:</strong> {restaurant.cuisines}</p>
                <p><strong>Average cost for two:</strong> {restaurant.average_cost_for_two}</p>
                {restaurant.user_rating && (
                    <div className="rating">
                        <strong>Rating:</strong> {restaurant.user_rating.aggregate_rating}
                        <span className="rating-text">({restaurant.user_rating.rating_text})</span>
                    </div>
                )}
                <a href={restaurant.url} target="_blank" rel="noopener noreferrer" className="restaurant-link-button">
                    Visit Restaurant Page
                </a>
            </div>
        </div>
    );

    return (
        <div className="container">
            <header className="header">
                <h1>Restaurant Search</h1>
            </header>
            <div className="tab-container">
                <button className={`tab-button ${activeTab === 'id' ? 'active' : ''}`} onClick={() => setActiveTab('id')}>Search by ID</button>
                <button className={`tab-button ${activeTab === 'all' ? 'active' : ''}`} onClick={() => { setActiveTab('all'); handleFetchRestaurants(); }}>All Restaurants</button>
                <button className={`tab-button ${activeTab === 'location' ? 'active' : ''}`} onClick={() => setActiveTab('location')}>Search by Location</button>
                <button className={`tab-button ${activeTab === 'image' ? 'active' : ''}`} onClick={() => setActiveTab('image')}>Search by Image</button>
            </div>
            <div className="section">
                {activeTab === 'id' && (
                    <div>
                        <h2>Search by ID</h2>
                        <input
                            className="input"
                            type="text"
                            value={resId}
                            onChange={(e) => setResId(e.target.value)}
                            placeholder="Enter Restaurant ID"
                        />
                        <button className="button" onClick={handleFetchById} disabled={isLoading}>
                            {isLoading ? 'Diving...' : 'Find Restaurant'}
                        </button>
                        {isLoading && <div className="loader"></div>}
                        {!isLoading && restaurant && <RestaurantCard restaurant={restaurant} />}
                    </div>
                )}
                {activeTab === 'all' && (
                    <div>
                        <h2>All Restaurants</h2>
                        
                        {isLoading && <div className="loader"></div>}
                        {!isLoading && restaurants.length > 0 && (
                            <div>
                                <div className="restaurant-grid">
                                    {restaurants.map(r => (
                                        <RestaurantCard key={r.res_id} restaurant={r} />
                                    ))}
                                </div>
                                <div className="pagination">
                                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1 || isLoading}>Previous</button>
                                    <span>Page   {currentPage} of {totalPages}</span>
                                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages || isLoading}>Next</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {activeTab === 'location' && (
                    <div>
                        <h2>Search by Location</h2>
                        <input
                            className="input"
                            type="text"
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                            placeholder="Latitude"
                        />
                        <input
                            className="input"
                            type="text"
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                            placeholder="Longitude"
                        />
                        <input
                            className="input"
                            type="text"
                            value={radius}
                            onChange={(e) => setRadius(e.target.value)}
                            placeholder="Radius (km)"
                        />
                        <button className="button" onClick={() => handleSearchByLocation(currentPage)} disabled={isLoading}>
                            {isLoading ? 'Scanning Ocean...' : 'Search Nearby'}
                        </button>
                        {isLoading && <div className="loader"></div>}
                        {!isLoading && restaurants.length > 0 && (
                            <div>
                                <div className="restaurant-grid">
                                    {restaurants.map(r => (
                                        <RestaurantCard key={r.res_id} restaurant={r} />
                                    ))}
                                </div>
                                <div className="pagination">
                                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1 || isLoading}>Previous</button>
                                    <span>next page {currentPage} of {totalPages}</span>
                                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages || isLoading}>Next</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {activeTab === 'image' && (
                    <div>
                        <h2>Search by Image</h2>
                        <input
                            className="input"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        <button className="button" onClick={handleSearchByImage} disabled={isLoading}>
                            {isLoading ? 'Searching' : 'Search by Image'}
                        </button>
                        {isLoading && <div className="loader"></div>}
                        {!isLoading && imageSearchResults.length > 0 && (
                            <div>
                                <div className="restaurant-grid">
                                    {imageSearchResults.slice(0, displayedImageResults).map(r => (
                                        <RestaurantCard key={r.res_id} restaurant={r} />
                                    ))}
                                </div>
                                {displayedImageResults < imageSearchResults.length && (
                                    <button className="button load-more" onClick={handleLoadMoreImageResults}>
                                        Load more
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
            {selectedRestaurant && (
                <RestaurantModal 
                    restaurant={selectedRestaurant} 
                    onClose={() => setSelectedRestaurant(null)} 
                />
            )}
        </div>
    );
};

export default RestaurantSearch;
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-50 to-purple-50 py-16 px-4 sm:px-6 lg:px-8 rounded-lg mx-4 mt-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-purple-800 mb-4">
            Welcome to the Spice & Tea Exchange
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Discover the world's finest flavors, sourced directly from their origins
          </p>
          <Link 
            to="/products" 
            className="bg-purple-600 text-white px-8 py-4 rounded-lg hover:bg-purple-700 transition-colors duration-300 text-lg font-semibold shadow-md"
          >
            Browse Products
          </Link>
        </div>
      </div>

      {/* Bento Box Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Our Featured Collections</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Rare Spices Box */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="h-48 bg-orange-100 flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1532336414038-cf19250c5757?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                alt="Rare Spices" className="h-full w-full object-cover"/>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Rare Spices</h3>
              <p className="text-gray-600 mb-4">Discover unique flavors from around the world</p>
              <Link to="/products?type=spice" className="text-purple-600 hover:text-purple-800 font-medium inline-flex items-center">
                Explore 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
          
          {/* Premium Teas Box */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="h-48 bg-green-100 flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                alt="Premium Teas" className="h-full w-full object-cover"/>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Premium Teas</h3>
              <p className="text-gray-600 mb-4">Expertly crafted teas from the finest estates</p>
              <Link to="/products?type=tea" className="text-purple-600 hover:text-purple-800 font-medium inline-flex items-center">
                Explore 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
          
          {/* Custom Blends Box */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="h-48 bg-purple-100 flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                alt="Custom Blends" className="h-full w-full object-cover"/>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Custom Blends</h3>
              <p className="text-gray-600 mb-4">Personalized flavor profiles tailored to your taste</p>
              <Link to="/products?type=blend" className="text-purple-600 hover:text-purple-800 font-medium inline-flex items-center">
                Explore 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Origin Story Section */}
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 py-16 px-4 sm:px-6 lg:px-8 mx-4 mb-8 rounded-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Origin Story</h2>
            <p className="text-gray-700 mb-4">
              We travel the world in search of the most exotic spices and teas, building relationships with local farmers who use traditional and sustainable methods.
            </p>
            <p className="text-gray-700 mb-4">
              Every product in our collection tells a story - of the land, the people, and the ancient techniques that bring these incredible flavors to your doorstep.
            </p>
            <Link to="/about" className="inline-block bg-white text-purple-600 font-semibold px-6 py-3 rounded-lg hover:bg-purple-50 transition-colors duration-300">
              Learn More About Us
            </Link>
          </div>
          <div className="md:w-1/2 grid grid-cols-2 gap-4">
            <img 
              src="https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
              alt="Tea plantation" 
              className="rounded-lg h-48 w-full object-cover"
            />
            <img 
              src="https://images.unsplash.com/photo-1560806175-c6f8a8ade8c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
              alt="Spice market" 
              className="rounded-lg h-48 w-full object-cover"
            />
            <img 
              src="https://images.unsplash.com/photo-1586767240180-b32626c5dd16?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
              alt="Tea brewing" 
              className="rounded-lg h-48 w-full object-cover"
            />
            <img 
              src="https://images.unsplash.com/photo-1519990658258-8c2ee974e52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
              alt="Spice collection" 
              className="rounded-lg h-48 w-full object-cover"
            />
          </div>
        </div>
      </div>
      
      {/* Customer Favorites */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Customer Favorites</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Favorite items will be populated here - for now, we'll use placeholders */}
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              <div className="h-40 bg-gray-200">
                {/* Product image placeholder */}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-800">Popular Product</h3>
                <p className="text-gray-600 text-sm">$9.99</p>
                <button className="mt-2 w-full text-center py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-300">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Newsletter Section */}
      <div className="bg-purple-600 text-white py-16 px-4 sm:px-6 lg:px-8 mx-4 mb-8 rounded-lg">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Flavor Journey</h2>
          <p className="text-purple-100 mb-6">
            Sign up for our newsletter to receive exclusive offers, flavor inspirations, and updates on new arrivals.
          </p>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-3 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <button 
              className="bg-white text-purple-700 font-semibold px-6 py-3 rounded-lg hover:bg-purple-50 transition-colors duration-300"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
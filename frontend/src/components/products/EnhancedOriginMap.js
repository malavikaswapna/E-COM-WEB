// frontend/src/components/products/OriginMap.js
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Replace with your Mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoibWFsYXMxMjM0IiwiYSI6ImNtOWQ1NzhubTBhN28yanM1OHU5ZzkzOHkifQ.IdjxcoiVSsUAyPXzxs690Q';

const EnhancedOriginMap = ({ product, producerInfo }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [activeTab, setActiveTab] = useState('map');
  
  useEffect(() => {
    if (!product?.origin || !product.origin.coordinates || !product.origin.coordinates.latitude) {
      return;
    }
    
    const { latitude, longitude } = product.origin.coordinates;
    
    // Initialize map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/outdoors-v11',
      center: [longitude, latitude],
      zoom: 5
    });
    
    mapRef.current = map;
    
    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Add marker
    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<div class="p-2">
        <h3 class="font-bold text-lg">${product.name}</h3>
        <p>${product.origin.country}, ${product.origin.region || ''}</p>
        ${product.origin.farm ? `<p>Farm: ${product.origin.farm}</p>` : ''}
        ${product.origin.altitude ? `<p>Altitude: ${product.origin.altitude}</p>` : ''}
        ${product.origin.cultivationMethod ? 
          `<p>Cultivation: ${product.origin.cultivationMethod}</p>` : ''}
      </div>`
    );
    
    new mapboxgl.Marker()
      .setLngLat([longitude, latitude])
      .setPopup(popup)
      .addTo(map);
    
    // Clean up on unmount
    return () => map.remove();
  }, [product]);
  
  if (!product?.origin || !product.origin.coordinates || !product.origin.coordinates.latitude) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg text-center">
        <h3 className="text-xl font-semibold mb-2">Origin Information</h3>
        <p className="text-gray-600">Detailed location data not available for this product</p>
        
        {product?.origin?.country && (
          <div className="mt-4 p-4 bg-white rounded-md shadow-sm">
            <p><span className="font-medium">Country:</span> {product.origin.country}</p>
            {product.origin.cultivationMethod && (
              <p><span className="font-medium">Cultivation Method:</span> {product.origin.cultivationMethod}</p>
            )}
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`px-4 py-3 flex-grow text-center font-medium ${
            activeTab === 'map' 
              ? 'text-green-700 border-b-2 border-green-500' 
              : 'text-gray-600 hover:text-green-700'
          }`}
          onClick={() => setActiveTab('map')}
        >
          Interactive Map
        </button>
        <button
          className={`px-4 py-3 flex-grow text-center font-medium ${
            activeTab === 'producer' 
              ? 'text-green-700 border-b-2 border-green-500' 
              : 'text-gray-600 hover:text-green-700'
          }`}
          onClick={() => setActiveTab('producer')}
        >
          Producer Story
        </button>
        <button
          className={`px-4 py-3 flex-grow text-center font-medium ${
            activeTab === 'journey' 
              ? 'text-green-700 border-b-2 border-green-500' 
              : 'text-gray-600 hover:text-green-700'
          }`}
          onClick={() => setActiveTab('journey')}
        >
          Journey
        </button>
      </div>
      
      {/* Map View */}
      {activeTab === 'map' && (
        <>
          <div ref={mapContainerRef} className="h-80" />
          <div className="p-6">
            <h3 className="font-semibold text-lg mb-2">Origin Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="mb-1">
                  <span className="font-medium">Country:</span> {product.origin.country}
                </p>
                {product.origin.region && (
                  <p className="mb-1">
                    <span className="font-medium">Region:</span> {product.origin.region}
                  </p>
                )}
                {product.origin.farm && (
                  <p className="mb-1">
                    <span className="font-medium">Farm/Producer:</span> {product.origin.farm}
                  </p>
                )}
              </div>
              <div>
                {product.origin.altitude && (
                  <p className="mb-1">
                    <span className="font-medium">Altitude:</span> {product.origin.altitude}
                  </p>
                )}
                {product.origin.cultivationMethod && (
                  <p className="mb-1">
                    <span className="font-medium">Cultivation Method:</span> {product.origin.cultivationMethod}
                  </p>
                )}
                {product.origin.harvestDate && (
                  <p className="mb-1">
                    <span className="font-medium">Harvest Date:</span> {new Date(product.origin.harvestDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                  </p>
                )}
              </div>
            </div>
            
            {/* QR Code Section */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg flex items-center">
              <div className="bg-white p-3 rounded-md shadow-sm">
                {/* This would be a real QR code in production */}
                <div className="w-24 h-24 bg-black rounded-md flex items-center justify-center text-white text-xs">
                  QR Code
                </div>
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-lg">Batch Verification</h4>
                <p className="text-gray-600 text-sm">
                  Scan this QR code to verify this product's authenticity and view its complete journey
                </p>
                {product.batchInfo?.batchNumber && (
                  <p className="mt-1 text-sm">
                    <span className="font-medium">Batch:</span> {product.batchInfo.batchNumber}
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Producer Story */}
      {activeTab === 'producer' && (
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mr-4">
              <span className="text-green-700 text-xl font-bold">{product.origin.farm ? product.origin.farm.charAt(0) : 'P'}</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">{product.origin.farm || 'Producer'}</h3>
              <p className="text-gray-600">{product.origin.region}, {product.origin.country}</p>
            </div>
          </div>
          
          {producerInfo ? (
            <>
              <div className="prose max-w-none">
                <p>{producerInfo.story || 'Producer information coming soon!'}</p>
              </div>
              
              {producerInfo.images && producerInfo.images.length > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {producerInfo.images.map((img, idx) => (
                    <div key={idx} className="rounded-lg overflow-hidden h-40">
                      <img src={img} alt={`Producer ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg">
              <p>We're currently gathering more information about this producer. Check back soon for updates!</p>
            </div>
          )}
          
          <div className="mt-6 flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium">Sustainable Practices</h4>
              <div className="flex space-x-2 mt-2">
                {['Organic', 'Fair Trade', 'Rainforest Alliance'].map((practice) => (
                  <span key={practice} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {practice}
                  </span>
                ))}
              </div>
            </div>
            <button className="text-green-600 hover:text-green-800 font-medium">
              Learn More
            </button>
          </div>
        </div>
      )}
      
      {/* Journey Tab */}
      {activeTab === 'journey' && (
        <div className="p-6">
          <h3 className="font-semibold text-lg mb-4">From Source to Your Door</h3>
          
          <div className="relative">
            {/* Journey Timeline */}
            <div className="ml-6 border-l-2 border-green-400 pb-1">
              <div className="relative mb-8">
                <div className="absolute -left-7 mt-1.5 h-4 w-4 rounded-full bg-green-500"></div>
                <div className="ml-6">
                  <h4 className="font-medium">Harvested</h4>
                  <p className="text-sm text-gray-600">
                    {product.origin.harvestDate ? 
                      new Date(product.origin.harvestDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) :
                      'Harvest date not available'}
                  </p>
                  <p className="mt-1">Carefully picked at peak ripeness by skilled farmers at {product.origin.farm || 'our partner farms'}</p>
                </div>
              </div>
              
              <div className="relative mb-8">
                <div className="absolute -left-7 mt-1.5 h-4 w-4 rounded-full bg-green-500"></div>
                <div className="ml-6">
                  <h4 className="font-medium">Processed</h4>
                  <p className="text-sm text-gray-600">
                    {product.batchInfo?.productionDate ? 
                      new Date(product.batchInfo.productionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) :
                      'Processing date not available'}
                  </p>
                  <p className="mt-1">
                    {product.type === 'tea' ? 
                      'Carefully withered, rolled, and dried using traditional methods' :
                      'Cleaned, dried, and prepared using techniques specific to this spice'}
                  </p>
                </div>
              </div>
              
              <div className="relative mb-8">
                <div className="absolute -left-7 mt-1.5 h-4 w-4 rounded-full bg-green-500"></div>
                <div className="ml-6">
                  <h4 className="font-medium">Quality Control</h4>
                  <p className="mt-1">Rigorously tested for quality, flavor profile, and purity before being approved for packaging</p>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -left-7 mt-1.5 h-4 w-4 rounded-full bg-green-500"></div>
                <div className="ml-6">
                  <h4 className="font-medium">Packaged</h4>
                  <p className="mt-1">Sealed in small batches to preserve freshness and shipped directly to our distribution center</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800">Sustainability Impact</h4>
            <div className="grid grid-cols-3 gap-4 mt-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">30%</div>
                <p className="text-sm">Less water used than conventional methods</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">100%</div>
                <p className="text-sm">Recyclable packaging materials</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">15%</div>
                <p className="text-sm">Premium paid to farmers above market rate</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedOriginMap;
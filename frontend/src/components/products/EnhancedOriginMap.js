// frontend/src/components/products/EnhancedOriginMap.js
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './EnhancedOriginMap.css';
import { QRCodeSVG } from 'qrcode.react';

// Replace with your Mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoibWFsYXMxMjM0IiwiYSI6ImNtOWQ1NzhubTBhN28yanM1OHU5ZzkzOHkifQ.IdjxcoiVSsUAyPXzxs690Q';

const EnhancedOriginMap = ({ product, producerInfo }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [activeTab, setActiveTab] = useState('map');
  const [mapLoaded, setMapLoaded] = useState(false);
  
  useEffect(() => {
    if (!product?.origin || !product.origin.coordinates || !product.origin.coordinates.latitude) {
      return;
    }
  
    // For blend products, we might have different coordinates approach
    const { latitude, longitude } = product.origin.coordinates;
    
    // Initialize map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/outdoors-v11',
      center: [longitude, latitude],
      zoom: product.type === 'blend' ? 3 : 5
    });
    
    mapRef.current = map;
    
    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Wait for map to load before adding markers
    map.on('load', () => {
      setMapLoaded(true);
    
      // Add marker with custom popup based on product type
      const popupContent = product.type === 'blend' 
        ? `<div class="map-popup">
           <h3 class="popup-title">${product.name}</h3>
           <p>Blend of ingredients from multiple origins</p>
           <p>Blended at: ${product.origin.farm || 'In-house Facility'}</p>
          </div>`
        : `<div class="map-popup">
          <h3 class="popup-title">${product.name}</h3>
          <p>${product.origin.country}${product.origin.region ? `, ${product.origin.region}` : ''}</p>
          ${product.origin.farm ? `<p>Farm: ${product.origin.farm}</p>` : ''}
          ${product.origin.altitude ? `<p>Altitude: ${product.origin.altitude}</p>` : ''}
          ${product.origin.cultivationMethod ? 
            `<p>Cultivation: ${product.origin.cultivationMethod}</p>` : ''}
        </div>`;

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);
      
      const markerColor = {
        'tea': '#15803d',    // Green
        'spice': '#b91c1c',  // Red
        'blend': '#735557'   // Brand color
      };
      
      new mapboxgl.Marker({
        color: markerColor[product.type] || '#735557'
      })
        .setLngLat([longitude, latitude])
        .setPopup(popup)
        .addTo(map);
    });
    
    // Clean up on unmount
    return () => {
      if (map) map.remove();
    };
  }, [product]);
  
  if (!product?.origin || !product.origin.coordinates || !product.origin.coordinates.latitude) {
    return (
      <div className="origin-fallback">
        <h3>Origin Information</h3>
        <p>Detailed location data not available for this product</p>
        
        {product?.origin?.country && (
          <div className="origin-basic-info">
            <p><span>Country:</span> {product.origin.country}</p>
            {product.origin.cultivationMethod && (
              <p><span>Cultivation Method:</span> {product.origin.cultivationMethod}</p>
            )}
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="enhanced-origin-map">
      {/* Tabs */}
      <div className="origin-tabs">
        <button
          className={`origin-tab-button ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveTab('map')}
        >
          Interactive Map
        </button>
        <button
          className={`origin-tab-button ${activeTab === 'producer' ? 'active' : ''}`}
          onClick={() => setActiveTab('producer')}
        >
          Producer Story
        </button>
        <button
          className={`origin-tab-button ${activeTab === 'journey' ? 'active' : ''}`}
          onClick={() => setActiveTab('journey')}
        >
          Journey
        </button>
      </div>
      
      {/* Map View */}
      {activeTab === 'map' && (
        <>
          <div ref={mapContainerRef} className="map-container" />
          
          {!mapLoaded && (
            <div className="map-loading">
              <div className="map-loading-spinner"></div>
              <p>Loading map...</p>
            </div>
          )}
          
          <div className="origin-details">
            <h3>Origin Details</h3>
            <div className="origin-details-grid">
              <div>
                <p>
                  <span>Country:</span> {product.origin.country}
                </p>
                {product.origin.region && (
                  <p>
                    <span>Region:</span> {product.origin.region}
                  </p>
                )}
                {product.origin.farm && (
                  <p>
                    <span>Farm/Producer:</span> {product.origin.farm}
                  </p>
                )}
              </div>
              <div>
                {product.origin.altitude && (
                  <p>
                    <span>Altitude:</span> {product.origin.altitude}
                  </p>
                )}
                {product.origin.cultivationMethod && (
                  <p>
                    <span>Cultivation Method:</span> {product.origin.cultivationMethod}
                  </p>
                )}
                {product.origin.harvestDate && (
                  <p>
                    <span>Harvest Date:</span> {new Date(product.origin.harvestDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                  </p>
                )}
              </div>
            </div>
            
            {/* QR Code Section */}
            <div className="qr-code-section">
              <div className="qr-code">
                <QRCodeSVG
                value={`${window.location.origin}/product/${product._id}`}
                size={128}
                level="H"
                includeMargin={true}
                />
              </div>
              <div className="qr-info">
                <h4>Batch Verification</h4>
                <p>
                  Scan this QR code to verify this product's authenticity and view its complete journey
                </p>
                {product.batchInfo?.batchNumber && (
                  <p>
                    <span>Batch:</span> {product.batchInfo.batchNumber}
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Producer Story */}
      {activeTab === 'producer' && (
        <div className="producer-tab">
          <div className="producer-header">
            <div className="producer-avatar">
              <span>{product.type === 'blend' ? 'B' : product.origin.farm ? product.origin.farm.charAt(0) : 'P'}</span>
            </div>
            <div>
              <h3>{product.type === 'blend' ? 'Our Blending Process' : product.origin.farm || 'Producer'}</h3>
              <p>{product.type === 'blend' ? 'In-house Creation' : `${product.origin.region}, ${product.origin.country}`}</p>
            </div>
          </div>
          
          {product.type === 'blend' ? (
            // Blend-specific content
            <div className="producer-story">
              <p>Our master blenders carefully craft each blend using premium ingredients selected from around the world. Each component is chosen for its unique qualities and how it contributes to the overall profile.</p>
              
              <div className="blend-components">
                <h4>Key Components</h4>
                <ul className="blend-components-list">
                  {product.flavorProfile?.primary?.map((flavor, index) => (
                    <li key={index} className="blend-component-item">
                      <span className="component-name">{flavor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            // Original producer story content for single-origin products
            <>
              {producerInfo ? (
                <>
                  <div className="producer-story">
                    <p>{producerInfo.story || 'Producer information coming soon!'}</p>
                  </div>
                  
                  {producerInfo.images && producerInfo.images.length > 0 && (
                    <div className="producer-images">
                      {producerInfo.images.map((img, idx) => (
                        <div key={idx} className="producer-image">
                          <img src={img} alt={`Producer ${idx + 1}`} />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="producer-placeholder">
                  <p>We're currently gathering more information about this producer. Check back soon for updates!</p>
                </div>
              )}
            </>
          )}
          
          <div className="sustainable-practices">
            <div>
              <h4>Sustainable Practices</h4>
              <div className="practice-badges">
                {['Organic', 'Fair Trade', 'Rainforest Alliance'].map((practice) => (
                  <span key={practice} className="practice-badge">
                    {practice}
                  </span>
                ))}
              </div>
            </div>
            <button className="learn-more-button">
              Learn More
            </button>
          </div>
        </div>
      )}
      
      {/* Journey Tab */}
      {activeTab === 'journey' && (
        <div className="journey-tab">
          <h3>From Source to Your Door</h3>
          
          <div className="journey-timeline">
            <div className="timeline-container">
              {product.type === 'blend' ? (
                // Specialized timeline for blends
                <>
                  <div className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <h4>Ingredient Sourcing</h4>
                      <p className="timeline-date">
                        Various harvest dates
                      </p>
                      <p>High-quality ingredients selected from our trusted partner farms around the world</p>
                    </div>
                  </div>
                  
                  <div className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <h4>Blending</h4>
                      <p className="timeline-date">
                        {product.batchInfo?.productionDate ? 
                          new Date(product.batchInfo.productionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) :
                          'Production date not available'}
                      </p>
                      <p>
                        Carefully balanced and blended to our master blender's specifications
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                // Original timeline for single-origin products
                <>
                  <div className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <h4>Harvested</h4>
                      <p className="timeline-date">
                        {product.origin.harvestDate ? 
                          new Date(product.origin.harvestDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) :
                          'Harvest date not available'}
                      </p>
                      <p>Carefully picked at peak ripeness by skilled farmers at {product.origin.farm || 'our partner farms'}</p>
                    </div>
                  </div>
                  
                  <div className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <h4>Processed</h4>
                      <p className="timeline-date">
                        {product.batchInfo?.productionDate ? 
                          new Date(product.batchInfo.productionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) :
                          'Processing date not available'}
                      </p>
                      <p>
                        {product.type === 'tea' ? 
                          'Carefully withered, rolled, and dried using traditional methods' :
                          'Cleaned, dried, and prepared using techniques specific to this spice'}
                      </p>
                    </div>
                  </div>
                </>
              )}
              
              {/* Common steps for all product types */}
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>Quality Control</h4>
                  <p>Rigorously tested for quality, flavor profile, and purity before being approved for packaging</p>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>Packaged</h4>
                  <p>Sealed in small batches to preserve freshness and shipped directly to our distribution center</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="sustainability-impact">
            <h4>Sustainability Impact</h4>
            <div className="impact-metrics">
              <div className="impact-metric">
                <div className="impact-value">30%</div>
                <p>Less water used than conventional methods</p>
              </div>
              <div className="impact-metric">
                <div className="impact-value">100%</div>
                <p>Recyclable packaging materials</p>
              </div>
              <div className="impact-metric">
                <div className="impact-value">15%</div>
                <p>Premium paid to farmers above market rate</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedOriginMap;
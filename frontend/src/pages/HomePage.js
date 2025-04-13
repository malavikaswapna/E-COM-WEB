import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';


const HomePage = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Discover Extraordinary Flavors ✨</h1>
          <p>Explore our handcrafted collection of premium teas, exotic spices, and unique blends from around the world</p>
          <Link to="/products" className="cta-button">
            Browse Our Collection
          </Link>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="bento-section">
        <div className="section-header">
          <h2>Our Featured Collections ✨</h2>
          <p>Handpicked treasures from our aromatic world</p>
        </div>
        
        <div className="bento-grid">
          {/* Rare Spices Box */}
          <div className="bento-item item-wide">
            <div className="bento-image">
              <img src="https://images.unsplash.com/photo-1532336414038-cf19250c5757?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                alt="Rare Spices" />
            </div>
            <div className="bento-content">
              <h3>Rare Spices</h3>
              <p>Discover unique flavors from around the world</p>
              <Link to="/products?type=spice" className="bento-link">
                Explore <span>→</span>
              </Link>
            </div>
          </div>
          
          {/* Premium Teas Box */}
          <div className="bento-item">
            <div className="bento-image">
              <img src="https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                alt="Premium Teas" />
            </div>
            <div className="bento-content">
              <h3>Premium Teas</h3>
              <p>Expertly crafted teas from the finest estates</p>
              <Link to="/products?type=tea" className="bento-link">
                Explore <span>→</span>
              </Link>
            </div>
          </div>
          
          {/* Custom Blends Box */}
          <div className="bento-item">
            <div className="bento-image">
              <img src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                alt="Custom Blends" />
            </div>
            <div className="bento-content">
              <h3>Custom Blends</h3>
              <p>Personalized flavor profiles tailored to your taste</p>
              <Link to="/products?type=blend" className="bento-link">
                Explore <span>→</span>
              </Link>
            </div>
          </div>
          
          {/* Subscription Box */}
          <div className="bento-item item-tall">
            <div className="bento-image">
              <img src="https://m.media-amazon.com/images/I/91TvH3TALqL._AC_UF894,1000_QL80_FMwebp_DpWeblab_.jpg" 
                alt="Subscription Boxes" />
            </div>
            <div className="bento-content">
              <h3>Subscription Boxes</h3>
              <p>Get your favorite flavors delivered regularly</p>
              <Link to="/subscriptions" className="bento-link">
                Explore <span>→</span>
              </Link>
            </div>
          </div>
          
          {/* New Arrivals */}
          <div className="bento-item">
            <div className="bento-image">
              <img src="https://tucsontea.com/cdn/shop/articles/SP-keto-teas.jpg?v=1706932063" 
                alt="New Arrivals" />
            </div>
            <div className="bento-content">
              <h3>New Arrivals</h3>
              <p>Fresh selections added to our collection</p>
              <Link to="/products" className="bento-link">
                Explore <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Story Section */}
      <section className="story-section">
        <div className="story-container">
          <div className="story-content">
            <h2>Our Journey of Flavors ✨</h2>
            <p>
              We travel the world in search of the most exquisite spices and teas, building relationships with local farmers who use traditional and sustainable methods.
            </p>
            <p>
              Every product in our collection tells a story - of the land, the people, and the ancient techniques that bring these incredible flavors to your doorstep.
            </p>
            <Link to="/about" className="story-button">
              Discover Our Story
            </Link>
          </div>
          
          <div className="story-images">
            <div className="image-grid">
              <img 
                src="https://media.istockphoto.com/id/534111760/photo/tea-plantation-in-cameron-highlands-malaysia.jpg?s=612x612&w=0&k=20&c=JjZV1FSztAZb5DQL2hmg5feI6FgaXJXg83WsEGc0_nY=" 
                alt="Tea plantation" 
                className="grid-image"
              />
              <img 
                src="https://cdn.audleytravel.com/1050/750/79/15984093-traditional-spice-bazaar-istanbul.webp" 
                alt="Spice market" 
                className="grid-image"
              />
              <img 
                src="https://cdn.shopify.com/s/files/1/1576/7147/files/20230127_how_to_brew_loose_leaf_tea_pour.jpg?v=1675446745" 
                alt="Tea brewing" 
                className="grid-image"
              />
              <img 
                src="https://mediaproxy.salon.com/width/1200/https://media2.salon.com/2023/10/variety_of_spices_497186232.jpg" 
                alt="Spice collection" 
                className="grid-image"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="benefits-container">
          <div className="benefit-card">
            <div className="benefit-icon">🌱</div>
            <h3>Ethically Sourced</h3>
            <p>All our products are responsibly sourced from farmers who are paid fair wages</p>
          </div>
          
          <div className="benefit-card">
            <div className="benefit-icon">🔍</div>
            <h3>Quality Tested</h3>
            <p>Every product batch undergoes rigorous quality testing for purity and flavor</p>
          </div>
          
          <div className="benefit-card">
            <div className="benefit-icon">🚚</div>
            <h3>Free Shipping</h3>
            <p>Enjoy free shipping on all orders over $75 within the United States</p>
          </div>
          
          <div className="benefit-card">
            <div className="benefit-icon">📦</div>
            <h3>Subscription Savings</h3>
            <p>Save 10% on all products with our flexible subscription plans</p>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2>What Our Customers Say ✨</h2>
          <p>Experiences from our flavor enthusiasts</p>
        </div>
        
        <div className="testimonials-container">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"The Ceylon Cinnamon has completely transformed my morning coffee routine. The flavor is so much more complex than any grocery store cinnamon!"</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">
                <span>SJ</span>
              </div>
              <div className="author-info">
                <h4>Sarah Johnson</h4>
                <p>Coffee Enthusiast</p>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"I've been subscribed to the monthly tea box for 6 months now, and I'm constantly surprised by the unique and delicious selections they send!"</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">
                <span>RL</span>
              </div>
              <div className="author-info">
                <h4>Robert Lee</h4>
                <p>Tea Connoisseur</p>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"The Jasmine Dragon Pearl tea is simply divine. The aroma fills the room and the taste is so delicate and floral. Absolutely worth the price!"</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">
                <span>AP</span>
              </div>
              <div className="author-info">
                <h4>Alice Parker</h4>
                <p>Frequent Customer</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-container">
          <h2>Join Our Flavor Journey ✨</h2>
          <p>Sign up for our newsletter to receive exclusive offers, flavor inspirations, and updates on new arrivals</p>
          
          <form className="newsletter-form">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="newsletter-input"
            />
            <button type="submit" className="newsletter-button">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

// src/config/stripeConfig.js
import { loadStripe } from '@stripe/stripe-js';

// Replace with your own publishable key from the Stripe Dashboard
const stripePromise = loadStripe('pk_test_51RCTVd4UqftcztGBKSEhcSlAxpdNsdcQKhoYiyUSerteZREmXedeXiOQi0Imi2m6LXDoLbQPdNh3IR3VjkGCEpdY00uMNrEGC1');

export default stripePromise;
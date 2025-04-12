// backend/utils/flavorMatching.js
/**
 * Calculate flavor profile match score between user preferences and product
 * @param {Object} userPreferences - User's flavor preferences
 * @param {Object} productFlavor - Product's flavor profile
 * @returns {Number} Match score (0-100)
 */
exports.calculateFlavorMatch = (userPreferences, productFlavor) => {
  if (!userPreferences || !productFlavor) return 0;
  
  let score = 0;
  const maxScore = 100;
  
  // Match liked flavors (up to 50 points)
  if (userPreferences.likedFlavors && userPreferences.likedFlavors.length > 0) {
    const likedMatches = productFlavor.characteristics?.filter(flavor => 
      userPreferences.likedFlavors.includes(flavor)
    ) || [];
    
    const likedMatchScore = Math.min(50, (likedMatches.length / userPreferences.likedFlavors.length) * 50);
    score += likedMatchScore;
  }
  
  // Avoid disliked flavors (up to 30 points)
  if (userPreferences.dislikedFlavors && userPreferences.dislikedFlavors.length > 0) {
    const dislikedMatches = productFlavor.characteristics?.filter(flavor => 
      userPreferences.dislikedFlavors.includes(flavor)
    ) || [];
    
    if (dislikedMatches.length === 0) {
      score += 30; // Full points if no disliked flavors are in the product
    } else {
      // Reduce score based on how many disliked flavors are in the product
      const dislikeReduction = (dislikedMatches.length / userPreferences.dislikedFlavors.length) * 30;
      score += (30 - dislikeReduction);
    }
  } else {
    score += 30; // No dislikes means full points
  }
  
  // Match intensity preference (up to 20 points)
  if (userPreferences.preferredIntensity && productFlavor.intensity) {
    const intensityDiff = Math.abs(userPreferences.preferredIntensity - productFlavor.intensity);
    // Perfect match = 20 points, 1 off = 15 points, 2 off = 10 points, 3 off = 5 points, 4+ off = 0 points
    const intensityScore = Math.max(0, 20 - (intensityDiff * 5));
    score += intensityScore;
  }
  
  return Math.round(score);
};

/**
 * Sort products by flavor match score
 * @param {Array} products - List of products
 * @param {Object} userPreferences - User's flavor preferences
 * @returns {Array} Sorted products with match scores
 */
exports.sortByFlavorMatch = (products, userPreferences) => {
  if (!userPreferences || !products || products.length === 0) return products;
  
  return products.map(product => {
    const matchScore = this.calculateFlavorMatch(userPreferences, product.flavorProfile);
    return { ...product, matchScore };
  }).sort((a, b) => b.matchScore - a.matchScore);
};
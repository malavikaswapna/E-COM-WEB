// frontend/src/utils/teaRecipes.js
const teaRecipes = {
  // Brewing methods for different tea types
  brewingMethods: {
    default: {
      title: "Perfect Brewing Method",
      time: "3-4 minutes",
      temp: "175°F (80°C)",
      servings: 1,
      image: "/images/brewing-guide.jpg",
      steps: [
        "Heat fresh water to 175°F (80°C)",
        "Use 1 teaspoon of tea per 8oz cup",
        "Steep for 3-4 minutes",
        "Strain and enjoy"
      ]
    },
    chai: {
        title: "Perfect Chai Brewing",
        time: "5-7 minutes",
        temp: "195°F (90°C)",
        servings: 1,
        image: "/images/chai-brewing.jpg",
        steps: [
          "Heat fresh water to 195°F (90°C)",
          "Use 1-2 teaspoons of chai blend per 8oz cup",
          "Steep for 5-7 minutes for full flavor development",
          "For traditional chai latte: Steep in 4oz water, then add 4oz hot milk and sweetener"
        ]
      },
    green: {
      title: "Green Tea Brewing Guide",
      time: "2-3 minutes",
      temp: "175°F (80°C)",
      servings: 1,
      image: "/images/green-tea-brewing.jpg",
      steps: [
        "Heat fresh water to 175°F (80°C)",
        "Use 1 teaspoon of tea per 8oz cup",
        "Steep for 2-3 minutes",
        "Strain and enjoy"
      ]
    },
    jasmine: {
      title: "Jasmine Tea Brewing Guide",
      time: "2-3 minutes",
      temp: "175°F (80°C)",
      servings: 1,
      image: "/images/jasmine-tea-brewing.jpg",
      steps: [
        "Heat fresh water to 175°F (80°C)",
        "Use 1 teaspoon of tea per 8oz cup",
        "Steep for 2-3 minutes",
        "Enjoy multiple infusions - this tea can be steeped 2-3 times"
      ]
    }
  },
  
  // Food pairings for different tea types
  pairings: {
    default: {
      title: "Perfect Food Pairings",
      time: "N/A",
      servings: "Various",
      image: "/images/tea-pairings.jpg",
      items: [
        "Light pastries",
        "Fresh fruit",
        "Mild cheeses",
        "Shortbread cookies"
      ]
    },
    chai: {
        title: "Chai Tea Pairings",
        time: "N/A",
        servings: "Various",
        image: "/images/chai-pairings.jpg",
        items: [
          "Spiced cookies and biscotti",
          "Vanilla or caramel desserts",
          "Apple or pumpkin pie",
          "Aged cheeses with honey",
          "Breakfast pastries"
        ]
      },
    jasmine: {
      title: "Jasmine Tea Pairings",
      time: "N/A",
      servings: "Various",
      image: "/images/jasmine-pairings.jpg",
      items: [
        "Dim sum",
        "Light seafood dishes",
        "Fresh fruit tarts",
        "Floral honey desserts"
      ]
    },
    green: {
      title: "Green Tea Pairings",
      time: "N/A",
      servings: "Various",
      image: "/images/green-tea-pairings.jpg",
      items: [
        "Sushi and sashimi",
        "Vegetable dishes",
        "Salads with light dressing",
        "Rice-based dishes"
      ]
    }
  },
  
  // Tea-based recipes
  recipes: {
    jasmine: [
      {
        id: "jasmine-lemonade",
        title: "Jasmine Tea Lemonade",
        time: "15 minutes",
        servings: 4,
        image: "/images/jasmine-lemonade.jpg",
        ingredients: [
          "4 teaspoons Jasmine Dragon Pearl tea",
          "4 cups hot water (175°F)",
          "1/4 cup honey or simple syrup",
          "1/2 cup fresh lemon juice",
          "Lemon slices and mint for garnish",
          "Ice cubes"
        ],
        instructions: [
          "Brew tea in hot water for 3 minutes",
          "Strain and let cool",
          "Stir in honey and lemon juice",
          "Refrigerate until chilled",
          "Serve over ice with lemon slices and mint"
        ]
      },
      {
        id: "jasmine-panna-cotta",
        title: "Jasmine Tea Panna Cotta",
        time: "4 hours (including setting time)",
        servings: 4,
        image: "/images/jasmine-panna-cotta.jpg",
        ingredients: [
          "2 cups heavy cream",
          "1/2 cup sugar",
          "2 tablespoons Jasmine Dragon Pearl tea",
          "1 packet (2 1/4 teaspoons) unflavored gelatin",
          "1/4 cup cold water",
          "Fresh berries for garnish"
        ],
        instructions: [
          "Bloom gelatin in cold water",
          "Heat cream and sugar until hot but not boiling",
          "Add tea leaves and steep for 5 minutes",
          "Strain out tea leaves",
          "Whisk in bloomed gelatin until dissolved",
          "Pour into ramekins and refrigerate for at least 4 hours",
          "Serve with fresh berries"
        ]
      }
    ],
    green: [
      {
        id: "green-tea-smoothie",
        title: "Green Tea Smoothie Bowl",
        time: "10 minutes",
        servings: 2,
        image: "/images/green-tea-smoothie.jpg",
        ingredients: [
          "2 teaspoons green tea powder (matcha)",
          "1 frozen banana",
          "1/2 cup yogurt",
          "1 tablespoon honey",
          "1/4 cup milk of choice",
          "Toppings: granola, fresh fruit, coconut flakes"
        ],
        instructions: [
          "Blend all ingredients except toppings until smooth",
          "Pour into bowls",
          "Add toppings and enjoy immediately"
        ]
      }
    ],
    chai: [
        {
          id: "iced-chai-latte",
          title: "Refreshing Iced Chai Latte",
          time: "10 minutes",
          servings: 2,
          image: "/images/iced-chai-latte.jpg",
          ingredients: [
            "2 tablespoons Summer Chai Blend",
            "2 cups water",
            "1 cup milk (or plant-based alternative)",
            "2 tablespoons honey or maple syrup",
            "Ice cubes",
            "Cinnamon stick and star anise for garnish"
          ],
          instructions: [
            "Steep the chai blend in hot water (195°F) for 5 minutes",
            "Strain the tea and let it cool",
            "In a blender, combine the cooled tea, milk, and sweetener",
            "Pour over ice in tall glasses",
            "Garnish with cinnamon stick and star anise"
          ]
        },
        {
          id: "chai-spiced-cookies",
          title: "Chai-Spiced Shortbread Cookies",
          time: "35 minutes",
          servings: 24,
          image: "/images/chai-cookies.jpg",
          ingredients: [
            "1 tablespoon Summer Chai Blend, finely ground",
            "2 cups all-purpose flour",
            "1 cup unsalted butter, softened",
            "1/2 cup powdered sugar",
            "1/4 teaspoon salt",
            "1 teaspoon vanilla extract",
            "Granulated sugar for sprinkling"
          ],
          instructions: [
            "Cream together butter and sugar until light and fluffy",
            "Mix in vanilla extract",
            "In a separate bowl, combine flour, ground chai tea, and salt",
            "Gradually add dry ingredients to butter mixture",
            "Form dough into a log, wrap in plastic, and chill for 30 minutes",
            "Slice into 1/4-inch rounds and place on baking sheet",
            "Bake at 325°F for 15-18 minutes until edges are lightly golden",
            "Sprinkle with sugar while still warm"
          ]
        },
        {
          id: "chai-smoothie-bowl",
          title: "Summer Chai Smoothie Bowl",
          time: "15 minutes",
          servings: 2,
          image: "/images/chai-smoothie.jpg",
          ingredients: [
            "1/4 cup strong-brewed Summer Chai Blend, chilled",
            "1 frozen banana",
            "1/2 cup Greek yogurt",
            "1 tablespoon almond butter",
            "1 tablespoon honey",
            "Toppings: granola, fresh berries, sliced banana, coconut flakes"
          ],
          instructions: [
            "Brew chai tea double-strength and let cool completely",
            "In a blender, combine chai tea, frozen banana, yogurt, almond butter, and honey",
            "Blend until smooth and creamy",
            "Pour into bowls and add toppings",
            "Serve immediately"
          ]
        },
        {
          id: "chai-poached-pears",
          title: "Chai-Poached Pears",
          time: "35 minutes",
          servings: 4,
          image: "/images/chai-pears.jpg",
          ingredients: [
            "4 firm pears, peeled with stems intact",
            "3 tablespoons Summer Chai Blend",
            "4 cups water",
            "1 cup sugar",
            "2 cinnamon sticks",
            "1 vanilla bean, split",
            "Whipped cream or ice cream for serving"
          ],
          instructions: [
            "In a large pot, combine water, sugar, cinnamon sticks, and vanilla bean",
            "Bring to a simmer and add chai tea blend",
            "Steep for 10 minutes, then strain",
            "Return liquid to pot and add the peeled pears",
            "Simmer gently for 15-20 minutes until pears are tender",
            "Remove pears and reduce poaching liquid by half",
            "Serve pears with reduced syrup and a dollop of whipped cream or ice cream"
          ]
        }
      ],
    default: [
      {
        id: "tea-poached-pears",
        title: "Tea-Poached Pears",
        time: "30 minutes",
        servings: 4,
        image: "/images/tea-poached-pears.jpg",
        ingredients: [
          "4 firm pears, peeled",
          "4 cups water",
          "3 tablespoons tea leaves",
          "1 cup sugar",
          "1 cinnamon stick",
          "3 star anise pods",
          "1 vanilla bean, split"
        ],
        instructions: [
          "Bring water, sugar, and spices to a simmer",
          "Add tea leaves and steep for 5 minutes, then strain",
          "Add pears to the tea syrup",
          "Simmer for 15-20 minutes until tender",
          "Serve warm or chilled with reduced poaching liquid"
        ]
      }
    ]
  }
};

// Helper function to get tea recipes based on product name/type
export const getTeaRecipes = (productName, productType) => {
  // Determine tea type from product name
  const lowerName = productName.toLowerCase();
  let teaType = 'default';
  
  if (lowerName.includes('jasmine')) {
    teaType = 'jasmine';
  } else if (lowerName.includes('green') || lowerName.includes('matcha')) {
    teaType = 'green';
  } else if (lowerName.includes('chai')) {
    teaType = 'chai';
  }

  // For blend products, prioritize specific blend types
  if (productType === 'blend') {
    if (lowerName.includes('chai')) {
      teaType = 'chai';
    }
  }
  
  // Return recipes, brewing method, and pairings
  const brewingMethod = teaRecipes.brewingMethods[teaType] || teaRecipes.brewingMethods.default;
  const pairings = teaRecipes.pairings[teaType] || teaRecipes.pairings.default;
  const recipes = teaRecipes.recipes[teaType] || teaRecipes.recipes.default;
  
  return {
    brewingMethod,
    pairings,
    recipes
  };
};

export default teaRecipes;
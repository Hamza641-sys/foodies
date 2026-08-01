/**
 * L'Étoile Dorée - AI Chatbot & Recommendation System
 * Simulates a smart assistant providing recommendations, answers to FAQs, and menu searches.
 */

class AIChatbot {
  constructor() {
    this.context = {
      askedForRecommendation: false,
      lastDishesOffered: []
    };
  }

  /**
   * Process user input message and return a smart reply
   * @param {string} rawInput 
   * @returns {Promise<{text: string, dishes?: Array<object>}>}
   */
  async processMessage(rawInput) {
    const input = rawInput.toLowerCase().trim();
    
    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // 1. GREETINGS
    if (input.includes('hello') || input.includes('hi') || input.includes('hey') || input.includes('assalam')) {
      return {
        text: "Greetings, premium guest! Welcome to L'Étoile Dorée AI assistant. How may I elevate your dining experience today? I can recommend dishes, details about our Michelin-star chefs, delivery areas, or help book a table."
      };
    }

    // 2. TIMINGS / HOURS
    if (input.includes('time') || input.includes('hour') || input.includes('open') || input.includes('close')) {
      return {
        text: "Our luxury dining room is open daily from 12:00 PM to 11:30 PM. Happy Hour runs daily from 4:00 PM to 7:00 PM with special offers on desserts and coffee."
      };
    }

    // 3. BOOKING / TABLE RESERVATION
    if (input.includes('book') || input.includes('table') || input.includes('reserve') || input.includes('reservation')) {
      return {
        text: "You can easily book a table directly on our Reservation page! We offer Indoor tables, Outdoor terrace views, private VIP Lounges, and exclusive VIP tables. Would you like me to redirect you? Just go to the Reservation tab above."
      };
    }

    // 4. DELIVERY INFO
    if (input.includes('deliver') || input.includes('zone') || input.includes('postal') || input.includes('zip') || input.includes('charge')) {
      return {
        text: "We deliver to Westminster Heights, Downtown Core, the Embassy District, and Royal Estates. Delivery charges range from $5 to $12 depending on location. Standard deliveries take between 15 to 40 minutes."
      };
    }

    // 5. CHEF DETAILS
    if (input.includes('chef') || input.includes('jean-luc') || input.includes('sakura') || input.includes('isabella')) {
      return {
        text: "Our culinary direction is led by Executive Chef Jean-Luc L'Étoile (3 Michelin Stars), supported by Sakura Sato (Japanese Specialist) and Isabella Moretti (Award-winning Pastry Chef). Every dish is an artisanal masterpiece."
      };
    }

    // 6. RECOMMENDED COMBOS
    if (input.includes('combo') || input.includes('deal') || input.includes('package')) {
      const combos = [
        "**The Wagyu Dream:** Wagyu Gold Burger + Sicilian Pistachio Gelato + Royal Mojito",
        "**Oceanic Elegance:** Tagliolini with Caviar + Smoked Salmon Benedict + Champagne Latte",
        "**Imperial Feast:** Royal Truffle Pizza + Peking Duck + Chocolate Lava Sphere"
      ];
      return {
        text: `Here are our recommended luxury combos curated by Chef Jean-Luc:<br><br>${combos.join('<br><br>')}`
      };
    }

    // 7. FOOD RECOMMENDATIONS (Keywords matching)
    let matchedDishes = [];
    
    if (input.includes('recommend') || input.includes('suggest') || input.includes('eating') || input.includes('food') || input.includes('menu')) {
      // General recommendation: return featured items
      matchedDishes = window.DISHES.filter(d => d.featured || d.recommended);
    } else {
      // Keyword filter
      if (input.includes('spicy') || input.includes('hot') || input.includes('chili') || input.includes('karahi')) {
        matchedDishes = window.DISHES.filter(d => d.spicyLevel >= 2);
      }
      if (input.includes('sweet') || input.includes('dessert') || input.includes('cake') || input.includes('chocolate') || input.includes('gelato')) {
        matchedDishes = window.DISHES.filter(d => d.category === 'desserts' || d.category === 'icecream');
      }
      if (input.includes('meat') || input.includes('steak') || input.includes('ribs') || input.includes('beef') || input.includes('wagyu')) {
        matchedDishes = window.DISHES.filter(d => d.name.toLowerCase().includes('wagyu') || d.name.toLowerCase().includes('steak') || d.name.toLowerCase().includes('ribs'));
      }
      if (input.includes('seafood') || input.includes('fish') || input.includes('sushi') || input.includes('lobster') || input.includes('salmon') || input.includes('caviar')) {
        matchedDishes = window.DISHES.filter(d => d.ingredients.some(i => ['lobster', 'salmon', 'caviar', 'shrimp', 'trout roe'].includes(i.toLowerCase())));
      }
      if (input.includes('healthy') || input.includes('salad') || input.includes('calorie') || input.includes('low')) {
        matchedDishes = window.DISHES.filter(d => d.calories < 300 || d.category === 'salad');
      }
      if (input.includes('pizza') || input.includes('cheese')) {
        matchedDishes = window.DISHES.filter(d => d.category === 'pizza' || d.ingredients.includes('Burrata') || d.ingredients.includes('Cheese'));
      }
    }

    if (matchedDishes.length > 0) {
      // Pick top 3 recommendations
      const recommendations = matchedDishes.slice(0, 3);
      this.context.lastDishesOffered = recommendations;
      this.context.askedForRecommendation = true;
      return {
        text: `Based on your request, I highly recommend exploring these premium culinary creations:`,
        dishes: recommendations
      };
    }

    // Default Fallback
    return {
      text: "I want to make sure I assist you perfectly. Could you clarify if you are looking to book a table, track an ongoing order, browse a specific category (e.g. Steak, Pizza, Desserts), or find a dish tailored to your preference (e.g., spicy, healthy, chocolate)?"
    };
  }
}

window.AIChatbot = new AIChatbot();

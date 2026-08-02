/**
 * Foodies - AI Chatbot & Recommendation System
 * Helps users find dishes, place orders, book tables, and get info.
 */

class AIChatbot {
  constructor() {
    this.context = {
      askedForRecommendation: false,
      lastDishesOffered: []
    };
  }

  async processMessage(rawInput) {
    const input = rawInput.toLowerCase().trim();

    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 600));

    // 1. GREETINGS
    if (input.match(/^(hello|hi|hey|assalam|salam|helo|hii)/)) {
      return {
        text: "👋 Welcome to <strong>Foodies</strong>! I'm your AI assistant. I can help you:<br><br>🍽️ Find dishes<br>🛒 Add items to cart<br>📦 Track your order<br>📅 Book a table<br><br>What would you like today?"
      };
    }

    // 2. ORDER TRACKING
    if (input.includes('track') || input.includes('order status') || input.includes('where is my order') || input.includes('mera order')) {
      return {
        text: "📦 To track your order, go to <strong>Dashboard → Orders</strong> tab and click the Track button next to your order. Or if you have your Order ID (like FD-XXXXX), go to <strong>#tracking</strong> page directly!"
      };
    }

    // 3. BOOKING / TABLE RESERVATION
    if (input.includes('book') || input.includes('table') || input.includes('reserve') || input.includes('reservation') || input.includes('seat')) {
      return {
        text: "📅 You can book a table easily! Just click <strong>Reservation</strong> in the menu above, fill in your name, date, time and number of guests. We offer Indoor, Outdoor, VIP and Private Room options. Want me to take you there?",
        action: { type: 'link', href: '#reservation', label: 'Book a Table' }
      };
    }

    // 4. DELIVERY INFO
    if (input.includes('deliver') || input.includes('zone') || input.includes('charge') || input.includes('fee') || input.includes('kitna') || input.includes('cost')) {
      return {
        text: "🚀 We deliver to multiple areas! Delivery charges are:<br><br>• Downtown Core — $5.00<br>• Westminster Heights — $8.00<br>• Embassy District — $10.00<br>• Royal Estates VIP — $12.00<br><br>Orders above <strong>$50 get FREE delivery!</strong> ⏱️ Estimated time: 30-40 mins."
      };
    }

    // 5. OPENING HOURS
    if (input.includes('time') || input.includes('hour') || input.includes('open') || input.includes('close') || input.includes('timing')) {
      return {
        text: "🕐 <strong>Foodies Opening Hours:</strong><br><br>Mon – Thu: 12:00 PM – 11:00 PM<br>Fri – Sun: 12:00 PM – 11:30 PM<br>VIP Lounge: 24/7 (By Reservation)"
      };
    }

    // 6. HOW TO ORDER
    if (input.includes('how to order') || input.includes('kaise order') || input.includes('ordering') || input.includes('place order') || input.includes('karo order')) {
      return {
        text: "🛒 Ordering is simple!<br><br>1️⃣ Go to <strong>Menu</strong><br>2️⃣ Click any dish → Add to Cart<br>3️⃣ Open cart (top right 🛒)<br>4️⃣ Click <strong>Checkout</strong><br>5️⃣ Fill address & payment → Done!<br><br>Want me to show you our best dishes?",
        action: { type: 'link', href: '#menu', label: 'Browse Menu' }
      };
    }

    // 7. PAYMENT
    if (input.includes('payment') || input.includes('pay') || input.includes('card') || input.includes('jazzcash') || input.includes('easypaisa') || input.includes('cash')) {
      return {
        text: "💳 We accept multiple payment methods:<br><br>• Credit/Debit Card<br>• PayPal<br>• JazzCash<br>• EasyPaisa<br>• Cash on Delivery<br><br>All payments are 100% secure! 🔒"
      };
    }

    // 8. COUPON / DISCOUNT
    if (input.includes('coupon') || input.includes('discount') || input.includes('offer') || input.includes('promo') || input.includes('deal')) {
      const coupons = window.COUPONS || [];
      if (coupons.length) {
        const list = coupons.slice(0, 3).map(c => `<strong>${c.code}</strong> — ${c.description}`).join('<br>');
        return { text: `🎁 Current offers:<br><br>${list}<br><br>Apply coupon code in the cart before checkout!` };
      }
      return {
        text: "🎁 Current active deals:<br><br><strong>HAPPYHOUR</strong> — 15% off Desserts & Coffee<br><strong>WEEKEND15</strong> — Free Mango Lassi with Biryani<br><strong>NEWUSER</strong> — 10% off first order<br><br>Apply in cart at checkout!"
      };
    }

    // 9. BEST SELLERS
    if (input.includes('best') || input.includes('popular') || input.includes('top') || input.includes('most ordered') || input.includes('famous')) {
      const dishes = (window.DISHES || []).filter(d => d.bestSeller).slice(0, 3);
      if (dishes.length) {
        return {
          text: "⭐ Our <strong>Best Sellers</strong> right now:",
          dishes
        };
      }
    }

    // 10. SPICY FOOD
    if (input.includes('spicy') || input.includes('hot') || input.includes('karahi') || input.includes('chili') || input.includes('teekha')) {
      const dishes = (window.DISHES || []).filter(d => d.spicyLevel >= 2).slice(0, 3);
      if (dishes.length) {
        return { text: "🌶️ Love spicy food? Try these hot picks:", dishes };
      }
    }

    // 11. DESSERTS / SWEET
    if (input.includes('sweet') || input.includes('dessert') || input.includes('cake') || input.includes('chocolate') || input.includes('ice cream') || input.includes('mithai')) {
      const dishes = (window.DISHES || []).filter(d => d.category === 'desserts' || d.category === 'icecream').slice(0, 3);
      if (dishes.length) {
        return { text: "🍰 Something sweet? Our desserts are irresistible:", dishes };
      }
    }

    // 12. BURGER / FAST FOOD
    if (input.includes('burger') || input.includes('fast food') || input.includes('fries') || input.includes('sandwich')) {
      const dishes = (window.DISHES || []).filter(d => d.category === 'fastfood').slice(0, 3);
      if (dishes.length) {
        return { text: "🍔 Our Fast Food favorites:", dishes };
      }
    }

    // 13. PIZZA
    if (input.includes('pizza') || input.includes('pasta')) {
      const dishes = (window.DISHES || []).filter(d => d.category === 'pizza').slice(0, 3);
      if (dishes.length) {
        return { text: "🍕 Fresh out of the oven:", dishes };
      }
    }

    // 14. DESI / BIRYANI
    if (input.includes('biryani') || input.includes('karahi') || input.includes('desi') || input.includes('rice') || input.includes('pulao') || input.includes('nihari')) {
      const dishes = (window.DISHES || []).filter(d => d.category === 'desi').slice(0, 3);
      if (dishes.length) {
        return { text: "🍛 Desi khana lovers, yeh try karo:", dishes };
      }
    }

    // 15. DRINKS
    if (input.includes('drink') || input.includes('juice') || input.includes('coffee') || input.includes('tea') || input.includes('chai') || input.includes('shake') || input.includes('lassi')) {
      const dishes = (window.DISHES || []).filter(d => d.category === 'drinks').slice(0, 3);
      if (dishes.length) {
        return { text: "🥤 Refresh yourself with our drinks:", dishes };
      }
    }

    // 16. STEAK / BBQ
    if (input.includes('steak') || input.includes('bbq') || input.includes('grill') || input.includes('beef') || input.includes('wagyu') || input.includes('ribs')) {
      const dishes = (window.DISHES || []).filter(d => d.category === 'steaks').slice(0, 3);
      if (dishes.length) {
        return { text: "🥩 Premium steaks & BBQ — cooked to perfection:", dishes };
      }
    }

    // 17. HEALTHY / LOW CALORIE
    if (input.includes('healthy') || input.includes('diet') || input.includes('calorie') || input.includes('light') || input.includes('salad')) {
      const dishes = (window.DISHES || []).filter(d => d.calories < 350).slice(0, 3);
      if (dishes.length) {
        return { text: "🥗 Healthy & light options for you:", dishes };
      }
    }

    // 18. GENERAL RECOMMENDATION
    if (input.includes('recommend') || input.includes('suggest') || input.includes('kya order') || input.includes('what should') || input.includes('best dish') || input.includes('kya lun')) {
      const dishes = (window.DISHES || []).filter(d => d.recommended || d.featured).slice(0, 3);
      if (dishes.length) {
        return {
          text: "👨‍🍳 Chef's top recommendations for you today:",
          dishes
        };
      }
    }

    // 19. MENU / SHOW ALL
    if (input.includes('menu') || input.includes('full menu') || input.includes('all dishes') || input.includes('kya hai') || input.includes('show dishes')) {
      return {
        text: "🍽️ Check out our full menu with 40+ dishes across categories like Burgers, Desi, Steaks, Pizza, Desserts and more!",
        action: { type: 'link', href: '#menu', label: 'View Full Menu' }
      };
    }

    // 20. THANKS
    if (input.includes('thank') || input.includes('shukriya') || input.includes('thanks') || input.includes('shukria')) {
      return {
        text: "😊 You're welcome! Enjoy your meal at <strong>Foodies</strong>. Is there anything else I can help you with?"
      };
    }

    // DEFAULT FALLBACK
    return {
      text: "🤔 I didn't quite catch that! Here's what I can help with:<br><br>🍔 <strong>Find dishes</strong> — type 'burger', 'biryani', 'pizza'<br>🌶️ <strong>Spicy food</strong> — type 'spicy'<br>🎁 <strong>Discounts</strong> — type 'coupon'<br>📦 <strong>Track order</strong> — type 'track order'<br>📅 <strong>Book table</strong> — type 'book table'<br>🕐 <strong>Hours</strong> — type 'opening hours'<br><br>What would you like? 😊"
    };
  }
}

window.AIChatbot = new AIChatbot();

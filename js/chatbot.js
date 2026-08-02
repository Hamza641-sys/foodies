/**
 * Foodies - Smart AI Chatbot (No API needed)
 * Advanced NLP-like keyword matching with context awareness
 */

class AIChatbot {
  constructor() {
    this.context        = null;
    this.orderStep      = null;
    this.lastDishes     = [];
    this.userName       = null;
    this.conversationCount = 0;
  }

  async processMessage(rawInput) {
    const input = rawInput.toLowerCase().trim();
    this.conversationCount++;
    await new Promise(r => setTimeout(r, 400));

    // ── GREETING ─────────────────────────────────
    if (input.match(/^(hello|hi|hey|salam|assalam|helo|hii|good morning|good evening|good night|bonjour|hola)/)) {
      const greetings = [
        `👋 Welcome to <strong>Foodies!</strong> I'm your personal food concierge.<br><br>I can help you:<br>🍽️ Find the perfect dish<br>🎁 Get best combo deals<br>🌶️ Spicy food recommendations<br>📦 Track your order<br>📅 Book a table<br><br>What are you craving today?`,
        `😊 Hey there! Great to see you at <strong>Foodies!</strong><br><br>We have <strong>90+ dishes</strong> from 25 world cuisines!<br>What would you like to eat today?`,
        `🍴 Hello! Welcome to Foodies — where every bite tells a story!<br><br>Tell me what you're in the mood for and I'll find the perfect dish for you!`
      ];
      return { text: greetings[Math.floor(Math.random() * greetings.length)], dishes: [] };
    }

    // ── HUNGRY / WANT TO ORDER ────────────────────
    if (input.match(/hungry|bhook|kha|order karna|order krna|kuch kha|mujhe kha|i want to eat|i'm hungry|food chahiye|khana do|what.*eat|recommend.*something/)) {
      const dishes = (window.DISHES || []).filter(d => d.bestSeller || d.recommended).slice(0, 4);
      this.lastDishes = dishes;
      return {
        text: `😋 Hungry? Great choice coming to Foodies!<br><br>Here are our <strong>most loved dishes</strong> right now — just click <strong>Add to Cart</strong>:`,
        dishes,
        showOrderHelp: true
      };
    }

    // ── WHAT IS SPECIAL ───────────────────────────
    if (input.match(/special|today.*special|kya.*special|best.*dish|signature|chef.*recommend|kya.*acha|what.*good|what.*best/)) {
      const specials = (window.DISHES || []).filter(d => d.featured || d.recommended).slice(0, 4);
      return {
        text: `⭐ Today's <strong>Chef Specials</strong> — handpicked for an extraordinary experience:`,
        dishes: specials
      };
    }

    // ── BUDGET / CHEAP ────────────────────────────
    if (input.match(/cheap|budget|affordable|sasta|kam paise|low price|under \$(\d+)|(\d+).*mein|(\d+) dollar/)) {
      const match   = input.match(/(\d+)/);
      const budget  = match ? parseFloat(match[1]) : 20;
      const dishes  = (window.DISHES || []).filter(d => (d.price * (1 - d.discount / 100)) <= budget).slice(0, 4);
      return {
        text: `💰 Great value picks ${budget < 50 ? `under $${budget}` : 'at budget-friendly prices'}:`,
        dishes: dishes.length ? dishes : (window.DISHES || []).sort((a,b) => a.price - b.price).slice(0, 4)
      };
    }

    // ── SPICY ─────────────────────────────────────
    if (input.match(/spicy|hot|teekha|mirch|jhalak|fire|🌶/)) {
      const dishes = (window.DISHES || []).filter(d => d.spicyLevel >= 2).slice(0, 4);
      return {
        text: `🌶️🔥 Love the heat? These will set your taste buds on fire!<br><span style="font-size:.75rem;color:var(--text-muted);">Warning: seriously spicy! 😅</span>`,
        dishes
      };
    }

    // ── NOT SPICY / MILD ──────────────────────────
    if (input.match(/not spicy|mild|no spice|bina mirch|without spice|spicy nahi/)) {
      const dishes = (window.DISHES || []).filter(d => d.spicyLevel === 0).slice(0, 4);
      return { text: `😌 No problem! Here are our <strong>mild & non-spicy</strong> options:`, dishes };
    }

    // ── VEGETARIAN / VEGAN ────────────────────────
    if (input.match(/vegetarian|vegan|veggie|sabzi|vegetables|no meat|without meat|veg only/)) {
      const keywords = ['salad', 'healthy', 'pasta', 'pizza'];
      const dishes   = (window.DISHES || []).filter(d => keywords.includes(d.category) || (d.ingredients || []).some(i => ['mushroom','cheese','tomato','spinach','avocado'].includes(i.toLowerCase()))).slice(0, 4);
      return { text: `🥗 Fresh & delicious <strong>vegetarian options</strong> for you:`, dishes };
    }

    // ── BURGER ────────────────────────────────────
    if (input.match(/burger|burgers|patty|bun|smash/)) {
      const dishes = (window.DISHES || []).filter(d => d.category === 'burger' || d.category === 'fastfood').slice(0, 4);
      return { text: `🍔 Our <strong>signature burgers</strong> — juicy, loaded and unforgettable:`, dishes };
    }

    // ── PIZZA ─────────────────────────────────────
    if (input.match(/pizza|pizzas|pasta|italian/)) {
      const dishes = (window.DISHES || []).filter(d => d.category === 'pizza' || d.category === 'pasta').slice(0, 4);
      return { text: `🍕 Fresh from our wood-fired oven — <strong>Italian favorites:</strong>`, dishes };
    }

    // ── DESI / PAKISTANI ──────────────────────────
    if (input.match(/desi|biryani|karahi|nihari|haleem|pulao|korma|pakistan|lahori|peshawari|naan|roti|daal/)) {
      const dishes = (window.DISHES || []).filter(d => d.category === 'desi').slice(0, 4);
      return { text: `🍛 Desi ka maza — <strong>ghar jaisi taste, restaurant quality!</strong>`, dishes };
    }

    // ── INDIAN ────────────────────────────────────
    if (input.match(/indian|butter chicken|paneer|samosa|tikka|masala|curry|dal makhani|hyderabadi/)) {
      const dishes = (window.DISHES || []).filter(d => d.category === 'indian' || d.category === 'desi').slice(0, 4);
      return { text: `🫕 Rich, aromatic <strong>Indian classics:</strong>`, dishes };
    }

    // ── STEAK / BBQ ───────────────────────────────
    if (input.match(/steak|bbq|grill|beef|wagyu|ribeye|ribs|smoke|barbeque/)) {
      const dishes = (window.DISHES || []).filter(d => d.category === 'steak' || d.category === 'bbq').slice(0, 4);
      return { text: `🥩 Premium cuts & smoky BBQ — <strong>cooked to perfection:</strong>`, dishes };
    }

    // ── SEAFOOD ───────────────────────────────────
    if (input.match(/seafood|fish|salmon|shrimp|lobster|prawn|crab|tuna/)) {
      const dishes = (window.DISHES || []).filter(d => d.category === 'seafood').slice(0, 4);
      return { text: `🦞 <strong>Fresh from the ocean</strong> — our finest seafood:`, dishes };
    }

    // ── ARABIC / MIDDLE EAST ──────────────────────
    if (input.match(/arabic|shawarma|falafel|hummus|arabic|mansaf|kebab|arab/)) {
      const dishes = (window.DISHES || []).filter(d => d.category === 'arabic' || d.category === 'turkish').slice(0, 4);
      return { text: `🧆 Authentic <strong>Middle Eastern flavors:</strong>`, dishes };
    }

    // ── CHINESE / JAPANESE / KOREAN ───────────────
    if (input.match(/chinese|noodles|fried rice|dim sum|wonton|japanese|sushi|ramen|korean|bibimbap/)) {
      const dishes = (window.DISHES || []).filter(d => ['chinese','japanese','korean'].includes(d.category)).slice(0, 4);
      return { text: `🍜 <strong>Asian cuisine</strong> — flavors from the Far East:`, dishes };
    }

    // ── THAI / MEXICAN ────────────────────────────
    if (input.match(/thai|pad thai|green curry|mexican|tacos|burrito|nachos|quesadilla/)) {
      const dishes = (window.DISHES || []).filter(d => ['thai','mexican'].includes(d.category)).slice(0, 4);
      return { text: `🌮 <strong>International street food favorites:</strong>`, dishes };
    }

    // ── DESSERT ───────────────────────────────────
    if (input.match(/dessert|sweet|cake|chocolate|ice cream|tiramisu|cheesecake|lava|baklava|mithai/)) {
      const dishes = (window.DISHES || []).filter(d => d.category === 'desserts' || d.category === 'icecream').slice(0, 4);
      return { text: `🍰 <strong>Life is sweet</strong> — indulge in our desserts:`, dishes };
    }

    // ── DRINKS / COFFEE ───────────────────────────
    if (input.match(/drink|juice|coffee|tea|chai|shake|lassi|smoothie|mojito|lemonade/)) {
      const dishes = (window.DISHES || []).filter(d => d.category === 'drinks' || d.category === 'coffee').slice(0, 4);
      return { text: `🥤 Refresh yourself with our <strong>signature drinks:</strong>`, dishes };
    }

    // ── BREAKFAST ─────────────────────────────────
    if (input.match(/breakfast|morning|nashta|eggs|pancake|waffle|croissant/)) {
      const dishes = (window.DISHES || []).filter(d => d.category === 'breakfast').slice(0, 4);
      return { text: `🥐 <strong>Start your day right</strong> with our breakfast menu:`, dishes };
    }

    // ── HEALTHY ───────────────────────────────────
    if (input.match(/healthy|diet|fitness|low calorie|light|salad|nutrition|protein|vit/)) {
      const dishes = (window.DISHES || []).filter(d => d.category === 'healthy' || d.category === 'salad' || d.calories < 400).slice(0, 4);
      return { text: `🥑 <strong>Healthy & nutritious</strong> options — good food, good mood:`, dishes };
    }

    // ── SOUP ──────────────────────────────────────
    if (input.match(/soup|shorba|broth|chowder|bisque/)) {
      const dishes = (window.DISHES || []).filter(d => d.category === 'soup').slice(0, 4);
      return { text: `🍵 <strong>Warm & comforting soups:</strong>`, dishes };
    }

    // ── COMBO / DEAL ──────────────────────────────
    if (input.match(/combo|deal|bundle|family|couple|party|offer|package|sasta combo|meal deal/)) {
      return {
        text: `🎁 <strong>Best Value Combo Deals!</strong><br><br>
        👨‍👩‍👧‍👦 <strong>Family Feast</strong> — 4 people, $99 (Save $35)<br>
        💑 <strong>Couple Date Night</strong> — 2 people, $105 (Save $33)<br>
        👑 <strong>Big Daddy Deal</strong> — 5 people, $139 (Save $53)<br>
        🍛 <strong>Desi Dawat</strong> — 4 people, $79 (Save $32)<br>
        🎉 <strong>Party Platter</strong> — 8 people, $219 (Save $75)<br><br>
        <a href="#menu" onclick="app.setMenuCategory('combos')" style="color:var(--primary);font-weight:700;">View All Combos →</a>`,
        dishes: []
      };
    }

    // ── DISCOUNT / COUPON ─────────────────────────
    if (input.match(/coupon|discount|promo|code|offer|free|sale|cheap|save/)) {
      const coupons = window.COUPONS || [];
      const list    = coupons.length
        ? coupons.map(c => `🎁 <strong>${c.code}</strong> — ${c.description}`).join('<br>')
        : `🎁 <strong>FOODIES20</strong> — 20% off total order<br>🎁 <strong>WELCOME50</strong> — 50% off first order<br>🎁 <strong>FLAT10</strong> — $10 off any order`;
      return { text: `${list}<br><br>Apply code in cart before checkout! 🛒`, dishes: [] };
    }

    // ── DELIVERY INFO ─────────────────────────────
    if (input.match(/delivery|deliver|time|kitna time|how long|how much.*delivery|shipping/)) {
      return {
        text: `🚀 <strong>Delivery Info:</strong><br><br>
        ⏱️ Time: <strong>30-40 mins</strong><br>
        💵 Fee: $5 (FREE on orders above $50!)<br><br>
        📍 Zones & charges:<br>
        • Downtown Core — $5<br>
        • Westminster Heights — $8<br>
        • Embassy District — $10<br>
        • Royal Estates — $12`,
        dishes: []
      };
    }

    // ── HOURS ─────────────────────────────────────
    if (input.match(/hour|time|open|close|timing|when.*open|kab.*khula/)) {
      return {
        text: `🕐 <strong>Opening Hours:</strong><br><br>
        Mon – Thu: 12:00 PM – 11:00 PM<br>
        Fri – Sun: 12:00 PM – 11:30 PM<br>
        VIP Lounge: 24/7 (By Reservation only)<br><br>
        📅 <a href="#reservation" style="color:var(--primary);font-weight:700;">Book a Table →</a>`,
        dishes: []
      };
    }

    // ── TABLE BOOKING ─────────────────────────────
    if (input.match(/book|table|reservation|reserve|seat|dine in|dine-in|baith|jagah/)) {
      return {
        text: `📅 <strong>Book Your Table!</strong><br><br>
        We have Indoor 🏠, Outdoor 🌿, VIP 👑 & Private Room 🚪 options.<br><br>
        Special occasions? Birthdays 🎂, Anniversaries 💑, Business dinners 💼 — we handle it all!`,
        action: { href: '#reservation', label: '📅 Reserve Now' }
      };
    }

    // ── ORDER TRACKING ────────────────────────────
    if (input.match(/track|order status|where.*order|my order|kahan.*order|order.*kahan/)) {
      return {
        text: `📦 <strong>Track Your Order:</strong><br><br>
        1️⃣ Go to <strong>Dashboard</strong> in the menu<br>
        2️⃣ Click <strong>Orders</strong> tab<br>
        3️⃣ Click <strong>Track</strong> next to your order<br><br>
        Or enter your Order ID (FD-XXXXX) on the tracking page directly!`,
        action: { href: '#dashboard', label: '📦 Go to Dashboard' }
      };
    }

    // ── PAYMENT ───────────────────────────────────
    if (input.match(/payment|pay|card|jazzcash|easypaisa|cash|online pay|how.*pay/)) {
      return {
        text: `💳 <strong>Payment Methods:</strong><br><br>
        💳 Credit / Debit Card<br>
        🅿️ PayPal<br>
        📱 JazzCash<br>
        📱 EasyPaisa<br>
        💵 Cash on Delivery<br><br>
        All payments are <strong>100% secure</strong> 🔒`,
        dishes: []
      };
    }

    // ── CART STATUS ───────────────────────────────
    if (input.match(/cart|basket|my cart|mera cart|what.*cart/)) {
      const cart  = window.app?.state?.cart || [];
      if (!cart.length) {
        return { text: `🛒 Your cart is empty!<br><br>Tell me what you'd like and I'll help you order. Try saying:<br><em>"Show me burgers"</em> or <em>"I want something spicy"</em>`, dishes: [] };
      }
      const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
      const list  = cart.map(i => `• ${i.name} ×${i.qty} — $${(i.price * i.qty).toFixed(2)}`).join('<br>');
      return {
        text: `🛒 <strong>Your Cart:</strong><br><br>${list}<br><br><strong>Total: $${total.toFixed(2)}</strong><br><br>Ready to order?`,
        showCheckoutBtn: true
      };
    }

    // ── CHECKOUT ──────────────────────────────────
    if (input.match(/checkout|place.*order|complete.*order|order karo|finalize|pay.*now/)) {
      const cart = window.app?.state?.cart || [];
      if (!cart.length) return { text: `⚠️ Your cart is empty! Add some dishes first.`, dishes: [] };
      return {
        text: `✅ Ready to checkout! You have <strong>${cart.length} item(s)</strong> in your cart.`,
        showCheckoutBtn: true
      };
    }

    // ── THANKS ────────────────────────────────────
    if (input.match(/thank|shukriya|thanks|jazakallah|appreciate|great|awesome|perfect/)) {
      return { text: `😊 You're most welcome! Enjoy your meal at <strong>Foodies</strong>! 🍽️<br><br>Anything else I can help with?`, dishes: [] };
    }

    // ── SHOW MENU ─────────────────────────────────
    if (input.match(/menu|full menu|all dishes|show.*food|kya.*hy|what.*have|categories/)) {
      return {
        text: `🍽️ We have <strong>90+ dishes</strong> across 25 world cuisines!<br><br>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;">
          <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('burgers')">🍔 Burgers</button>
          <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('biryani')">🍛 Desi</button>
          <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('pizza')">🍕 Pizza</button>
          <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('steak')">🥩 Steak</button>
          <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('sushi')">🍣 Japanese</button>
          <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('tacos')">🌮 Mexican</button>
          <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('seafood')">🦞 Seafood</button>
          <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('dessert')">🍰 Desserts</button>
          <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('drinks')">🥤 Drinks</button>
          <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('healthy food')">🥑 Healthy</button>
        </div>`
      };
    }

    // ── DEFAULT SMART FALLBACK ────────────────────
    const fallbacks = [
      `🤔 Interesting! Let me help you find the perfect dish.<br><br>What are you in the mood for?<br><br>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;">
        <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('best dishes')">⭐ Best Dishes</button>
        <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('combo deals')">🎁 Combo Deals</button>
        <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('spicy food')">🌶️ Spicy</button>
        <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('show menu')">🍽️ Full Menu</button>
      </div>`,
      `😊 I'd love to help! What cuisine are you in the mood for today?<br><br>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;">
        <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('desi food')">🍛 Desi</button>
        <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('burger')">🍔 Burger</button>
        <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('healthy food')">🥗 Healthy</button>
        <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('deals')">🏷️ Deals</button>
      </div>`
    ];
    return { text: fallbacks[this.conversationCount % 2], dishes: [] };
  }

  quickAsk(text) {
    const input = document.getElementById('chatbotInputMsg');
    if (input) { input.value = text; document.getElementById('chatbotSendBtn')?.click(); }
  }

  notifyCartAdded(dishName) {
    const body = document.getElementById('chatbotBody');
    if (!body) return;
    const msg  = document.createElement('div');
    msg.className = 'chat-msg chat-msg-bot';
    msg.innerHTML = `✅ <strong>${dishName}</strong> added to cart!<br><br>Want to add more or checkout?`;
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;';
    wrap.innerHTML = `
      <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('show menu')">🍽️ Add More</button>
      <button class="chatbot-quick-btn" onclick="window.location.hash='#checkout';app.toggleChatbot(false);" style="background:var(--primary);color:#000;">🛒 Checkout Now</button>`;
    body.appendChild(msg);
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
  }
}

window.AIChatbot = new AIChatbot();

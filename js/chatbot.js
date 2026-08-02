/**
 * Foodies - AI Chatbot with Full Order Flow
 * User can discover dishes, add to cart, and checkout through chat.
 */

class AIChatbot {
  constructor() {
    this.context = {
      lastDishesShown: [],
      awaitingOrderConfirm: false,
      awaitingCheckout: false,
      orderStep: null // 'browsing' | 'cart_added' | 'checkout_ready'
    };
  }

  async processMessage(rawInput) {
    const input = rawInput.toLowerCase().trim();
    await new Promise(resolve => setTimeout(resolve, 500));

    // ── ORDER INTENT — user wants to order something ──────────────
    if (
      input.includes('order karna') || input.includes('order karo') ||
      input.includes('mujhe order') || input.includes('i want to order') ||
      input.includes('order chahiye') || input.includes('order krna') ||
      input.includes('mujy order') || input.includes('order karna hai') ||
      input.includes('place order') || input.includes('khana order') ||
      input.includes('order karna chahta') || input.includes('order lena')
    ) {
      // Check what they want to order
      const dish = this._findDishFromInput(input);
      if (dish.length > 0) {
        this.context.lastDishesShown = dish;
        this.context.orderStep = 'browsing';
        return {
          text: `🛒 Great choice! Here are the options I found. Click <strong>"Add to Cart"</strong> on any dish, then I'll help you checkout:`,
          dishes: dish,
          showOrderHelp: true
        };
      }
      // Generic order intent — ask what they want
      this.context.orderStep = 'browsing';
      return {
        text: `🍽️ I'd love to help you order! What are you craving?<br><br>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;">
          <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('burger')">🍔 Burger</button>
          <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('biryani')">🍛 Biryani</button>
          <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('pizza')">🍕 Pizza</button>
          <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('steak')">🥩 Steak</button>
          <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('dessert')">🍰 Dessert</button>
          <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('drinks')">🥤 Drinks</button>
        </div>`
      };
    }

    // ── CART STATUS ───────────────────────────────────────────────
    if (input.includes('cart') || input.includes('kart') || input.includes('basket') || input.includes('mera cart')) {
      const cart = window.app?.state?.cart || [];
      if (!cart.length) {
        return {
          text: `🛒 Your cart is empty right now.<br><br>Tell me what you'd like to eat and I'll help you add it! Try typing:<br><em>"I want to order a burger"</em> or <em>"show me pizza"</em>`
        };
      }
      const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
      const itemsList = cart.map(i => `• ${i.name} ×${i.qty} — $${(i.price * i.qty).toFixed(2)}`).join('<br>');
      return {
        text: `🛒 <strong>Your Cart:</strong><br><br>${itemsList}<br><br><strong>Subtotal: $${total.toFixed(2)}</strong><br><br>Ready to checkout?`,
        showCheckoutBtn: true
      };
    }

    // ── CHECKOUT INTENT ───────────────────────────────────────────
    if (
      input.includes('checkout') || input.includes('pay') ||
      input.includes('place my order') || input.includes('order karo') ||
      input.includes('complete order') || input.includes('yes checkout') ||
      input.includes('han') || input.includes('haan') ||
      (input.includes('yes') && this.context.orderStep === 'cart_added')
    ) {
      const cart = window.app?.state?.cart || [];
      if (!cart.length) {
        return {
          text: `⚠️ Your cart is empty! Add some dishes first.<br><br>Tell me what you want: <em>"show me burgers"</em>`
        };
      }
      this.context.orderStep = 'checkout_ready';
      return {
        text: `✅ Great! Your cart has <strong>${cart.length} item(s)</strong>. Click below to complete your order:`,
        showCheckoutBtn: true
      };
    }

    // ── SPECIFIC DISH BY NAME ─────────────────────────────────────
    if (input.includes('tell me about') || input.includes('details') || input.includes('bata') || input.includes('kya hai')) {
      const dishes = this._findDishFromInput(input);
      if (dishes.length > 0) {
        const d = dishes[0];
        const price = (d.price * (1 - (d.discount || 0) / 100)).toFixed(2);
        return {
          text: `🍽️ <strong>${d.name}</strong><br><br>
          📝 ${d.description}<br><br>
          💰 Price: <strong>$${price}</strong>${d.discount > 0 ? ` <s style="color:var(--text-muted)">$${d.price}</s>` : ''}<br>
          ⏱️ Cook time: ${d.cookingTime}<br>
          🔥 Calories: ${d.calories} kcal<br>
          🌶️ Spice level: ${'🌶'.repeat(d.spicyLevel) || 'Mild'}<br>
          ⭐ Rating: ${d.rating}/5<br><br>
          Want to add it to cart?`,
          dishes: [d]
        };
      }
    }

    // ── SHOW MENU CATEGORIES ──────────────────────────────────────
    if (input.includes('menu') || input.includes('kya hai') || input.includes('show menu') || input.includes('full menu') || input.includes('sab kuch')) {
      return {
        text: `🍽️ Here's our full menu! What are you in the mood for?<br><br>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;">
          <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('burger')">🍔 Burgers</button>
          <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('biryani')">🍛 Desi</button>
          <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('pizza')">🍕 Pizza</button>
          <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('steak')">🥩 Steaks</button>
          <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('dessert')">🍰 Desserts</button>
          <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('drinks')">🥤 Drinks</button>
          <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('healthy')">🥗 Healthy</button>
          <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('seafood')">🦞 Seafood</button>
        </div>`
      };
    }

    // ── GREETINGS ─────────────────────────────────────────────────
    if (input.match(/^(hello|hi|hey|assalam|salam|helo|hii|aoa|good morning|good evening)/)) {
      return {
        text: `👋 Welcome to <strong>Foodies!</strong> I'm your AI food assistant 🤖<br><br>
        I can help you:<br>
        🍽️ <strong>Order food</strong> — just say "I want to order a burger"<br>
        📦 <strong>Track order</strong> — say "track my order"<br>
        📅 <strong>Book table</strong> — say "book a table"<br>
        🎁 <strong>Get discounts</strong> — say "show coupons"<br><br>
        What would you like? 😊`
      };
    }

    // ── BURGER ───────────────────────────────────────────────────
    if (input.includes('burger') || input.includes('fastfood') || input.includes('fast food') || input.includes('sandwich')) {
      const dishes = (window.DISHES || []).filter(d => d.category === 'fastfood').slice(0, 4);
      if (dishes.length) {
        this.context.lastDishesShown = dishes;
        this.context.orderStep = 'browsing';
        return { text: `🍔 Our juicy burgers! Click <strong>Add to Cart</strong> to order:`, dishes };
      }
    }

    // ── BIRYANI / DESI ────────────────────────────────────────────
    if (input.includes('biryani') || input.includes('karahi') || input.includes('desi') || input.includes('nihari') || input.includes('pulao') || input.includes('rice')) {
      const dishes = (window.DISHES || []).filter(d => d.category === 'desi').slice(0, 4);
      if (dishes.length) {
        this.context.lastDishesShown = dishes;
        this.context.orderStep = 'browsing';
        return { text: `🍛 Desi khana — ghar jaisi taste! Click <strong>Add to Cart</strong>:`, dishes };
      }
    }

    // ── PIZZA ────────────────────────────────────────────────────
    if (input.includes('pizza') || input.includes('pasta')) {
      const dishes = (window.DISHES || []).filter(d => d.category === 'pizza').slice(0, 4);
      if (dishes.length) {
        this.context.lastDishesShown = dishes;
        this.context.orderStep = 'browsing';
        return { text: `🍕 Fresh pizza straight from the oven! Click <strong>Add to Cart</strong>:`, dishes };
      }
    }

    // ── STEAK / BBQ ───────────────────────────────────────────────
    if (input.includes('steak') || input.includes('bbq') || input.includes('grill') || input.includes('beef') || input.includes('wagyu')) {
      const dishes = (window.DISHES || []).filter(d => d.category === 'steaks').slice(0, 4);
      if (dishes.length) {
        this.context.lastDishesShown = dishes;
        this.context.orderStep = 'browsing';
        return { text: `🥩 Premium steaks & BBQ — cooked to perfection! Click <strong>Add to Cart</strong>:`, dishes };
      }
    }

    // ── DESSERT ───────────────────────────────────────────────────
    if (input.includes('dessert') || input.includes('sweet') || input.includes('cake') || input.includes('chocolate') || input.includes('ice cream') || input.includes('mithai')) {
      const dishes = (window.DISHES || []).filter(d => d.category === 'desserts' || d.category === 'icecream').slice(0, 4);
      if (dishes.length) {
        this.context.lastDishesShown = dishes;
        this.context.orderStep = 'browsing';
        return { text: `🍰 Sweet treats for you! Click <strong>Add to Cart</strong>:`, dishes };
      }
    }

    // ── DRINKS ───────────────────────────────────────────────────
    if (input.includes('drink') || input.includes('juice') || input.includes('coffee') || input.includes('tea') || input.includes('shake') || input.includes('lassi')) {
      const dishes = (window.DISHES || []).filter(d => d.category === 'drinks').slice(0, 4);
      if (dishes.length) {
        this.context.lastDishesShown = dishes;
        this.context.orderStep = 'browsing';
        return { text: `🥤 Refreshing drinks! Click <strong>Add to Cart</strong>:`, dishes };
      }
    }

    // ── SPICY ────────────────────────────────────────────────────
    if (input.includes('spicy') || input.includes('hot') || input.includes('teekha') || input.includes('mirch')) {
      const dishes = (window.DISHES || []).filter(d => d.spicyLevel >= 2).slice(0, 4);
      if (dishes.length) {
        this.context.lastDishesShown = dishes;
        this.context.orderStep = 'browsing';
        return { text: `🌶️ Hot & spicy picks! Can you handle the heat? Click <strong>Add to Cart</strong>:`, dishes };
      }
    }

    // ── HEALTHY ──────────────────────────────────────────────────
    if (input.includes('healthy') || input.includes('diet') || input.includes('light') || input.includes('salad') || input.includes('low calorie')) {
      const dishes = (window.DISHES || []).filter(d => d.calories < 400).slice(0, 4);
      if (dishes.length) {
        this.context.lastDishesShown = dishes;
        this.context.orderStep = 'browsing';
        return { text: `🥗 Healthy & delicious options! Click <strong>Add to Cart</strong>:`, dishes };
      }
    }

    // ── BEST SELLERS / RECOMMEND ──────────────────────────────────
    if (input.includes('best') || input.includes('popular') || input.includes('recommend') || input.includes('suggest') || input.includes('kya lun') || input.includes('top')) {
      const dishes = (window.DISHES || []).filter(d => d.bestSeller || d.recommended).slice(0, 4);
      if (dishes.length) {
        this.context.lastDishesShown = dishes;
        this.context.orderStep = 'browsing';
        return { text: `⭐ Our most popular dishes right now! Click <strong>Add to Cart</strong>:`, dishes };
      }
    }

    // ── ORDER TRACKING ────────────────────────────────────────────
    if (input.includes('track') || input.includes('order status') || input.includes('mera order') || input.includes('where is')) {
      return {
        text: `📦 To track your order:<br><br>
        1️⃣ Go to <strong>Dashboard</strong> in the menu<br>
        2️⃣ Click <strong>Orders</strong> tab<br>
        3️⃣ Click <strong>Track</strong> button next to your order<br><br>
        Or enter your Order ID (FD-XXXXX) directly on the tracking page.`,
        action: { type: 'link', href: '#dashboard', label: 'Go to Dashboard' }
      };
    }

    // ── BOOK TABLE ────────────────────────────────────────────────
    if (input.includes('book') || input.includes('table') || input.includes('reserve') || input.includes('seat') || input.includes('reservation')) {
      return {
        text: `📅 <strong>Book a Table at Foodies!</strong><br><br>
        We have Indoor, Outdoor, VIP & Private Room options.<br><br>
        🕐 Hours:<br>
        Mon–Thu: 12PM – 11PM<br>
        Fri–Sun: 12PM – 11:30PM<br><br>
        Click below to reserve your seat:`,
        action: { type: 'link', href: '#reservation', label: '📅 Book a Table' }
      };
    }

    // ── COUPONS ───────────────────────────────────────────────────
    if (input.includes('coupon') || input.includes('discount') || input.includes('offer') || input.includes('promo')) {
      const coupons = window.COUPONS || [];
      const list = coupons.length
        ? coupons.slice(0, 4).map(c => `🎁 <strong>${c.code}</strong> — ${c.description}`).join('<br>')
        : `🎁 <strong>HAPPYHOUR</strong> — 15% off Desserts<br>🎁 <strong>WEEKEND15</strong> — Free Lassi with Biryani<br>🎁 <strong>NEWUSER</strong> — 10% off first order`;
      return {
        text: `${list}<br><br>Enter code in cart before checkout!`
      };
    }

    // ── DELIVERY INFO ─────────────────────────────────────────────
    if (input.includes('deliver') || input.includes('charge') || input.includes('fee') || input.includes('kitna time')) {
      return {
        text: `🚀 <strong>Delivery Info:</strong><br><br>
        • Downtown Core — $5.00<br>
        • Westminster Heights — $8.00<br>
        • Embassy District — $10.00<br>
        • Royal Estates — $12.00<br><br>
        ✅ <strong>FREE delivery</strong> on orders above $50!<br>
        ⏱️ Estimated time: <strong>30-40 mins</strong>`
      };
    }

    // ── PAYMENT ───────────────────────────────────────────────────
    if (input.includes('payment') || input.includes('pay') || input.includes('card') || input.includes('jazzcash') || input.includes('easypaisa') || input.includes('cash')) {
      return {
        text: `💳 <strong>Payment Methods:</strong><br><br>
        💳 Credit/Debit Card<br>
        🅿️ PayPal<br>
        📱 JazzCash<br>
        📱 EasyPaisa<br>
        💵 Cash on Delivery<br><br>
        All transactions are 100% secure 🔒`
      };
    }

    // ── THANKS ────────────────────────────────────────────────────
    if (input.includes('thank') || input.includes('shukriya') || input.includes('thanks') || input.includes('shukria') || input.includes('jazakallah')) {
      return {
        text: `😊 You're welcome! Enjoy your meal at <strong>Foodies</strong>! 🍽️<br><br>Is there anything else I can help you with?`
      };
    }

    // ── DEFAULT FALLBACK ──────────────────────────────────────────
    return {
      text: `🤔 I can help you with:<br><br>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;">
        <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('order karna hai')">🛒 Order Food</button>
        <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('best dishes')">⭐ Best Dishes</button>
        <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('show menu')">🍽️ Full Menu</button>
        <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('track order')">📦 Track Order</button>
        <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('coupon')">🎁 Discounts</button>
        <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('book table')">📅 Book Table</button>
      </div>`
    };
  }

  // ── HELPER — find dishes from user input ──────────────────────
  _findDishFromInput(input) {
    const dishes = window.DISHES || [];
    const matches = dishes.filter(d =>
      input.includes(d.name.toLowerCase()) ||
      input.includes(d.category.toLowerCase()) ||
      (d.ingredients || []).some(i => input.includes(i.toLowerCase()))
    );
    if (matches.length) return matches.slice(0, 4);

    // Category keywords
    if (input.includes('burger') || input.includes('fast food')) return dishes.filter(d => d.category === 'fastfood').slice(0, 4);
    if (input.includes('pizza') || input.includes('pasta'))      return dishes.filter(d => d.category === 'pizza').slice(0, 4);
    if (input.includes('biryani') || input.includes('desi'))     return dishes.filter(d => d.category === 'desi').slice(0, 4);
    if (input.includes('steak') || input.includes('bbq'))        return dishes.filter(d => d.category === 'steaks').slice(0, 4);
    if (input.includes('dessert') || input.includes('sweet'))    return dishes.filter(d => d.category === 'desserts').slice(0, 4);
    if (input.includes('drink') || input.includes('juice'))      return dishes.filter(d => d.category === 'drinks').slice(0, 4);

    return [];
  }

  // ── Quick reply buttons helper ────────────────────────────────
  quickAsk(text) {
    const input = document.getElementById('chatbotInputMsg');
    if (input) {
      input.value = text;
      document.getElementById('chatbotSendBtn')?.click();
    }
  }

  // ── Called from app.js when dish added to cart via chatbot ────
  notifyCartAdded(dishName) {
    this.context.orderStep = 'cart_added';
    const body = document.getElementById('chatbotBody');
    if (!body) return;
    const msg = document.createElement('div');
    msg.className = 'chat-msg chat-msg-bot';
    msg.innerHTML = `✅ <strong>${dishName}</strong> added to cart!<br><br>Want to add more or ready to checkout?`;

    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;';
    wrap.innerHTML = `
      <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('show menu')">🍽️ Add More</button>
      <button class="chatbot-quick-btn" onclick="window.location.hash='#checkout'" style="background:var(--primary);color:#000;">🛒 Checkout Now</button>
    `;
    body.appendChild(msg);
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
  }
}

window.AIChatbot = new AIChatbot();

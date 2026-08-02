/**
 * Foodies - Smart AI Chatbot
 * Advanced conversational system with natural responses
 */

class AIChatbot {
  constructor() {
    this.history = [];
    this.userName = null;
    this.count = 0;
  }

  async processMessage(rawInput) {
    const input = rawInput.toLowerCase().trim();
    this.count++;
    await new Promise(r => setTimeout(r, 500));
    const dishes = window.DISHES || [];
    const coupons = window.COUPONS || [];

    // ── NAME DETECTION ────────────────────────────
    const nameMatch = rawInput.match(/(?:i am|my name is|mera naam|i'm|call me)\s+([A-Za-z]+)/i);
    if (nameMatch) {
      this.userName = nameMatch[1];
      return { text: `Nice to meet you, <strong>${this.userName}</strong>! 😊 How can I help you today? What would you like to eat?`, dishes: [] };
    }

    // ── GREETING ─────────────────────────────────
    if (input.match(/^(hello|hi|hey|salam|assalam|helo|hii|good\s*(morning|evening|night)|aoa|bonjour|hola|namaste)/)) {
      const name = this.userName ? `, ${this.userName}` : '';
      return {
        text: `👋 Welcome to <strong>Foodies${name}!</strong> I'm your personal food concierge 🍴<br><br>
We have <strong>90+ dishes</strong> from 25 world cuisines — Pakistani, Indian, Arabic, Italian, Japanese, Korean, Mexican & more!<br><br>
What are you craving today?`,
        dishes: [],
        quickReplies: ['🍔 Burgers', '🍛 Desi Food', '🎁 Combo Deals', '🏷️ Discounts']
      };
    }

    // ── WHAT DOES RESTAURANT HAVE ─────────────────
    if (input.match(/kia.*deta|kya.*milta|kya.*hai|what.*have|what.*serve|what.*eat|what.*available|menu.*kya|kia.*available|ye restaurant/)) {
      const cats = (window.MENU_CATEGORIES || []).map(c => `${c.icon} ${c.name}`).join(' • ');
      return {
        text: `🍽️ <strong>Foodies</strong> serves world-class cuisine from 25 countries!<br><br>
<strong>Our Categories:</strong><br>${cats}<br><br>
We also have <strong>Combo Deals</strong> for families, couples & parties — save up to $75!<br><br>
What would you like to try?`,
        dishes: dishes.filter(d => d.bestSeller).slice(0, 3)
      };
    }

    // ── ORDER KARNA / HUNGRY ──────────────────────
    if (input.match(/hungry|bhook|order.*karna|order.*krna|kuch.*kha|khana.*chahiye|i want.*eat|i'm hungry|food.*chahiye|mujhe.*khana|kha.*na|order.*kaisa/)) {
      return {
        text: `😋 ${this.userName ? this.userName + ', you' : 'You'}'re at the right place!<br><br>
Here are our <strong>most loved dishes</strong> right now — click <strong>"🛒 Add"</strong> to add to cart:`,
        dishes: dishes.filter(d => d.bestSeller || d.recommended).slice(0, 4),
        showOrderHelp: true
      };
    }

    // ── ORDER KAISA HOGA / PROCESS ────────────────
    if (input.match(/order.*kaisa|kaisa.*order|how.*order|order.*kaise|process|kaise.*karta/)) {
      return {
        text: `📦 <strong>Ordering is super easy!</strong><br><br>
1️⃣ Browse menu & click <strong>"Add to Cart"</strong><br>
2️⃣ Open cart (🛒 top right)<br>
3️⃣ Apply coupon if you have one<br>
4️⃣ Click <strong>Checkout</strong><br>
5️⃣ Enter address & payment<br>
6️⃣ Done! Track your order live 🛵<br><br>
<strong>Delivery time: 30-40 mins</strong> ⏱️`,
        dishes: [],
        action: { href: '#menu', label: '🍽️ Browse Menu' }
      };
    }

    // ── SPECIAL / BEST ────────────────────────────
    if (input.match(/special|aaj.*kya|today.*special|best.*dish|signature|chef.*recommend|kya.*acha|what.*good|what.*best|recommend|suggest/)) {
      return {
        text: `⭐ <strong>Chef's Specials today</strong> — our most acclaimed dishes:`,
        dishes: dishes.filter(d => d.featured || d.recommended).slice(0, 4)
      };
    }

    // ── BUDGET ───────────────────────────────────
    if (input.match(/cheap|budget|sasta|kam.*paise|affordable|low.*price|under|(\d+).*mein|(\d+).*dollar|(\d+).*rs/)) {
      const match = input.match(/(\d+)/);
      const budget = match ? parseFloat(match[1]) : 20;
      const affordable = dishes.filter(d => (d.price * (1 - (d.discount||0) / 100)) <= Math.max(budget, 20)).slice(0, 4);
      return {
        text: `💰 <strong>Great value meals</strong>${budget ? ` under $${budget}` : ''}! Delicious food that won't break the bank:`,
        dishes: affordable.length ? affordable : dishes.sort((a,b) => a.price - b.price).slice(0, 4)
      };
    }

    // ── SPICY ─────────────────────────────────────
    if (input.match(/spicy|hot|teekha|mirch|fire|🌶|jhalak|tez/)) {
      return {
        text: `🌶️🔥 <strong>Spice lovers, this is for you!</strong><br><span style="font-size:.75rem;color:var(--text-muted);">Fair warning — these are seriously hot! 😅</span>`,
        dishes: dishes.filter(d => d.spicyLevel >= 2).slice(0, 4)
      };
    }

    // ── MILD / NOT SPICY ──────────────────────────
    if (input.match(/mild|not.*spicy|no.*spice|bina.*mirch|without.*spice|spicy.*nahi|light.*food/)) {
      return {
        text: `😌 <strong>Mild & non-spicy options</strong> — full flavor without the heat:`,
        dishes: dishes.filter(d => d.spicyLevel === 0).slice(0, 4)
      };
    }

    // ── VEGETARIAN ────────────────────────────────
    if (input.match(/vegetarian|vegan|veggie|sabzi|no.*meat|veg.*only|vegetable/)) {
      return {
        text: `🥗 <strong>Fresh vegetarian options</strong> — packed with flavor:`,
        dishes: dishes.filter(d => ['salad','healthy','pasta'].includes(d.category)).slice(0, 4)
      };
    }

    // ── BURGER ───────────────────────────────────
    if (input.match(/burger|burgers|patty|smash.*burger/)) {
      return {
        text: `🍔 <strong>Our signature burgers</strong> — juicy, loaded & unforgettable:`,
        dishes: dishes.filter(d => d.category === 'burger' || d.category === 'fastfood').slice(0, 4)
      };
    }

    // ── PIZZA ────────────────────────────────────
    if (input.match(/pizza|pasta|italian/)) {
      return {
        text: `🍕 <strong>Fresh from our wood-fired oven:</strong>`,
        dishes: dishes.filter(d => d.category === 'pizza' || d.category === 'pasta').slice(0, 4)
      };
    }

    // ── DESI ─────────────────────────────────────
    if (input.match(/desi|biryani|karahi|nihari|haleem|pulao|pakistan|lahori|naan|roti|daal|qorma/)) {
      return {
        text: `🍛 <strong>Desi ka maza</strong> — ghar jaisi taste, restaurant quality!`,
        dishes: dishes.filter(d => d.category === 'desi').slice(0, 4)
      };
    }

    // ── INDIAN ───────────────────────────────────
    if (input.match(/indian|butter.*chicken|paneer|tikka|masala|curry|samosa|dal.*makhani/)) {
      return {
        text: `🫕 <strong>Rich & aromatic Indian classics:</strong>`,
        dishes: dishes.filter(d => d.category === 'indian').slice(0, 4)
      };
    }

    // ── STEAK / BBQ ───────────────────────────────
    if (input.match(/steak|bbq|grill|wagyu|ribeye|ribs|barbeque|smoke/)) {
      return {
        text: `🥩 <strong>Premium cuts & smoky BBQ</strong> — cooked to perfection:`,
        dishes: dishes.filter(d => d.category === 'steak' || d.category === 'bbq').slice(0, 4)
      };
    }

    // ── SEAFOOD ──────────────────────────────────
    if (input.match(/seafood|fish|salmon|shrimp|lobster|prawn|crab/)) {
      return {
        text: `🦞 <strong>Fresh from the ocean</strong> — our finest seafood:`,
        dishes: dishes.filter(d => d.category === 'seafood').slice(0, 4)
      };
    }

    // ── ARABIC / TURKISH ─────────────────────────
    if (input.match(/arabic|shawarma|falafel|hummus|mansaf|kebab|turkish|pide|baklava/)) {
      return {
        text: `🧆 <strong>Authentic Middle Eastern flavors:</strong>`,
        dishes: dishes.filter(d => ['arabic','turkish'].includes(d.category)).slice(0, 4)
      };
    }

    // ── ASIAN ────────────────────────────────────
    if (input.match(/chinese|japanese|sushi|ramen|korean|bibimbap|thai|pad.*thai/)) {
      return {
        text: `🍜 <strong>Asian cuisine</strong> — flavors from the Far East:`,
        dishes: dishes.filter(d => ['chinese','japanese','korean','thai'].includes(d.category)).slice(0, 4)
      };
    }

    // ── MEXICAN ──────────────────────────────────
    if (input.match(/mexican|tacos|burrito|nachos|quesadilla/)) {
      return {
        text: `🌮 <strong>Mexican street food favorites:</strong>`,
        dishes: dishes.filter(d => d.category === 'mexican').slice(0, 4)
      };
    }

    // ── DESSERT ──────────────────────────────────
    if (input.match(/dessert|sweet|cake|chocolate|ice.*cream|tiramisu|cheesecake|lava|baklava|mithai/)) {
      return {
        text: `🍰 <strong>Life is sweeter with our desserts:</strong>`,
        dishes: dishes.filter(d => ['desserts','icecream'].includes(d.category)).slice(0, 4)
      };
    }

    // ── DRINKS ───────────────────────────────────
    if (input.match(/drink|juice|coffee|tea|chai|shake|lassi|smoothie|mojito|lemonade/)) {
      return {
        text: `🥤 <strong>Signature drinks & beverages:</strong>`,
        dishes: dishes.filter(d => ['drinks','coffee'].includes(d.category)).slice(0, 4)
      };
    }

    // ── HEALTHY ──────────────────────────────────
    if (input.match(/healthy|diet|fitness|low.*calorie|light|nutrition|protein/)) {
      return {
        text: `🥑 <strong>Healthy & nutritious options</strong> — good food, good mood:`,
        dishes: dishes.filter(d => d.category === 'healthy' || d.calories < 400).slice(0, 4)
      };
    }

    // ── COMBO DEALS ──────────────────────────────
    if (input.match(/combo|deal|bundle|family.*deal|couple.*deal|party|meal.*deal|save/)) {
      return {
        text: `🎁 <strong>Best Value Combo Deals!</strong><br><br>
👨‍👩‍👧‍👦 <strong>Family Feast</strong> — $99 <s style="color:var(--text-muted);">$134</s> • Save $35 • 4 persons<br>
💑 <strong>Couple Date Night</strong> — $105 <s style="color:var(--text-muted);">$138</s> • Save $33 • 2 persons<br>
👑 <strong>Big Daddy Deal</strong> — $139 <s style="color:var(--text-muted);">$192</s> • Save $53 • 5 persons<br>
🍛 <strong>Desi Dawat</strong> — $79 <s style="color:var(--text-muted);">$111</s> • Save $32 • 4 persons<br>
🎉 <strong>Party Platter</strong> — $219 <s style="color:var(--text-muted);">$294</s> • Save $75 • 8 persons<br>
🔥 <strong>BBQ Night Out</strong> — $79 <s style="color:var(--text-muted);">$109</s> • Save $30 • 3 persons`,
        dishes: [],
        action: { href: '#menu', label: '🎁 View All Combos', onclick: "app.setMenuCategory('combos')" }
      };
    }

    // ── COUPON / DISCOUNT ─────────────────────────
    if (input.match(/coupon|discount|promo|code|offer|free.*deliver|sale/)) {
      const list = coupons.length
        ? coupons.map(c => `🎁 <strong>${c.code}</strong> — ${c.description}`).join('<br>')
        : `🎁 <strong>FOODIES20</strong> — 20% off total<br>🎁 <strong>WELCOME50</strong> — 50% off first order<br>🎁 <strong>FLAT10</strong> — $10 off any order`;
      return { text: `${list}<br><br>📌 Apply in cart before checkout!`, dishes: [] };
    }

    // ── DELIVERY ─────────────────────────────────
    if (input.match(/deliver|delivery|time|kitna.*time|how.*long|shipping|charge/)) {
      return {
        text: `🚀 <strong>Delivery Details:</strong><br><br>
⏱️ Time: <strong>30-40 minutes</strong><br>
💵 Fee: <strong>$5</strong> (FREE on orders above $50!)<br><br>
📍 Delivery zones:<br>
• Downtown Core — $5<br>
• Westminster Heights — $8<br>
• Embassy District — $10<br>
• Royal Estates — $12`,
        dishes: []
      };
    }

    // ── HOURS ────────────────────────────────────
    if (input.match(/hour|open|close|timing|when|kab/)) {
      return {
        text: `🕐 <strong>Opening Hours:</strong><br><br>
Mon – Thu: 12:00 PM – 11:00 PM<br>
Fri – Sun: 12:00 PM – 11:30 PM<br>
VIP Lounge: 24/7 (Reservation only)<br><br>
📅 <strong>Book your table in advance for special occasions!</strong>`,
        dishes: [],
        action: { href: '#reservation', label: '📅 Book a Table' }
      };
    }

    // ── TABLE BOOKING ─────────────────────────────
    if (input.match(/book|table|reservation|reserve|seat|dine.*in|birthday|anniversary|occasion/)) {
      return {
        text: `📅 <strong>Book Your Perfect Table!</strong><br><br>
🏠 Indoor Salon<br>
🌿 Outdoor Terrace<br>
👑 VIP Table<br>
🚪 Private Room<br><br>
Special occasion? Birthday 🎂, Anniversary 💑, Business dinner 💼?<br>We'll make it unforgettable!`,
        dishes: [],
        action: { href: '#reservation', label: '📅 Reserve Now' }
      };
    }

    // ── CART ─────────────────────────────────────
    if (input.match(/cart|basket|my.*cart|mera.*cart/)) {
      const cart = window.app?.state?.cart || [];
      if (!cart.length) return { text: `🛒 Your cart is empty!<br><br>What would you like to order today? Ask me for recommendations!`, dishes: [] };
      const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
      return {
        text: `🛒 <strong>Your Cart (${cart.length} items):</strong><br><br>${cart.map(i => `• ${i.name} ×${i.qty} — $${(i.price*i.qty).toFixed(2)}`).join('<br>')}<br><br><strong>Total: $${total.toFixed(2)}</strong>`,
        showCheckoutBtn: true
      };
    }

    // ── PAYMENT ──────────────────────────────────
    if (input.match(/payment|pay|card|jazzcash|easypaisa|cash|how.*pay/)) {
      return {
        text: `💳 <strong>Payment Methods:</strong><br><br>
💳 Credit / Debit Card<br>
🅿️ PayPal<br>
📱 JazzCash<br>
📱 EasyPaisa<br>
💵 Cash on Delivery<br><br>
🔒 All transactions are <strong>100% secure</strong>`,
        dishes: []
      };
    }

    // ── TRACKING ─────────────────────────────────
    if (input.match(/track|order.*status|where.*order|mera.*order/)) {
      return {
        text: `📦 <strong>Track Your Order:</strong><br><br>
1️⃣ Go to <strong>Dashboard</strong> in menu<br>
2️⃣ Click <strong>Orders</strong> tab<br>
3️⃣ Click <strong>Track</strong> button<br><br>
Or enter your Order ID (FD-XXXXX) on the tracking page directly!`,
        action: { href: '#dashboard', label: '📦 Go to Dashboard' }
      };
    }

    // ── THANKS ───────────────────────────────────
    if (input.match(/thank|shukriya|thanks|jazakallah|great|awesome|perfect|brilliant/)) {
      return { text: `😊 You're most welcome${this.userName ? ', ' + this.userName : ''}! Enjoy your meal at <strong>Foodies</strong>! 🍽️<br><br>Is there anything else I can help with?`, dishes: [] };
    }

    // ── WHATSAPP ─────────────────────────────────
    if (input.match(/whatsapp|wa|contact|phone|call/)) {
      return {
        text: `📱 <strong>Contact Foodies:</strong><br><br>
📞 Phone: +1-800-FOODIES<br>
💬 WhatsApp: +1-800-FOODIES<br>
📧 Email: hello@foodies.com<br>
📍 42 Food Street, New York<br><br>
Or order directly through our website!`,
        dishes: []
      };
    }

    // ── SHOW MENU ────────────────────────────────
    if (input.match(/menu|show.*food|all.*dishes|categories|kya.*hai.*menu/)) {
      return {
        text: `🌍 <strong>Foodies World Menu</strong> — 90+ dishes from 25 cuisines!<br><br>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;">
          <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('burgers')">🍔 Burgers</button>
          <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('desi biryani')">🍛 Desi</button>
          <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('pizza')">🍕 Pizza</button>
          <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('steak bbq')">🥩 Steak</button>
          <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('sushi japanese')">🍣 Japanese</button>
          <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('tacos mexican')">🌮 Mexican</button>
          <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('seafood')">🦞 Seafood</button>
          <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('desserts')">🍰 Desserts</button>
          <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('drinks coffee')">🥤 Drinks</button>
          <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('healthy food')">🥑 Healthy</button>
        </div>`
      };
    }

    // ── DEFAULT ───────────────────────────────────
    const defaults = [
      `🤔 I didn't quite catch that, but I'm here to help!<br><br>Try asking me:<br>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;">
        <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('what is available to eat')">🍽️ What's Available?</button>
        <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('best dishes')">⭐ Best Dishes</button>
        <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('combo deals')">🎁 Combo Deals</button>
        <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('discount coupon')">🏷️ Discounts</button>
      </div>`,
      `😊 Let me help you find something delicious!<br><br>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;">
        <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('I am hungry suggest something')">🍴 I\'m Hungry</button>
        <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('spicy food')">🌶️ Spicy</button>
        <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('book a table')">📅 Book Table</button>
        <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('track my order')">📦 Track Order</button>
      </div>`
    ];
    return { text: defaults[this.count % 2], dishes: [] };
  }

  quickAsk(text) {
    const input = document.getElementById('chatbotInputMsg');
    if (input) { input.value = text; document.getElementById('chatbotSendBtn')?.click(); }
  }

  notifyCartAdded(dishName) {
    const body = document.getElementById('chatbotBody');
    if (!body) return;
    const msg = document.createElement('div');
    msg.className = 'chat-msg chat-msg-bot';
    msg.innerHTML = `✅ <strong>${dishName}</strong> added to cart!<br><br>Want to add more or ready to checkout?`;
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;';
    wrap.innerHTML = `
      <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('suggest something else')">🍽️ Add More</button>
      <button class="chatbot-quick-btn" onclick="window.location.hash='#checkout';app.toggleChatbot(false);" style="background:var(--primary);color:#000;border:none;">🛒 Checkout</button>`;
    body.appendChild(msg);
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
  }
}

window.AIChatbot = new AIChatbot();

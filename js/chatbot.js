/**
 * Foodies - AI Chatbot powered by Google Gemini
 * Real AI conversation with restaurant context
 */

class AIChatbot {
  constructor() {
    this.apiKey      = 'AIzaSyAQ.Ab8RN6JEUGFovuugWFZeTiz2RZgbnDJx0dqpxSVZpearEzaOqw';
    this.apiUrl      = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
    this.history     = []; // conversation history
    this.context     = null;
    this.orderStep   = null;
  }

  // Build restaurant context for Gemini
  _buildSystemPrompt() {
    const dishes     = (window.DISHES || []).slice(0, 30).map(d =>
      `${d.name} ($${(d.price*(1-(d.discount||0)/100)).toFixed(2)}) - ${d.category} - ${d.description?.slice(0,60)}`
    ).join('\n');

    const categories = (window.MENU_CATEGORIES || []).map(c => c.name).join(', ');
    const coupons    = (window.COUPONS || []).map(c => `${c.code}: ${c.description}`).join(', ');

    return `You are "Foodies AI Concierge", a friendly and helpful restaurant chatbot for Foodies Restaurant.

RESTAURANT INFO:
- Name: Foodies Restaurant
- Speciality: World cuisines — Pakistani, Indian, Arabic, Turkish, Chinese, Japanese, Korean, Mexican, Thai, Italian and more
- Opening: Mon-Thu 12PM-11PM, Fri-Sun 12PM-11:30PM
- Location: 42 Food Street, New York
- WhatsApp: +1-800-FOODIES
- Free delivery on orders above $50, otherwise $5

MENU CATEGORIES: ${categories}

SAMPLE DISHES:
${dishes}

ACTIVE COUPONS: ${coupons}

YOUR ROLE:
- Help customers find dishes they will love
- Answer questions about ingredients, allergens, calories, spice levels
- Suggest combos and deals
- Help with table reservations and order tracking
- Be warm, friendly and concise
- Keep responses short (2-4 lines max)
- Always suggest adding items to cart when recommending dishes
- Respond in the SAME language the customer uses (Urdu, English, Arabic, etc.)

IMPORTANT: If customer wants to order something, suggest specific dishes from our menu and tell them to click "Add to Cart".`;
  }

  async processMessage(userMessage) {
    try {
      // Build messages array with history
      const contents = [];

      // Add conversation history (last 6 messages for context)
      const recentHistory = this.history.slice(-6);
      recentHistory.forEach(msg => {
        contents.push({
          role: msg.role,
          parts: [{ text: msg.text }]
        });
      });

      // Add current message
      contents.push({
        role: 'user',
        parts: [{ text: userMessage }]
      });

      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: this._buildSystemPrompt() }]
          },
          contents,
          generationConfig: {
            temperature:     0.7,
            maxOutputTokens: 300,
            topP:            0.9
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data     = await response.json();
      const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that. Please try again!";

      // Save to history
      this.history.push({ role: 'user',  text: userMessage });
      this.history.push({ role: 'model', text: botReply });

      // Check if any dishes should be shown (keyword matching)
      const dishes = this._extractRelevantDishes(userMessage, botReply);

      return { text: botReply, dishes };

    } catch (err) {
      console.warn('Gemini API error:', err.message);
      // Fallback to keyword system
      return this._fallbackResponse(userMessage);
    }
  }

  // Extract relevant dishes to show as cards
  _extractRelevantDishes(userMsg, botReply) {
    const allDishes = window.DISHES || [];
    const combined  = (userMsg + ' ' + botReply).toLowerCase();

    // Find dishes mentioned in the conversation
    const mentioned = allDishes.filter(d =>
      combined.includes(d.name.toLowerCase()) ||
      combined.includes(d.id.toLowerCase().replace(/-/g, ' '))
    ).slice(0, 4);

    if (mentioned.length > 0) return mentioned;

    // Category keywords
    const catMap = {
      burger: 'burger', pizza: 'pizza', biryani: 'desi',
      karahi: 'desi', steak: 'steak', bbq: 'bbq',
      pasta: 'pasta', sushi: 'japanese', ramen: 'japanese',
      tacos: 'mexican', curry: 'indian', shawarma: 'arabic',
      dessert: 'desserts', cake: 'desserts', coffee: 'coffee',
      drink: 'drinks', juice: 'drinks', soup: 'soup',
      seafood: 'seafood', salmon: 'seafood', chicken: null
    };

    for (const [keyword, category] of Object.entries(catMap)) {
      if (combined.includes(keyword) && category) {
        return allDishes.filter(d => d.category === category).slice(0, 3);
      }
    }

    return [];
  }

  // Fallback if API fails
  _fallbackResponse(input) {
    const q = input.toLowerCase();
    if (q.includes('hello') || q.includes('hi') || q.includes('salam')) {
      return { text: "👋 Welcome to Foodies! I'm your AI assistant. Ask me anything about our menu, deals, or place an order!", dishes: [] };
    }
    if (q.includes('burger')) {
      return { text: "🍔 We have amazing burgers! Here are our top picks:", dishes: (window.DISHES||[]).filter(d=>d.category==='burger').slice(0,3) };
    }
    if (q.includes('deal') || q.includes('offer') || q.includes('discount')) {
      return { text: "🎁 Use code FOODIES20 for 20% off or WELCOME50 for 50% off your first order!", dishes: [] };
    }
    return { text: "I'm having a small hiccup! 😅 Please try again or browse our menu directly.", dishes: [] };
  }

  // Quick ask helper for buttons
  quickAsk(text) {
    const input = document.getElementById('chatbotInputMsg');
    if (input) {
      input.value = text;
      document.getElementById('chatbotSendBtn')?.click();
    }
  }

  // Notify when item added to cart via chatbot
  notifyCartAdded(dishName) {
    this.orderStep = 'cart_added';
    const body = document.getElementById('chatbotBody');
    if (!body) return;
    const msg  = document.createElement('div');
    msg.className = 'chat-msg chat-msg-bot';
    msg.innerHTML = `✅ <strong>${dishName}</strong> added to cart! Want to add more or checkout?`;
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;';
    wrap.innerHTML = `
      <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('show me more dishes')">🍽️ Add More</button>
      <button class="chatbot-quick-btn" onclick="window.location.hash='#checkout'" style="background:var(--primary);color:#000;">🛒 Checkout Now</button>`;
    body.appendChild(msg);
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
  }
}

window.AIChatbot = new AIChatbot();

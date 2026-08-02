/**
 * Foodies - AI Chatbot powered by Groq (LLaMA 3)
 * Free, fast, real AI conversation
 */

class AIChatbot {
  constructor() {
    this.apiKey  = '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';
    this.apiUrl  = 'https://api.groq.com/openai/v1/chat/completions';
    this.history = [];
  }

  _buildSystemPrompt() {
    const dishes     = (window.DISHES || []).slice(0, 25).map(d =>
      `- ${d.name}: $${(d.price*(1-(d.discount||0)/100)).toFixed(2)} | ${d.category} | Spicy:${d.spicyLevel}/3 | Cal:${d.calories}`
    ).join('\n');
    const coupons    = (window.COUPONS || []).map(c => `${c.code}: ${c.description}`).join(', ');
    const categories = (window.MENU_CATEGORIES || []).map(c => c.name).join(', ');

    return `You are "Foodies AI Concierge", a warm and helpful restaurant chatbot for Foodies Restaurant.

RESTAURANT INFO:
- 90+ dishes from 25 world cuisines
- Opening: Mon-Thu 12PM-11PM, Fri-Sun 12PM-11:30PM  
- Location: 42 Food Street, New York
- Free delivery on orders above $50, else $5
- WhatsApp: +1-800-FOODIES

MENU CATEGORIES: ${categories}

SAMPLE DISHES:
${dishes}

ACTIVE COUPONS: ${coupons}

COMBO DEALS:
- Family Feast: $99 (saves $35) - 4 persons
- Couple Date Night: $105 (saves $33) - 2 persons  
- Big Daddy Deal: $139 (saves $53) - 5 persons
- Desi Dawat: $79 (saves $32) - 4 persons
- Party Platter: $219 (saves $75) - 8 persons
- BBQ Night Out: $79 (saves $30) - 3 persons

YOUR RULES:
1. Keep responses SHORT — max 3-4 lines
2. Be warm, friendly and helpful
3. Always suggest specific dishes when recommending food
4. When customer wants to order, tell them to click "Add to Cart"
5. Respond in the SAME language as the customer (Urdu, Arabic, English etc.)
6. Use emojis to make responses lively
7. Never make up prices — use only prices given above`;
  }

  async processMessage(userMessage) {
    try {
      // Add to history
      this.history.push({ role: 'user', content: userMessage });

      // Keep only last 8 messages for context
      const recentHistory = this.history.slice(-8);

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model:       'llama3-8b-8192',
          messages:    [
            { role: 'system', content: this._buildSystemPrompt() },
            ...recentHistory
          ],
          temperature:      0.7,
          max_tokens:       250,
          top_p:            0.9,
          stream:           false
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err?.error?.message || `API error ${response.status}`);
      }

      const data     = await response.json();
      const botReply = data?.choices?.[0]?.message?.content || "Sorry, couldn't process that!";

      // Save bot reply to history
      this.history.push({ role: 'assistant', content: botReply });

      // Find relevant dish cards to show
      const dishes = this._extractDishes(userMessage, botReply);

      return { text: botReply, dishes };

    } catch (err) {
      console.warn('Groq API error:', err.message);
      return this._fallback(userMessage);
    }
  }

  _extractDishes(userMsg, botReply) {
    const allDishes = window.DISHES || [];
    const combined  = (userMsg + ' ' + botReply).toLowerCase();

    // Find dishes mentioned by name
    const byName = allDishes.filter(d =>
      combined.includes(d.name.toLowerCase().split(' ')[0]) ||
      combined.includes(d.id.replace(/-/g, ' '))
    ).slice(0, 4);
    if (byName.length > 0) return byName;

    // By category keywords
    const cats = {
      burger: 'burger', pizza: 'pizza', biryani: 'desi', karahi: 'desi',
      steak: 'steak', bbq: 'bbq', pasta: 'pasta', sushi: 'japanese',
      ramen: 'japanese', tacos: 'mexican', curry: 'indian',
      shawarma: 'arabic', dessert: 'desserts', coffee: 'coffee',
      drink: 'drinks', soup: 'soup', seafood: 'seafood',
      salmon: 'seafood', healthy: 'healthy', breakfast: 'breakfast',
      korean: 'korean', thai: 'thai', turkish: 'turkish', chinese: 'chinese'
    };
    for (const [kw, cat] of Object.entries(cats)) {
      if (combined.includes(kw)) {
        return allDishes.filter(d => d.category === cat).slice(0, 3);
      }
    }
    // If recommending food — show best sellers
    if (combined.match(/recommend|suggest|best|popular|try|order/)) {
      return allDishes.filter(d => d.bestSeller || d.recommended).slice(0, 3);
    }
    return [];
  }

  _fallback(input) {
    const q = input.toLowerCase();
    if (q.match(/burger/))  return { text: '🍔 Here are our best burgers!', dishes: (window.DISHES||[]).filter(d=>d.category==='burger').slice(0,3) };
    if (q.match(/biryani|desi/)) return { text: '🍛 Our desi favorites!', dishes: (window.DISHES||[]).filter(d=>d.category==='desi').slice(0,3) };
    if (q.match(/deal|combo/)) return { text: '🎁 Check our amazing combo deals!', dishes: [], action: { href: '#menu', label: 'View Combos' } };
    return { text: "😊 I'm here to help! Ask me about our menu, deals, or place an order.", dishes: [] };
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
    msg.innerHTML = `✅ <strong>${dishName}</strong> added to cart! Want more or ready to checkout?`;
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;';
    wrap.innerHTML = `
      <button class="chatbot-quick-btn" onclick="window.AIChatbot.quickAsk('suggest something else')">🍽️ Add More</button>
      <button class="chatbot-quick-btn" onclick="window.location.hash='#checkout';app.toggleChatbot(false);" style="background:var(--primary);color:#000;">🛒 Checkout</button>`;
    body.appendChild(msg);
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
  }
}

window.AIChatbot = new AIChatbot();

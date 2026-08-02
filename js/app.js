/**
 * Foodies - Core Application Engine (Firebase Edition)
 * ======================================================
 * All /api/ fetch calls replaced with Firebase SDK calls.
 * Auth: Firebase Authentication
 * Database: Firestore
 */

import {
  getDishes, getCategories, getChefs, getGallery, getReviews,
  getOffers, getCoupons, getDeliveryZones, validateCoupon,
  createOrder, getOrderById, getOrdersByUser,
  getAllOrders, updateOrderStatus, getAllReservations,
  createReservation, getReservationsByUser, updateReservationStatus,
  getUserProfile, updateUserProfile, toggleWishlist,
  getAllUsers, getAdminStats, advanceOrderStatus,
  getKitchenOrders, likeReview as fsLikeReview,
  seedFirestoreIfEmpty, submitContact
} from './firestore.js';

import {
  registerUser, loginUser, loginWithGoogle,
  logoutUser, onAuthChange, getCurrentUser, isAdmin, getMyProfile
} from './auth-firebase.js';

class FoodiesApp {
  constructor() {
    this.state = {
      cart:                  this._load('foodies_cart', []),
      wishlist:              [],
      orders:                [],
      reservations:          [],
      currentUser:           null,
      firebaseUser:          null,
      activeTheme:           this._load('foodies_theme', 'dark'),
      activeLanguage:        this._load('foodies_lang', 'EN'),
      currentCoupon:         null,
      activeCategory:        'all',
      searchQuery:           '',
      activeAdminTab:        'dashboard',
      activeDashboardTab:    'profile',
      galleryFilter:         'all',
      activeTrackingOrderId: null,
      authMode:              'login'
    };
    this._init();
  }

  _load(key, fallback) {
    try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : fallback; }
    catch(e) { return fallback; }
  }
  _save(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

  _init() {
    document.body.className = this.state.activeTheme === 'light' ? 'light-theme' : '';
    window.addEventListener('hashchange', () => this._route());
    window.addEventListener('scroll', () => {
      document.querySelector('.navbar')?.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  async onDOMReady() {
    // Listen for Firebase auth state changes
    onAuthChange(async (fbUser) => {
      this.state.firebaseUser = fbUser;
      if (fbUser) {
        const profile = await getUserProfile(fbUser.uid);
        this.state.currentUser = profile
          ? { ...profile, uid: fbUser.uid, email: fbUser.email }
          : { uid: fbUser.uid, name: fbUser.displayName || 'Diner', email: fbUser.email, role: 'Customer', vipStatus: 'Regular', points: 0, savedAddresses: [], wishlist: [] };
        this.state.wishlist = this.state.currentUser.wishlist || [];
        await this.loadUserHistory();
      } else {
        this.state.currentUser   = null;
        this.state.wishlist      = [];
        this.state.orders        = [];
        this.state.reservations  = [];
      }
      this._updateBadges();
      this._route();
    });

    await this.loadApiData();
    await seedFirestoreIfEmpty();
    this._updateBadges();
    this._initChatbot();

    const searchInput = document.getElementById('menuSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', e => {
        this.state.searchQuery = e.target.value;
        this._renderMenu();
      });
    }
  }

  /* ── LOAD DATA FROM FIRESTORE ─────────────────── */
  async loadApiData() {
    try {
      const [cats, dishes, chefs, gallery, reviews, offers, coupons, zones] = await Promise.all([
        getCategories(), getDishes(), getChefs(), getGallery(),
        getReviews(), getOffers(), getCoupons(), getDeliveryZones()
      ]);
      if (cats.length)    window.MENU_CATEGORIES = cats;
      if (dishes.length)  window.DISHES          = dishes;
      if (chefs.length)   window.CHEFS           = chefs;
      if (gallery.length) window.GALLERY_ITEMS   = gallery;
      if (reviews.length) window.REVIEWS         = reviews;
      if (offers.length)  window.OFFERS          = offers;
      if (coupons.length) window.COUPONS         = coupons;
      if (zones.length)   window.DELIVERY_ZONES  = zones;
    } catch (e) {
      console.warn('Firestore load failed, using data.js fallback:', e.message);
    }
  }

  async loadUserHistory() {
    if (!this.state.firebaseUser) return;
    try {
      const [orders, reservations] = await Promise.all([
        getOrdersByUser(this.state.firebaseUser.uid),
        getReservationsByUser(this.state.firebaseUser.uid)
      ]);
      this.state.orders       = orders;
      this.state.reservations = reservations;
    } catch (e) {
      console.warn('Failed to load user history:', e.message);
    }
  }

  /* ── SPA ROUTER ──────────────────────────────── */
  _route() {
    const hash   = window.location.hash || '#home';
    const route  = hash.split('?')[0];
    const params = new URLSearchParams(hash.split('?')[1] || '');

    this.toggleCartDrawer(false);
    this.toggleChatbot(false);

    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));

    const link = document.querySelector(`.nav-links a[href="${route}"]`);
    if (link) link.classList.add('active');

    const map = {
      '#home':        () => { this._show('home-page');        this._renderHome(); },
      '#menu':        () => { this._show('menu-page');        this._renderMenu(); },
      '#chefs':       () => { this._show('chefs-page');       this._renderChefs(); },
      '#gallery':     () => { this._show('gallery-page');     this._renderGallery(); },
      '#reservation': () => { this._show('reservation-page'); this._setupReservation(); },
      '#dashboard':   () => { this._show('dashboard-page');   this._renderDashboard(); },
      '#admin':       () => { this._show('admin-page');       this._renderAdmin(); },
      '#checkout':    () => { this._show('checkout-page');    this._renderCheckout(); },
      '#tracking':    () => { this._show('tracking-page');    this._renderTracking(params.get('orderId')); }
    };

    (map[route] || map['#home'])();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  _show(id) { document.getElementById(id)?.classList.add('active'); }

  /* ── THEME & LANGUAGE ────────────────────────── */
  toggleTheme() {
    this.state.activeTheme = this.state.activeTheme === 'dark' ? 'light' : 'dark';
    this._save('foodies_theme', this.state.activeTheme);
    document.body.className = this.state.activeTheme === 'light' ? 'light-theme' : '';
    const icon = document.querySelector('.navbar .nav-btn .fa-moon, .navbar .nav-btn .fa-sun');
    if (icon) icon.className = this.state.activeTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    this.showToast(`Switched to ${this.state.activeTheme} mode`, 'info');
  }

  toggleLanguage() {
    this.state.activeLanguage = this.state.activeLanguage === 'EN' ? 'UR' : 'EN';
    this._save('foodies_lang', this.state.activeLanguage);
    const btn = document.getElementById('langToggleBtn');
    if (btn) btn.innerText = this.state.activeLanguage;
    const t = {
      EN: { tagline:'Best Quality', title:'Delicious Food\nGood Mood', cta:'Order Now', book:'Book a Table' },
      UR: { tagline:'بہترین معیار', title:'لذیذ کھانا\nاچھا موڈ', cta:'ابھی آرڈر کریں', book:'ٹیبل بک کریں' }
    }[this.state.activeLanguage];
    const elems = {
      tag: document.querySelector('.hero-tagline'),
      title: document.querySelector('.hero-title'),
      cta: document.getElementById('heroCtaMenuBtn'),
      book: document.getElementById('heroCtaBookBtn')
    };
    if (elems.tag)   elems.tag.innerText   = t.tagline;
    if (elems.title) elems.title.innerText = t.title;
    if (elems.cta)   elems.cta.innerText   = t.cta;
    if (elems.book)  elems.book.innerText  = t.book;
    this.showToast(`Language: ${this.state.activeLanguage === 'EN' ? 'English' : 'اردو'}`, 'info');
  }

  /* ── TOAST ───────────────────────────────────── */
  showToast(message, type = 'info') {
    let box = document.getElementById('toast-box');
    if (!box) {
      box = document.createElement('div');
      box.id = 'toast-box';
      Object.assign(box.style, { position:'fixed', bottom:'28px', left:'28px', zIndex:'3000', display:'flex', flexDirection:'column', gap:'10px' });
      document.body.appendChild(box);
    }
    const colors = { success:'var(--success)', danger:'var(--danger)', warning:'var(--warning)', info:'var(--primary)' };
    const color  = colors[type] || colors.info;
    const toast  = document.createElement('div');
    toast.className = 'glass';
    Object.assign(toast.style, { padding:'12px 22px', borderRadius:'40px', fontSize:'.84rem', fontWeight:'500', borderLeft:`4px solid ${color}`, transition:'all .4s ease', boxShadow:'0 4px 16px rgba(0,0,0,.25)' });
    toast.innerHTML = `<span style="color:${color};margin-right:8px;">●</span>${message}`;
    box.appendChild(toast);
    setTimeout(() => { toast.style.opacity='0'; toast.style.transform='translateY(8px)'; setTimeout(() => toast.remove(), 400); }, 3200);
  }

  /* ── HOME PAGE ───────────────────────────────── */
  _renderHome() {
    const dishes = window.DISHES || [];

    // Popular dishes (recommended)
    const recGrid = document.getElementById('chefRecommendationsGrid');
    if (recGrid) recGrid.innerHTML = dishes.filter(d => d.recommended).slice(0, 3).map(d => window.UIEngine.renderDishCard(d)).join('');

    // Signature favorites (featured)
    const featGrid = document.getElementById('featuredDishesGrid');
    if (featGrid) featGrid.innerHTML = dishes.filter(d => d.featured).slice(0, 3).map(d => window.UIEngine.renderDishCard(d)).join('');

    // ── BEST SELLERS SECTION ──────────────────────
    const bsGrid = document.getElementById('bestSellersGrid');
    if (bsGrid) {
      const bestSellers = dishes.filter(d => d.bestSeller).slice(0, 6);
      bsGrid.innerHTML = bestSellers.length
        ? bestSellers.map((d, i) => window.UIEngine.renderBestSellerCard(d, i + 1)).join('')
        : '<div style="color:var(--text-muted);text-align:center;padding:30px;">No best sellers yet.</div>';
    }

    // ── DEALS & DISCOUNTS SECTION ─────────────────
    const dealsGrid = document.getElementById('dealsGrid');
    if (dealsGrid) {
      const deals = dishes.filter(d => d.discount > 0);
      dealsGrid.innerHTML = deals.length
        ? deals.map(d => window.UIEngine.renderDealCard(d)).join('')
        : '<div style="color:var(--text-muted);text-align:center;padding:30px;">No active deals right now.</div>';
    }

    // ── DEALS COUNTER (total savings banner) ─────
    const dealsBanner = document.getElementById('dealsSavingsBanner');
    if (dealsBanner) {
      const deals = dishes.filter(d => d.discount > 0);
      const maxDiscount = deals.length ? Math.max(...deals.map(d => d.discount)) : 0;
      dealsBanner.innerHTML = deals.length
        ? `🔥 <strong>${deals.length} items on sale</strong> — Up to <span style="color:var(--primary);font-size:1.3rem;font-weight:900;">${maxDiscount}% OFF</span> today only!`
        : '';
    }

    // Home gallery preview (first 6)
    const homeGallery = document.getElementById('homeGalleryPreview');
    if (homeGallery) {
      homeGallery.innerHTML = (window.GALLERY_ITEMS || []).slice(0, 6).map(item => `
        <div class="gallery-item glass">
          <img src="${item.src}" alt="${item.caption}" loading="lazy" onerror="this.src='assets/hero-bg.png'" />
          <div class="gallery-item-overlay"><p style="color:#fff;font-size:.82rem;font-weight:600;">${item.caption}</p></div>
        </div>`).join('');
    }

    // Reviews
    const reviewsGrid = document.getElementById('homeReviewsGrid');
    if (reviewsGrid) reviewsGrid.innerHTML = window.UIEngine.renderReviews(window.REVIEWS || []);
  }

  /* ── MENU PAGE ───────────────────────────────── */
  _renderMenu() {
    const catsEl  = document.getElementById('menuCategoriesSlider');
    const gridEl  = document.getElementById('menuDishesGrid');
    if (!gridEl) return;

    const allDishes = window.DISHES || [];

    // Category pills
    if (catsEl && window.MENU_CATEGORIES) {
      let html = `
        <div class="category-card glass ${this.state.activeCategory==='all'?'active':''}" onclick="app.setMenuCategory('all')"><span class="cat-icon">🍽️</span><span class="cat-name">All</span></div>
        <div class="category-card glass ${this.state.activeCategory==='bestsellers'?'active':''}" onclick="app.setMenuCategory('bestsellers')"><span class="cat-icon">🔥</span><span class="cat-name">Best Sellers</span></div>
        <div class="category-card glass ${this.state.activeCategory==='deals'?'active':''}" onclick="app.setMenuCategory('deals')"><span class="cat-icon">🏷️</span><span class="cat-name">On Sale</span></div>`;
      html += window.MENU_CATEGORIES.map(c => `
        <div class="category-card glass ${this.state.activeCategory===c.id?'active':''}" onclick="app.setMenuCategory('${c.id}')">
          <span class="cat-icon">${c.icon}</span><span class="cat-name">${c.name}</span>
        </div>`).join('');
      catsEl.innerHTML = html;
    }

    // Filter
    let dishes = allDishes;
    if      (this.state.activeCategory === 'bestsellers') dishes = allDishes.filter(d => d.bestSeller);
    else if (this.state.activeCategory === 'deals')       dishes = allDishes.filter(d => d.discount > 0);
    else if (this.state.activeCategory !== 'all')         dishes = allDishes.filter(d => d.category === this.state.activeCategory);

    if (this.state.searchQuery) {
      const q = this.state.searchQuery.toLowerCase();
      dishes = dishes.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        (d.ingredients||[]).some(i => i.toLowerCase().includes(q))
      );
    }

    // ── Best Sellers layout — home jaisa ──────────
    if (this.state.activeCategory === 'bestsellers') {
      gridEl.innerHTML = `
        <div class="menu-section-header" style="grid-column:1/-1;">
          <div class="deals-header-row">
            <div class="section-header" style="margin-bottom:0;text-align:left;">
              <span class="section-subtitle">Most Ordered</span>
              <h2 class="section-title">🔥 Best Sellers</h2>
              <span class="section-title-underline"></span>
            </div>
            <div class="deals-savings-banner glass">
              🔥 <strong>${dishes.length} best seller dishes</strong> — Most loved by our customers!
            </div>
          </div>
        </div>
        ${dishes.length
          ? dishes.map((d, i) => window.UIEngine.renderBestSellerCard(d, i + 1)).join('')
          : `<div style="grid-column:1/-1;text-align:center;padding:50px;color:var(--text-muted);">
               <i class="fas fa-fire" style="font-size:2rem;margin-bottom:12px;display:block;color:#f59e0b;"></i>
               No best sellers yet.
             </div>`
        }`;
      gridEl.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
      return;
    }

    // ── Deals layout — home jaisa ─────────────────
    if (this.state.activeCategory === 'deals') {
      const maxDiscount = dishes.length ? Math.max(...dishes.map(d => d.discount)) : 0;
      gridEl.innerHTML = `
        <div class="menu-section-header" style="grid-column:1/-1;">
          <div class="deals-header-row">
            <div class="section-header" style="margin-bottom:0;text-align:left;">
              <span class="section-subtitle">Limited Time</span>
              <h2 class="section-title">🏷️ Today's Deals</h2>
              <span class="section-title-underline"></span>
            </div>
            <div class="deals-savings-banner glass" id="dealsSavingsBanner">
              🔥 <strong>${dishes.length} items on sale</strong> — Up to
              <span style="color:var(--primary);font-size:1.2rem;font-weight:900;">${maxDiscount}% OFF</span> today only!
            </div>
          </div>
        </div>
        ${dishes.length
          ? dishes.map(d => window.UIEngine.renderDealCard(d)).join('')
          : `<div style="grid-column:1/-1;text-align:center;padding:50px;color:var(--text-muted);">
               <i class="fas fa-tag" style="font-size:2rem;margin-bottom:12px;display:block;color:#ef4444;"></i>
               No active deals right now. Check back soon!
             </div>`
        }`;
      gridEl.style.gridTemplateColumns = 'repeat(auto-fill, minmax(220px, 1fr))';
      return;
    }

    // ── Normal dish grid ──────────────────────────
    gridEl.style.gridTemplateColumns = '';
    gridEl.innerHTML = window.UIEngine.getMenuSkeletons(4);
    setTimeout(() => {
      gridEl.innerHTML = dishes.length
        ? dishes.map(d => window.UIEngine.renderDishCard(d)).join('')
        : `<div style="grid-column:1/-1;text-align:center;padding:50px;color:var(--text-muted);">
             <i class="fas fa-search" style="font-size:2rem;margin-bottom:12px;display:block;"></i>
             No dishes match your search.
           </div>`;
    }, 380);
  }

  setMenuCategory(id) { this.state.activeCategory = id; this._renderMenu(); }

  /* ── CHEFS & GALLERY ─────────────────────────── */
  _renderChefs() {
    const grid = document.getElementById('chefsGrid');
    if (grid) grid.innerHTML = window.UIEngine.renderChefs(window.CHEFS || []);
  }

  _renderGallery(filter) {
    filter = filter || this.state.galleryFilter || 'all';
    this.state.galleryFilter = filter;
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;
    const items = (window.GALLERY_ITEMS || []).filter(item => filter === 'all' || item.type === filter);
    grid.innerHTML = items.length
      ? items.map(item => `
          <div class="gallery-item glass">
            <img src="${item.src}" alt="${item.caption}" loading="lazy" onerror="this.src='assets/hero-bg.png'" />
            <div class="gallery-item-overlay"><p style="color:#fff;font-size:.82rem;font-weight:600;margin:0;"><i class="fas fa-camera" style="color:var(--primary);margin-right:6px;"></i>${item.caption}</p></div>
          </div>`).join('')
      : `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted);">No items in this category.</div>`;
  }

  setGalleryFilter(filter) {
    document.querySelectorAll('.gallery-filter-buttons button').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    this._renderGallery(filter);
  }

  /* ── WISHLIST ─────────────────────────────────── */
  async toggleWishlist(dishId) {
    if (!this.state.firebaseUser) {
      this.showToast('Please login to manage your wishlist!', 'warning');
      window.location.hash = '#dashboard';
      return;
    }
    try {
      const newWishlist = await toggleWishlist(this.state.firebaseUser.uid, dishId);
      this.state.wishlist = newWishlist;
      const msg = newWishlist.includes(dishId) ? 'Added to wishlist' : 'Removed from wishlist';
      this.showToast(msg, 'success');
      this._updateBadges();
      if (window.location.hash === '#menu') this._renderMenu();
      if (window.location.hash === '#dashboard') this._renderDashboard();
    } catch (e) {
      this.showToast('Failed to update wishlist', 'danger');
    }
  }

  /* ── CART ─────────────────────────────────────── */
  addToCart(dishId, qty = 1) {
    const dish = (window.DISHES || []).find(d => d.id === dishId);
    if (!dish) return;
    const existing = this.state.cart.find(i => i.id === dishId);
    if (existing) { existing.qty += qty; }
    else { this.state.cart.push({ id: dish.id, name: dish.name, price: dish.price * (1 - dish.discount / 100), image: dish.image, qty }); }
    this._save('foodies_cart', this.state.cart);
    this._updateBadges();
    this._renderCartDrawer();
    this.toggleCartDrawer(true);
    this.showToast(`${dish.name} added to cart!`, 'success');
  }

  updateCartQty(dishId, delta) {
    const item = this.state.cart.find(i => i.id === dishId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) this.state.cart = this.state.cart.filter(i => i.id !== dishId);
    this._save('foodies_cart', this.state.cart);
    this._updateBadges();
    this._renderCartDrawer();
  }

  removeFromCart(dishId) {
    this.state.cart = this.state.cart.filter(i => i.id !== dishId);
    this._save('foodies_cart', this.state.cart);
    this._updateBadges();
    this._renderCartDrawer();
    this.showToast('Item removed', 'info');
  }

  _updateBadges() {
    const cartCount = this.state.cart.reduce((t, i) => t + i.qty, 0);
    document.querySelectorAll('.cart-badge').forEach(b => { b.innerText = cartCount; b.style.display = cartCount > 0 ? 'flex' : 'none'; });
    const wlCount = this.state.wishlist.length;
    document.querySelectorAll('.wishlist-badge').forEach(b => { b.innerText = wlCount; b.style.display = wlCount > 0 ? 'flex' : 'none'; });
    const adminLink = document.getElementById('adminNavLink');
    if (adminLink) adminLink.style.display = 'block';
  }

  toggleCartDrawer(open) { document.getElementById('cartDrawer')?.classList.toggle('active', open); }

  _renderCartDrawer() {
    const box = document.getElementById('cartItemsContainer');
    if (!box) return;
    if (!this.state.cart.length) {
      box.innerHTML = `<div style="text-align:center;padding:50px 20px;color:var(--text-muted);"><i class="fas fa-shopping-cart" style="font-size:2.5rem;margin-bottom:14px;display:block;opacity:.4;"></i>Your cart is empty</div>`;
      document.getElementById('cartSubtotalValue').innerText = '$0.00';
      document.getElementById('cartTotalValue').innerText   = '$0.00';
      return;
    }
    box.innerHTML = this.state.cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" onerror="this.src='assets/hero-bg.png'" />
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <div class="cart-item-meta">
            <span class="cart-item-price">$${item.price.toFixed(2)}</span>
            <div class="qty-selector" style="transform:scale(.85);transform-origin:left;">
              <span class="qty-btn" onclick="app.updateCartQty('${item.id}',-1)">−</span>
              <span class="qty-val">${item.qty}</span>
              <span class="qty-btn" onclick="app.updateCartQty('${item.id}',1)">+</span>
            </div>
            <i class="fas fa-trash btn-remove-item" onclick="app.removeFromCart('${item.id}')"></i>
          </div>
        </div>
      </div>`).join('');
    const subtotal = this.state.cart.reduce((s, i) => s + i.price * i.qty, 0);
    let discount = 0;
    if (this.state.currentCoupon) {
      discount = this.state.currentCoupon.type === 'percentage' ? subtotal * this.state.currentCoupon.value / 100 : this.state.currentCoupon.value;
    }
    const delivery = subtotal > 50 ? 0 : 5.00;
    const tax = (subtotal - discount) * 0.08;
    document.getElementById('cartSubtotalValue').innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById('cartTotalValue').innerText    = `$${Math.max(0, subtotal - discount + delivery + tax + 2).toFixed(2)}`;
  }

  async applyCoupon() {
    const code = document.getElementById('cartCouponInput').value.trim().toUpperCase();
    if (!code) return;
    try {
      const coupon = await validateCoupon(code);
      if (coupon) {
        this.state.currentCoupon = coupon;
        this._renderCartDrawer();
        this.showToast(`Coupon "${code}" applied! ${coupon.description}`, 'success');
      } else {
        this.showToast('Invalid coupon code', 'danger');
      }
    } catch (e) {
      this.showToast('Failed to validate coupon', 'danger');
    }
  }

  /* ── DISH DETAIL MODAL ───────────────────────── */
  showDishDetail(dishId) {
    const dish  = (window.DISHES || []).find(d => d.id === dishId);
    const modal = document.getElementById('dishDetailModal');
    if (!dish || !modal) return;
    const finalPrice = dish.price * (1 - dish.discount / 100);
    const origHtml   = dish.discount > 0 ? `<span class="price-original" style="margin-left:8px;">$${dish.price.toFixed(2)}</span>` : '';
    modal.querySelector('.dish-main-image img').src              = dish.image;
    modal.querySelector('.dish-details-content h2').innerText    = dish.name;
    modal.querySelector('.dish-details-content .desc').innerText = dish.description;
    modal.querySelector('.price-value').innerHTML                = `$${finalPrice.toFixed(2)}${origHtml}`;
    modal.querySelector('#modalSpecCalories').innerText          = dish.calories;
    modal.querySelector('#modalSpecSpicy').innerText             = '🌶'.repeat(dish.spicyLevel) || 'Mild';
    modal.querySelector('#modalSpecTime').innerText              = dish.cookingTime;
    modal.querySelector('.ingredients-list').innerHTML           = (dish.ingredients||[]).map(i => `<span class="ingredient-tag glass">${i}</span>`).join('');
    modal.querySelector('.nutrition-grid').innerHTML             = `
      <div class="nutri-box glass"><strong>Carbs</strong><br>${dish.nutrition?.carbs||'0g'}</div>
      <div class="nutri-box glass"><strong>Protein</strong><br>${dish.nutrition?.protein||'0g'}</div>
      <div class="nutri-box glass"><strong>Fat</strong><br>${dish.nutrition?.fat||'0g'}</div>`;
    const ratingRow = modal.querySelector('.rating-row');
    if (ratingRow) ratingRow.innerHTML = `<div style="color:var(--warning);">${window.UIEngine._stars(dish.rating)} ${dish.rating.toFixed(1)}</div><span style="font-size:.78rem;color:var(--text-muted);">(${dish.reviewsCount} reviews)</span>`;
    modal.querySelector('#modalAddToCartBtn').onclick = () => {
      const qty = parseInt(modal.querySelector('.qty-val').innerText) || 1;
      this.addToCart(dish.id, qty);
      this.closeDishDetail();
    };
    modal.querySelector('.qty-val').innerText = '1';
    modal.classList.add('active');
  }

  closeDishDetail() { document.getElementById('dishDetailModal')?.classList.remove('active'); }

  adjustModalQty(delta) {
    const el = document.querySelector('#dishDetailModal .qty-val');
    if (!el) return;
    el.innerText = Math.max(1, (parseInt(el.innerText) || 1) + delta);
  }

  /* ── RESERVATION ─────────────────────────────── */
  _setupReservation() {
    const form = document.getElementById('reservationForm');
    if (!form || form._bound) return;
    form._bound = true;
    form.onsubmit = async e => {
      e.preventDefault();
      const payload = {
        name:           document.getElementById('resName').value,
        email:          this.state.currentUser?.email || 'guest@foodies.com',
        phone:          document.getElementById('resPhone')?.value || '0300-0000000',
        date:           document.getElementById('resDate').value,
        time:           document.getElementById('resTime').value,
        guests:         document.getElementById('resGuests').value,
        type:           document.getElementById('resTableType').value,
        specialRequest: document.getElementById('resRequest').value
      };
      try {
        const reservation = await createReservation(payload, this.state.firebaseUser);
        this.showToast('Table booked successfully! We look forward to hosting you.', 'success');
        form.reset();
        if (this.state.firebaseUser) {
          await this.loadUserHistory();
          window.location.hash = '#dashboard';
          this.setDashboardTab('reservations');
        } else {
          window.location.hash = '#home';
        }
      } catch (err) {
        this.showToast('Booking failed: ' + err.message, 'danger');
      }
    };
  }

  /* ── CHECKOUT ────────────────────────────────── */
  _renderCheckout() {
    if (!this.state.cart.length) {
      window.location.hash = '#menu';
      this.showToast('Add items to cart before checking out', 'warning');
      return;
    }
    const nameInput = document.getElementById('chkName');
    const addrInput = document.getElementById('chkAddress');
    if (nameInput && !nameInput.value && this.state.currentUser?.name) nameInput.value = this.state.currentUser.name;
    if (addrInput && !addrInput.value && this.state.currentUser?.savedAddresses?.[0]) addrInput.value = this.state.currentUser.savedAddresses[0];

    const sumBox = document.getElementById('checkoutSummaryContainer');
    if (sumBox) {
      const subtotal = this.state.cart.reduce((s, i) => s + i.price * i.qty, 0);
      let discount = 0;
      if (this.state.currentCoupon) discount = this.state.currentCoupon.type === 'percentage' ? subtotal * this.state.currentCoupon.value / 100 : this.state.currentCoupon.value;
      const delivery = subtotal > 50 ? 0 : 5.00;
      const tax      = (subtotal - discount) * 0.08;
      const total    = subtotal - discount + delivery + tax + 2;
      sumBox.innerHTML = `
        <div style="margin-bottom:14px;border-bottom:1px dashed var(--glass-border);padding-bottom:12px;">
          ${this.state.cart.map(i => `<div style="display:flex;justify-content:space-between;margin-bottom:9px;font-size:.84rem;"><span>${i.name} <strong>×${i.qty}</strong></span><span>$${(i.price*i.qty).toFixed(2)}</span></div>`).join('')}
        </div>
        <div class="cart-summary-row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
        <div class="cart-summary-row" style="color:var(--success);"><span>Discount</span><span>-$${discount.toFixed(2)}</span></div>
        <div class="cart-summary-row"><span>Delivery</span><span>$${delivery.toFixed(2)}</span></div>
        <div class="cart-summary-row"><span>Packaging</span><span>$2.00</span></div>
        <div class="cart-summary-row"><span>Tax (8%)</span><span>$${tax.toFixed(2)}</span></div>
        <div class="cart-summary-total">Total: $${total.toFixed(2)}</div>`;
    }

    document.querySelectorAll('.payment-option').forEach(opt => {
      opt.onclick = () => {
        document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        const cardDetails = document.getElementById('cardDetailsContainer');
        if (cardDetails) cardDetails.style.display = opt.getAttribute('data-pay') === 'card' ? 'grid' : 'none';
      };
    });

    const form = document.getElementById('checkoutForm');
    if (form && !form._bound) {
      form._bound = true;
      form.onsubmit = async e => {
        e.preventDefault();
        const activePayOption = document.querySelector('.payment-option.active');
        const paymentMethod   = activePayOption ? activePayOption.getAttribute('data-pay') : 'cash';
        const payload = {
          items:               this.state.cart.map(item => ({ dishId: item.id, qty: item.qty })),
          couponCode:          this.state.currentCoupon?.code || null,
          address:             document.getElementById('chkAddress').value,
          paymentMethod,
          specialInstructions: ''
        };
        try {
          const order = await createOrder(payload, this.state.firebaseUser);
          this.state.cart = [];
          this._save('foodies_cart', this.state.cart);
          this.state.currentCoupon = null;
          this._updateBadges();
          this.showToast(`Order placed! Tracking ID: ${order.id}`, 'success');
          if (this.state.firebaseUser) await this.loadUserHistory();
          else this.state.orders.push(order);
          window.location.hash = `#tracking?orderId=${order.id}`;
        } catch (err) {
          this.showToast('Checkout error: ' + err.message, 'danger');
        }
      };
    }
  }

  /* ── ORDER TRACKING ──────────────────────────── */
  async _renderTracking(orderId) {
    this.state.activeTrackingOrderId = orderId;
    const box = document.getElementById('trackingPageContainer');
    if (!box) return;

    let order = this.state.orders.find(o => o.id === orderId);
    if (!order) {
      try { order = await getOrderById(orderId); } catch (e) {}
    }

    if (!order) {
      box.innerHTML = `<div style="text-align:center;padding:60px;color:var(--text-muted);">Order not found.</div>`;
      return;
    }

    const statuses    = ['Pending','Preparing','Cooking','Packed','Out For Delivery','Delivered'];
    const activeIndex = statuses.indexOf(order.status);
    const progressPct = (activeIndex / (statuses.length - 1)) * 94;
    const steps = statuses.map((s, i) => `
      <div class="tracking-step ${i===activeIndex?'active':i<activeIndex?'completed':''}">
        <i class="fas fa-check" style="font-size:.55rem;color:#fff;"></i>
        <div class="tracking-step-label">${s}</div>
      </div>`).join('');
    const riderPos = [{ top:'80px', left:'10%' },{ top:'70px', left:'28%' },{ top:'90px', left:'45%' },{ top:'60px', left:'60%' },{ top:'40px', left:'76%' },{ top:'30px', left:'88%' }][Math.max(0, Math.min(activeIndex, 5))];

    box.innerHTML = `
      <div class="tracking-container glass">
        <div class="tracking-header">
          <h2><i class="fas fa-motorcycle" style="color:var(--primary);margin-right:10px;"></i>Live Order Tracking</h2>
          <p>Order ID: <span>${order.id}</span></p>
        </div>
        <div class="tracking-timeline">
          <div class="tracking-timeline-bar" style="width:${progressPct}%;"></div>
          ${steps}
        </div>
        <h3 style="margin-bottom:14px;color:var(--primary);text-align:left;"><i class="fas fa-map-marker-alt"></i> Rider Location</h3>
        <div class="rider-map-mock">
          <div class="map-rider-icon" style="top:${riderPos.top};left:${riderPos.left};">🛵</div>
          <div style="position:absolute;bottom:12px;right:14px;font-size:.73rem;color:var(--text-muted);">→ ${order.address}</div>
        </div>
        <div style="text-align:left;border-top:1px solid var(--glass-border);padding-top:18px;">
          <h4 style="margin-bottom:12px;font-weight:700;">Order Summary</h4>
          ${order.items.map(i => `<div style="display:flex;justify-content:space-between;font-size:.84rem;margin-bottom:7px;"><span>${i.name} ×${i.qty}</span><span>$${(i.price*i.qty).toFixed(2)}</span></div>`).join('')}
          <div style="display:flex;justify-content:space-between;font-weight:800;color:var(--primary);font-size:1.1rem;border-top:1px dashed var(--glass-border);padding-top:10px;margin-top:10px;">
            <span>Total Paid</span><span>$${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>`;
  }

  /* ── DASHBOARD ───────────────────────────────── */
  _renderDashboard() {
    document.querySelectorAll('.dashboard-content-panel').forEach(p => p.classList.remove('active'));
    document.getElementById(`dbPanel-${this.state.activeDashboardTab}`)?.classList.add('active');
    document.querySelectorAll('.dashboard-menu-item').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('onclick')?.includes(this.state.activeDashboardTab));
    });

    const tab      = this.state.activeDashboardTab;
    const loggedIn = !!this.state.firebaseUser;

    if (tab === 'profile') {
      const panel = document.getElementById('dbPanel-profile');
      if (!panel) return;
      if (!loggedIn) {
        panel.innerHTML = `
          <div class="glass" style="padding:36px;border-radius:var(--border-radius-lg);max-width:450px;margin:0 auto;">
            <h2 style="font-family:var(--font-body);font-weight:800;margin-bottom:20px;text-align:center;">
              ${this.state.authMode === 'login' ? 'Login to Foodies' : 'Register Account'}
            </h2>
            <form id="authForm" onsubmit="app.handleAuthSubmit(event)">
              ${this.state.authMode === 'register' ? `<div class="form-group-full" style="margin-bottom:14px;"><input type="text" id="authName" class="form-input" placeholder="Your Full Name" required /></div>` : ''}
              <div class="form-group-full" style="margin-bottom:14px;"><input type="email" id="authEmail" class="form-input" placeholder="Email Address" required /></div>
              <div class="form-group-full" style="margin-bottom:18px;"><input type="password" id="authPassword" class="form-input" placeholder="Password" required /></div>
              <button type="submit" class="btn-gold" style="width:100%;justify-content:center;margin-bottom:16px;">
                ${this.state.authMode === 'login' ? 'Login' : 'Sign Up'} <i class="fas fa-sign-in-alt"></i>
              </button>
              <button type="button" class="btn-outline" onclick="app.handleGoogleLogin()"
                      style="width:100%;justify-content:center;margin-bottom:16px;border-color:#4285F4;color:#4285F4;background:transparent;">
                <i class="fab fa-google"></i> Sign in with Google
              </button>
            </form>
            <p style="font-size:.84rem;text-align:center;color:var(--text-muted);margin:0;">
              ${this.state.authMode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              <a href="javascript:void(0)" onclick="app.toggleAuthMode()" style="color:var(--primary);font-weight:700;">
                ${this.state.authMode === 'login' ? 'Register here' : 'Login here'}
              </a>
            </p>
          </div>`;
      } else {
        const u = this.state.currentUser;
        panel.innerHTML = `
          <div class="glass" style="padding:36px;border-radius:var(--border-radius-lg);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:10px;">
              <h2 style="font-family:var(--font-body);font-weight:800;margin:0;">Account Overview</h2>
              <button class="btn-outline" onclick="app.logout()" style="padding:6px 14px;font-size:.78rem;border-color:var(--danger);color:var(--danger);background:transparent;">
                <i class="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
            <div class="dashboard-metrics-grid" style="margin-bottom:24px;">
              <div class="dashboard-metric-card glass"><p style="font-size:.78rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:5px;">Reward Points</p><span>${u?.points||0}</span></div>
              <div class="dashboard-metric-card glass"><p style="font-size:.78rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:5px;">Membership</p><span style="color:var(--primary);font-size:1.3rem;">${u?.vipStatus||'Regular'}</span></div>
            </div>
            <p><strong>Name:</strong> ${u?.name}</p>
            <p><strong>Email:</strong> ${u?.email}</p>
            <p><strong>Role:</strong> <span class="status-badge status-ready">${u?.role||'Customer'}</span></p>
            <p><strong>Saved Addresses:</strong> ${u?.savedAddresses?.join(', ') || 'None saved'}</p>
          </div>`;
        const avatarEl = document.getElementById('dbUserAvatarLetter');
        const nameEl   = document.getElementById('dbProfName');
        const emailEl  = document.getElementById('dbProfEmail');
        if (avatarEl) avatarEl.innerText = (u?.name||'D').charAt(0).toUpperCase();
        if (nameEl)   nameEl.innerText   = u?.name || '';
        if (emailEl)  emailEl.innerText  = u?.email || '';
      }
    }

    if (tab === 'orders') {
      const c = document.getElementById('dbOrdersContainer');
      if (c) c.innerHTML = loggedIn && this.state.orders.length
        ? this.state.orders.map(o => `
            <div class="db-order-card glass">
              <div><h4 style="color:var(--primary);">${o.id}</h4><span style="font-size:.78rem;color:var(--text-muted);">${o.createdAt?.toDate?.()?.toLocaleDateString?.() || ''}</span></div>
              <div style="text-align:right;">
                <div style="font-weight:800;margin-bottom:5px;">$${o.total?.toFixed(2)}</div>
                <span class="status-badge">${o.status}</span>
                ${o.status!=='Delivered'?`<br><a href="#tracking?orderId=${o.id}" class="btn-outline" style="padding:4px 8px;font-size:.7rem;margin-top:6px;display:inline-block;background:transparent;"><i class="fas fa-map-marker-alt"></i> Track</a>`:''}
              </div>
            </div>`).join('')
        : `<div style="color:var(--text-muted);text-align:center;padding:24px;">${loggedIn ? 'No past orders yet.' : 'Please login to view orders.'}</div>`;
    }

    if (tab === 'reservations') {
      const c = document.getElementById('dbReservationsContainer');
      if (c) c.innerHTML = loggedIn && this.state.reservations.length
        ? this.state.reservations.map(r => `
            <div class="db-res-card glass">
              <div><h4>${r.id} — ${r.type} Table</h4><span style="font-size:.78rem;color:var(--text-muted);">${r.date} at ${r.time}</span></div>
              <span class="status-badge status-ready">${r.status || 'Confirmed'}</span>
            </div>`).join('')
        : `<div style="color:var(--text-muted);text-align:center;padding:24px;">${loggedIn ? 'No reservations yet.' : 'Please login to view reservations.'}</div>`;
    }

    if (tab === 'wishlist') {
      const c = document.getElementById('dbWishlistContainer');
      const wlDishes = (window.DISHES || []).filter(d => this.state.wishlist.includes(d.id));
      if (c) c.innerHTML = loggedIn && wlDishes.length
        ? `<div class="dishes-grid">${wlDishes.map(d => window.UIEngine.renderDishCard(d)).join('')}</div>`
        : `<div style="color:var(--text-muted);text-align:center;padding:24px;">${loggedIn ? 'Your wishlist is empty.' : 'Please login to manage wishlist.'}</div>`;
    }
  }

  setDashboardTab(name) { this.state.activeDashboardTab = name; this._renderDashboard(); }
  toggleAuthMode()     { this.state.authMode = this.state.authMode === 'login' ? 'register' : 'login'; this._renderDashboard(); }

  /* ── AUTH HANDLERS ───────────────────────────── */
  async handleAuthSubmit(e) {
    e.preventDefault();
    const email    = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;
    try {
      if (this.state.authMode === 'register') {
        const name = document.getElementById('authName').value;
        await registerUser(name, email, password);
        this.showToast(`Welcome to Foodies, ${name}!`, 'success');
      } else {
        await loginUser(email, password);
        this.showToast('Welcome back!', 'success');
      }
      // onAuthChange listener will update state automatically
    } catch (err) {
      const msg = err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password'
        ? 'Invalid email or password'
        : err.code === 'auth/email-already-in-use'
        ? 'Email already registered'
        : err.message;
      this.showToast(msg, 'danger');
    }
  }

  async handleGoogleLogin() {
    try {
      await loginWithGoogle();
      this.showToast('Signed in with Google!', 'success');
    } catch (err) {
      this.showToast('Google sign-in failed: ' + err.message, 'danger');
    }
  }

  async logout() {
    try {
      await logoutUser();
      this.state.cart          = [];
      this.state.currentCoupon = null;
      this._save('foodies_cart', []);
      this._updateBadges();
      this.showToast('Logged out successfully', 'info');
      window.location.hash = '#home';
    } catch (e) {
      this.showToast('Logout failed', 'danger');
    }
  }

  /* ── ADMIN PANEL ─────────────────────────────── */
  async _renderAdmin(skipAuthCheck = false) {
    document.querySelectorAll('.admin-panel-content').forEach(p => p.classList.remove('active'));
    document.getElementById(`adminPanel-${this.state.activeAdminTab}`)?.classList.add('active');
    document.querySelectorAll('.admin-sidebar .admin-menu-item').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('onclick')?.includes(this.state.activeAdminTab));
    });

    // skipAuthCheck = true means admin.js already verified — no need to re-check
    let adminOk = skipAuthCheck;
    if (!adminOk) {
      adminOk = this.state.firebaseUser && await isAdmin(this.state.firebaseUser.uid);
    }

    if (!adminOk) {
      document.getElementById('adminPanelLayout').style.display = 'none';
      document.getElementById('adminLoginCard').style.display   = 'block';
      return;
    }

    document.getElementById('adminLoginCard').style.display   = 'none';
    document.getElementById('adminPanelLayout').style.display = 'flex';

    const tab = this.state.activeAdminTab;

    try {
      if (tab === 'dashboard') {
        const stats = await getAdminStats();
        const set   = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
        set('adminStatRevenue',   `$${stats.totalRevenue.toFixed(2)}`);
        set('adminStatOrders',    stats.totalOrders);
        set('adminStatMenuItems', stats.totalMenuItems);
        if (window.AdminController) {
          const rcBox = document.getElementById('revenueChartBox');
          const vcBox = document.getElementById('visitorsChartBox');
          if (rcBox) rcBox.innerHTML = window.AdminController.renderRevenueChart();
          if (vcBox) vcBox.innerHTML = window.AdminController.renderVisitorsChart();
        }
      }

      if (tab === 'orders') {
        const orders = await getAllOrders();
        const body   = document.getElementById('adminOrdersTableBody');
        if (body) body.innerHTML = window.UIEngine.renderAdminOrdersTable(orders);
      }

      if (tab === 'menu') {
        await window.AdminController?.renderMenuTable();
      }

      if (tab === 'users') {
        await window.AdminController?.renderUsersTable();
      }

      if (tab === 'reservations') {
        const reservations = await getAllReservations();
        const body         = document.getElementById('adminReservationsTableBody');
        if (body) body.innerHTML = window.UIEngine.renderAdminReservationsTable(reservations);
      }

      if (tab === 'kitchen') {
        const orders = await getKitchenOrders();
        const grid   = document.getElementById('kitchenQueueGrid');
        if (grid) {
          grid.innerHTML = orders.length
            ? orders.map(o => `
                <div class="kitchen-ticket glass">
                  <div class="kitchen-ticket-header">
                    <h4 style="color:var(--primary);">${o.id}</h4>
                    <span class="status-badge">${o.status}</span>
                  </div>
                  <div class="kitchen-ticket-items">
                    ${o.items.map(i => `<div><strong>${i.qty}×</strong> ${i.name}</div>`).join('')}
                  </div>
                  <button class="btn-outline" style="padding:6px 14px;font-size:.75rem;background:transparent;"
                          onclick="app.advanceKitchenStatus('${o.id}')">
                    <i class="fas fa-arrow-right"></i> Advance
                  </button>
                </div>`).join('')
            : `<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:30px;"><i class="fas fa-check-circle" style="font-size:2rem;color:var(--success);display:block;margin-bottom:10px;"></i>Kitchen is clear.</div>`;
        }
      }

      if (tab === 'staff') {
        const grid = document.getElementById('adminStaffPermissionsGrid');
        if (grid) {
          const staffRoles = [
            { name:'Manager',      permissions:['View all orders','Manage menu','View users','Update reservations','Kitchen access','Staff management'] },
            { name:'Chef',         permissions:['View kitchen orders','Advance order status'] },
            { name:'Waiter',       permissions:['View table reservations','Update reservation status'] },
            { name:'Cashier',      permissions:['Process payments','View orders'] },
            { name:'Delivery Boy', permissions:['View assigned deliveries','Update delivery status'] }
          ];
          grid.innerHTML = staffRoles.map(role => `
            <div class="glass" style="padding:20px;border-radius:var(--border-radius-md);">
              <h4 style="color:var(--primary);margin-bottom:12px;font-weight:700;">${role.name}</h4>
              <div style="font-size:.8rem;display:flex;flex-direction:column;gap:7px;">
                ${role.permissions.map(p => `<div><span style="color:var(--success);margin-right:6px;">✔</span>${p}</div>`).join('')}
              </div>
            </div>`).join('');
        }
      }
    } catch (e) {
      this.showToast('Admin panel error: ' + e.message, 'danger');
    }
  }

  setAdminTab(name) { this.state.activeAdminTab = name; this._renderAdmin(false); }

  async adminUpdateOrderStatus(orderId, newStatus) {
    try {
      await updateOrderStatus(orderId, newStatus);
      this.showToast(`Order ${orderId} → ${newStatus}`, 'success');
      await this._renderAdmin();
    } catch (e) { this.showToast('Failed to update order', 'danger'); }
  }

  async adminUpdateReservation(resId, status) {
    try {
      await updateReservationStatus(resId, status);
      this.showToast(`Reservation ${resId}: ${status}`, 'success');
      await this._renderAdmin();
    } catch (e) { this.showToast('Failed to update reservation', 'danger'); }
  }

  async advanceKitchenStatus(orderId) {
    try {
      const nextStatus = await advanceOrderStatus(orderId);
      this.showToast(`Order ${orderId} → ${nextStatus}`, 'success');
      await this._renderAdmin();
    } catch (e) { this.showToast('Failed to advance status', 'danger'); }
  }

  /* ── REVIEW LIKES ────────────────────────────── */
  async likeReview(revId) {
    try {
      const newLikes = await fsLikeReview(revId);
      const rev = (window.REVIEWS || []).find(r => r.id === revId);
      if (rev) rev.likes = newLikes;
      this.showToast('Marked as helpful!', 'success');
      this._renderHome();
    } catch (e) {}
  }

  /* ── CHATBOT ─────────────────────────────────── */
  _initChatbot() {
    const btn   = document.getElementById('chatbotSendBtn');
    const input = document.getElementById('chatbotInputMsg');
    if (!btn || !input) return;
    const send = async () => {
      const text = input.value.trim();
      if (!text) return;
      this._appendChat(text, 'user');
      input.value = '';

      // Show typing indicator
      const typingId = 'typing-' + Date.now();
      const body = document.getElementById('chatbotBody');
      const typing = document.createElement('div');
      typing.id = typingId;
      typing.className = 'chat-msg chat-msg-bot';
      typing.innerHTML = '<span style="opacity:.5;">typing...</span>';
      body?.appendChild(typing);
      body.scrollTop = body.scrollHeight;

      try {
        const reply = await window.AIChatbot.processMessage(text);
        // Remove typing indicator
        document.getElementById(typingId)?.remove();

        this._appendChat(reply.text, 'bot');

        // Show dish cards with Add to Cart buttons
        if (reply.dishes && reply.dishes.length) {
          const wrap = document.createElement('div');
          wrap.style.cssText = 'display:flex;flex-direction:column;gap:8px;margin-top:8px;';
          reply.dishes.forEach(dish => {
            const price = (dish.price * (1 - (dish.discount || 0) / 100)).toFixed(2);
            const card  = document.createElement('div');
            card.className = 'glass';
            card.style.cssText = 'padding:10px 14px;border-radius:12px;display:flex;align-items:center;gap:10px;';
            card.innerHTML = `
              <img src="${dish.image}" style="width:48px;height:48px;border-radius:8px;object-fit:cover;" onerror="this.src='assets/hero-bg.png'" />
              <div style="flex:1;min-width:0;">
                <div style="font-weight:700;font-size:.85rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${dish.name}</div>
                <div style="font-size:.75rem;color:var(--text-muted);">$${price} • ⭐${dish.rating} • ⏱️${dish.cookingTime}</div>
              </div>
              <button class="btn-gold" style="padding:6px 12px;font-size:.72rem;white-space:nowrap;flex-shrink:0;"
                onclick="app.addToCartFromChat('${dish.id}', '${dish.name.replace(/'/g, "\\'")}')">
                🛒 Add
              </button>`;
            wrap.appendChild(card);
          });
          body?.appendChild(wrap);
          body.scrollTop = body.scrollHeight;
        }

        // Show action button (link)
        if (reply.action) {
          const wrap = document.createElement('div');
          wrap.style.cssText = 'margin-top:8px;';
          wrap.innerHTML = `<a href="${reply.action.href}" class="btn-gold" style="padding:8px 16px;font-size:.8rem;display:inline-block;text-decoration:none;" onclick="app.toggleChatbot(false)">${reply.action.label}</a>`;
          body?.appendChild(wrap);
          body.scrollTop = body.scrollHeight;
        }

        // Show checkout button
        if (reply.showCheckoutBtn) {
          const wrap = document.createElement('div');
          wrap.style.cssText = 'margin-top:8px;display:flex;gap:8px;flex-wrap:wrap;';
          wrap.innerHTML = `
            <a href="#checkout" class="btn-gold" style="padding:8px 16px;font-size:.8rem;display:inline-block;text-decoration:none;" onclick="app.toggleChatbot(false)">✅ Go to Checkout</a>
            <button class="btn-outline" style="padding:8px 16px;font-size:.8rem;background:transparent;" onclick="app.toggleCartDrawer(true);app.toggleChatbot(false);">🛒 View Cart</button>`;
          body?.appendChild(wrap);
          body.scrollTop = body.scrollHeight;
        }

      } catch (err) {
        document.getElementById(typingId)?.remove();
        this._appendChat("Sorry, something went wrong. Please try again! 😊", 'bot');
      }
    };
    btn.onclick      = send;
    input.onkeypress = e => { if (e.key === 'Enter') send(); };
  }

  // Called when dish added to cart via chatbot
  addToCartFromChat(dishId, dishName) {
    this.addToCart(dishId, 1);
    // Open chatbot if closed and notify
    const panel = document.getElementById('chatbotPanel');
    if (panel && !panel.classList.contains('active')) {
      this.toggleChatbot(true);
    }
    window.AIChatbot.notifyCartAdded(dishName);
  }

  toggleChatbot(open) {
    const panel = document.getElementById('chatbotPanel');
    if (!panel) return;
    if (open) {
      panel.classList.add('active');
      const body = document.getElementById('chatbotBody');
      if (body && !body.children.length) {
        this._appendChat("Hey! 👋 Welcome to Foodies! Ask me to recommend dishes, check best sellers, or help with your order.", 'bot');
      }
    } else {
      panel.classList.remove('active');
    }
  }

  _appendChat(text, sender) {
    const body = document.getElementById('chatbotBody');
    if (!body) return;
    const msg = document.createElement('div');
    msg.className = `chat-msg chat-msg-${sender}`;
    msg.innerHTML = text;
    body.appendChild(msg);
    body.scrollTop = body.scrollHeight;
  }
}

window.app = new FoodiesApp();
window.addEventListener('DOMContentLoaded', () => window.app.onDOMReady());

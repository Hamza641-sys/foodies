/**
 * Foodies - Admin Panel Controller (Firebase Edition)
 * =====================================================
 * All /api/admin/ REST calls replaced with Firestore SDK calls.
 * Auth check uses Firebase Auth + Firestore role field.
 */

import { isAdmin }           from './auth-firebase.js';
import { getCurrentUser }    from './auth-firebase.js';
import {
  getDishes, createDish, updateDish, deleteDish,
  getAllOrders, updateOrderStatus,
  getAllUsers, getAdminStats
} from './firestore.js';

class AdminController {
  constructor() {
    this.activeTab = 'dashboard';
    this.dishes    = [];
    this.analytics = null;
  }

  async init() {
    this._bindLoginForm();
  }

  _bindLoginForm() {
    const loginForm = document.getElementById('adminLoginForm');
    if (loginForm && !loginForm._adminBound) {
      loginForm._adminBound = true;
      loginForm.addEventListener('submit', e => this.handleLogin(e));
    }
    const dishForm = document.getElementById('dishAdminForm');
    if (dishForm && !dishForm._adminBound) {
      dishForm._adminBound = true;
      dishForm.addEventListener('submit', e => this.handleDishSubmit(e));
    }
  }

  _fld(suffix) {
    return document.getElementById(`dishAdmin${suffix}`) || document.getElementById(`dishForm${suffix}`);
  }

  /* ── AUTH ─────────────────────────────────────── */
  async handleLogin(e) {
    e.preventDefault();
    const emailEl  = document.getElementById('adminLoginEmail');
    const passEl   = document.getElementById('adminLoginPassword');
    if (!emailEl || !passEl) return;

    const submitBtn = e.target.querySelector('button[type="submit"]');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = 'Logging in... <i class="fas fa-spinner fa-spin"></i>'; }

    try {
      // loginUser is imported in app.js — call it via window.app helper or direct Firebase
      const { loginUser } = await import('./auth-firebase.js');
      const { user, profile } = await loginUser(emailEl.value.trim(), passEl.value);

      // Direct email check — no Firestore needed
      const adminEmails = ['admin@foodies.com', 'admin@client.com'];
      const adminOk = adminEmails.includes(user.email) || await isAdmin(user.uid);
      
      if (!adminOk) {
        this.showToast('Access Denied. Admin privilege required.', 'danger');
        const { logoutUser } = await import('./auth-firebase.js');
        await logoutUser();
        return;
      }

      this.showToast(`Welcome, ${profile?.name || user.email}!`, 'success');
      if (e.target) e.target.reset();

      // Update app state and open panel directly — skip re-auth check
      if (window.app) {
        window.app.state.firebaseUser = user;
        window.app.state.currentUser  = profile
          ? { ...profile, uid: user.uid, email: user.email }
          : { uid: user.uid, name: user.displayName || 'Admin', email: user.email, role: 'admin' };
        await window.app._renderAdmin(true); // true = skipAuthCheck
      }
    } catch (err) {
      const msg = err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password'
        ? 'Invalid email or password'
        : 'Login error — check your internet connection.';
      this.showToast(msg, 'danger');
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = 'Secure Login &nbsp;<i class="fas fa-lock"></i>'; }
    }
  }

  showLoginBox() {
    const loginCard   = document.getElementById('adminLoginCard');
    const panelLayout = document.getElementById('adminPanelLayout');
    if (loginCard)   loginCard.style.display   = 'block';
    if (panelLayout) panelLayout.style.display = 'none';
  }

  showDashboard() {
    const loginCard   = document.getElementById('adminLoginCard');
    const panelLayout = document.getElementById('adminPanelLayout');
    if (loginCard)   loginCard.style.display   = 'none';
    if (panelLayout) panelLayout.style.display = 'flex';
    this.switchTab(this.activeTab);
  }

  handleLogout(showNotification = true) {
    if (window.app) window.app.logout();
    else this.showLoginBox();
    if (showNotification) this.showToast('Logged out safely.', 'info');
  }

  /* ── TABS ─────────────────────────────────────── */
  switchTab(tabName) {
    this.activeTab = tabName;
    document.querySelectorAll('.sidebar-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-tab') === tabName);
    });
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.getElementById(`panel-${tabName}`)?.classList.add('active');
    const titles = { dashboard:'Dashboard Overview', orders:'Orders Management', menu:'Menu Catalog', users:'Registered Users' };
    const titleEl = document.getElementById('panelTitle');
    if (titleEl) titleEl.innerText = titles[tabName] || 'Admin Backoffice';
    this.loadTabContents(tabName);
  }

  async loadTabContents(tabName) {
    if      (tabName === 'dashboard') await this.loadStats();
    else if (tabName === 'orders')    await this.loadOrders();
    else if (tabName === 'menu')      await this.loadMenu();
    else if (tabName === 'users')     await this.loadUsers();
  }

  /* ── STATS ────────────────────────────────────── */
  async loadStats() {
    try {
      const stats = await getAdminStats();
      const set = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
      set('kpiOrders',          stats.totalOrders);
      set('kpiRevenue',         `$${stats.totalRevenue.toFixed(2)}`);
      set('kpiUsers',           stats.totalUsers);
      set('kpiMenuItems',       stats.totalMenuItems);
      set('adminStatRevenue',   `$${stats.totalRevenue.toFixed(2)}`);
      set('adminStatOrders',    stats.totalOrders);
      set('adminStatMenuItems', stats.totalMenuItems);
    } catch (e) { this.showToast('Failed to load stats', 'danger'); }
  }

  /* ── ORDERS ───────────────────────────────────── */
  async loadOrders() {
    try {
      const orders = await getAllOrders();
      const bodyIds = ['ordersTableBody', 'adminOrdersTableBody'];
      bodyIds.forEach(id => {
        const body = document.getElementById(id);
        if (!body) return;
        if (!orders.length) { body.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--text-muted);">No orders found.</td></tr>`; return; }
        body.innerHTML = orders.map(order => {
          const itemsList = order.items.map(i => `${i.name} (x${i.qty})`).join(', ');
          const dateStr   = order.createdAt?.toDate?.()?.toLocaleString?.() || '';
          return `
            <tr>
              <td><strong style="color:var(--primary);">${order.id}</strong></td>
              <td><strong>${order.customerName}</strong><br><small style="color:var(--text-muted);font-size:.78rem;">${order.email||''}</small></td>
              <td style="max-width:250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${itemsList}">${itemsList}</td>
              <td><strong>$${order.total?.toFixed(2)}</strong></td>
              <td>
                <select class="form-input" style="padding:6px 10px;font-size:.78rem;width:auto;margin:0;"
                        onchange="window.AdminController.updateOrderStatus('${order.id}', this.value)">
                  ${['Pending','Preparing','Cooking','Packed','Out For Delivery','Delivered'].map(st =>
                    `<option value="${st}" ${order.status===st?'selected':''}>${st}</option>`).join('')}
                </select>
              </td>
              <td style="font-size:.8rem;color:var(--text-muted);">${dateStr}</td>
            </tr>`;
        }).join('');
      });
    } catch (e) { this.showToast('Failed to load orders', 'danger'); }
  }

  async updateOrderStatus(orderId, newStatus) {
    try {
      await updateOrderStatus(orderId, newStatus);
      this.showToast(`Order ${orderId} → ${newStatus}`, 'success');
      await this.loadOrders();
    } catch (e) { this.showToast('Failed to update order status', 'danger'); }
  }

  /* ── MENU ─────────────────────────────────────── */
  async renderMenuTable() { await this.loadMenu(); }

  async loadMenu() {
    try {
      const dishes = await getDishes();
      this.dishes  = dishes;
      const bodyIds = ['menuTableBody', 'adminMenuTableBody'];
      bodyIds.forEach(id => {
        const body = document.getElementById(id);
        if (!body) return;
        if (!dishes.length) { body.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-muted);">No menu items found.</td></tr>`; return; }
        body.innerHTML = dishes.map(dish => {
          const promoPrice = dish.price * (1 - dish.discount / 100);
          return `
            <tr>
              <td><img src="${dish.image}" style="width:42px;height:42px;border-radius:6px;object-fit:cover;" onerror="this.src='assets/hero-bg.png'" /></td>
              <td><strong style="color:var(--primary);">${dish.id}</strong></td>
              <td><strong>${dish.name}</strong></td>
              <td style="text-transform:capitalize;font-size:.8rem;">${dish.category}</td>
              <td><strong>$${dish.price.toFixed(2)}</strong>${dish.discount>0?`<br><small style="color:var(--success);font-size:.7rem;">Promo: $${promoPrice.toFixed(2)}</small>`:''}</td>
              <td>${dish.discount}%</td>
              <td>
                <div style="display:flex;gap:6px;">
                  <button class="btn-outline" style="padding:4px 8px;font-size:.72rem;background:transparent;" onclick="window.AdminController.showEditDishModal('${dish.id}')"><i class="fas fa-edit"></i> Edit</button>
                  <button class="btn-outline" style="padding:4px 8px;font-size:.72rem;border-color:var(--danger);color:var(--danger);background:transparent;" onclick="window.AdminController.deleteDish('${dish.id}')"><i class="fas fa-trash"></i> Delete</button>
                </div>
              </td>
            </tr>`;
        }).join('');
      });
    } catch (e) { this.showToast('Failed to load menu', 'danger'); }
  }

  showAddDishModal() {
    const titleEl = document.getElementById('dishAdminModalTitle');
    if (titleEl) titleEl.innerHTML = '<i class="fas fa-plus-circle" style="margin-right:8px;"></i>Add New Menu Item';
    const modeEl = this._fld('Mode');
    if (modeEl) modeEl.value = 'add';
    const idEl = this._fld('Id');
    if (idEl) { idEl.value = ''; idEl.disabled = false; }
    document.getElementById('dishAdminForm')?.reset();
    // Reset image preview
    const prev = document.getElementById('dishImagePreview');
    if (prev) prev.style.display = 'none';
    // Bind image preview on URL input
    const imgInput = document.getElementById('dishAdminImage');
    if (imgInput && !imgInput._prevBound) {
      imgInput._prevBound = true;
      imgInput.addEventListener('input', () => {
        const url = imgInput.value.trim();
        const prevDiv = document.getElementById('dishImagePreview');
        const prevImg = document.getElementById('dishImagePreviewImg');
        if (url && prevDiv && prevImg) {
          prevImg.src = url;
          prevDiv.style.display = 'block';
        }
      });
    }
    // Open modal — body level, fixed position
    const modal = document.getElementById('dishAdminModal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  showEditDishModal(dishId) {
    const dish = this.dishes.find(d => d.id === dishId);
    if (!dish) return;
    const titleEl = document.getElementById('dishAdminModalTitle');
    if (titleEl) titleEl.innerHTML = `<i class="fas fa-edit" style="margin-right:8px;"></i>Edit: ${dish.name}`;
    const modeEl = this._fld('Mode');
    if (modeEl) modeEl.value = 'edit';
    const idEl = this._fld('Id');
    if (idEl) { idEl.value = dish.id; idEl.disabled = true; }
    const setVal = (s, v) => { const el = this._fld(s); if (el) el.value = v ?? ''; };
    const setChk = (s, v) => { const el = this._fld(s); if (el) el.checked = !!v; };
    setVal('Name', dish.name); setVal('Category', dish.category); setVal('Price', dish.price);
    setVal('Discount', dish.discount ?? 0); setVal('Image', dish.image);
    setVal('Serving', dish.servingSize || '1 Person'); setVal('Time', dish.cookingTime || '15 mins');
    setVal('Calories', dish.calories || 0); setVal('Spicy', dish.spicyLevel || 0);
    setVal('Ingredients', (dish.ingredients || []).join(', ')); setVal('Desc', dish.description);
    setChk('BestSeller', dish.bestSeller); setChk('Featured', dish.featured); setChk('Recommended', dish.recommended);
    // Show image preview
    const prevDiv = document.getElementById('dishImagePreview');
    const prevImg = document.getElementById('dishImagePreviewImg');
    if (prevDiv && prevImg && dish.image) { prevImg.src = dish.image; prevDiv.style.display = 'block'; }
    const modal2 = document.getElementById('dishAdminModal');
    if (modal2) {
      modal2.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeDishModal() {
    const modal = document.getElementById('dishAdminModal');
    if (modal) { modal.classList.remove('active'); document.body.style.overflow = ''; }
  }

  async handleDishSubmit(e) {
    e.preventDefault();
    const modeEl = this._fld('Mode');
    const mode   = modeEl ? modeEl.value : 'add';
    const idEl   = this._fld('Id');
    const id     = idEl ? idEl.value.trim() : '';
    const getVal = s => { const el = this._fld(s); return el ? el.value : ''; };
    const getChk = s => { const el = this._fld(s); return el ? el.checked : false; };
    const ingredients = getVal('Ingredients').split(',').map(s => s.trim()).filter(Boolean);
    const payload = {
      id, name: getVal('Name').trim(), category: getVal('Category'),
      price: parseFloat(getVal('Price')), discount: parseInt(getVal('Discount')) || 0,
      image: getVal('Image').trim(), servingSize: getVal('Serving').trim(),
      cookingTime: getVal('Time').trim(), calories: parseInt(getVal('Calories')) || 0,
      spicyLevel: parseInt(getVal('Spicy')) || 0, ingredients,
      description: getVal('Desc').trim(), bestSeller: getChk('BestSeller'),
      featured: getChk('Featured'), recommended: getChk('Recommended'),
      rating: 4.5, reviewsCount: 0
    };
    try {
      if (mode === 'add') await createDish(payload);
      else                await updateDish(id, payload);
      this.showToast(mode === 'add' ? 'Menu item added!' : 'Menu item updated!', 'success');
      this.closeDishModal();
      await this.loadMenu();
      if (window.app) await window.app.loadApiData();
    } catch (err) { this.showToast('Failed to save: ' + err.message, 'danger'); }
  }

  async deleteDish(dishId) {
    if (!confirm(`Delete dish '${dishId}'? This cannot be undone.`)) return;
    try {
      await deleteDish(dishId);
      this.showToast('Dish deleted.', 'success');
      await this.loadMenu();
      if (window.app) await window.app.loadApiData();
    } catch (e) { this.showToast('Failed to delete dish', 'danger'); }
  }

  /* ── USERS ────────────────────────────────────── */
  async renderUsersTable() { await this.loadUsers(); }

  async loadUsers() {
    try {
      const users = await getAllUsers();
      const bodyIds = ['usersTableBody', 'adminUsersTableBody'];
      bodyIds.forEach(id => {
        const body = document.getElementById(id);
        if (!body) return;
        if (!users.length) { body.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--text-muted);">No users found.</td></tr>`; return; }
        body.innerHTML = users.map(user => {
          const joinDate = user.createdAt?.toDate?.()?.toLocaleDateString?.() || '';
          return `
            <tr>
              <td><strong>${user.name}</strong></td>
              <td>${user.email}</td>
              <td><span class="status-badge ${user.role==='admin'?'status-delivered':'status-preparing'}" style="font-size:.65rem;padding:4px 8px;">${user.role}</span></td>
              <td>${user.vipStatus || 'Regular'}</td>
              <td><strong>${user.points}</strong> pts</td>
              <td style="font-size:.8rem;color:var(--text-muted);">${joinDate}</td>
            </tr>`;
        }).join('');
      });
    } catch (e) { this.showToast('Failed to load users', 'danger'); }
  }

  /* ── CHARTS ───────────────────────────────────── */
  renderRevenueChart() {
    const data   = this.analytics?.revenueByDay    || [120,200,180,340,290,410,380];
    const labels = this.analytics?.revenueDayLabels || ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    return this._buildBarChart(data, labels, 'var(--primary)');
  }

  renderVisitorsChart() {
    const data   = this.analytics?.visitorsByDay    || [60,90,75,130,110,170,145];
    const labels = this.analytics?.visitorDayLabels || ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    return this._buildBarChart(data, labels, '#3b82f6');
  }

  _buildBarChart(data, labels, color) {
    const max  = Math.max(...data) || 1;
    const w = 340, h = 160;
    const barW = Math.floor((w - 20) / data.length) - 4;
    const bars = data.map((v, i) => {
      const barH = Math.round((v / max) * (h - 30));
      const x = 10 + i * (barW + 4), y = h - 20 - barH;
      return `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" rx="3" fill="${color}" opacity="0.85"/>
        <text x="${x+barW/2}" y="${h-4}" text-anchor="middle" font-size="9" fill="var(--text-muted)">${labels[i]}</text>
        <text x="${x+barW/2}" y="${y-4}" text-anchor="middle" font-size="9" fill="var(--text-color)">${v}</text>`;
    }).join('');
    return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="display:block;">${bars}</svg>`;
  }

  /* ── TOAST ────────────────────────────────────── */
  showToast(message, type = 'info') {
    const box = document.getElementById('admin-toast-box');
    if (!box) { if (window.app) { window.app.showToast(message, type); return; } return; }
    const colors = { success:'#10b981', danger:'#ef4444', warning:'#f59e0b', info:'#3b82f6' };
    const color  = colors[type] || colors.info;
    const toast  = document.createElement('div');
    toast.className = 'glass';
    Object.assign(toast.style, { padding:'12px 22px', borderRadius:'40px', fontSize:'.84rem', fontWeight:'500', borderLeft:`4px solid ${color}`, transition:'all .4s ease', boxShadow:'0 4px 16px rgba(0,0,0,.25)', color:'#fff', display:'flex', alignItems:'center', marginBottom:'10px' });
    toast.innerHTML = `<span style="color:${color};margin-right:8px;font-size:1.1rem;">●</span>${message}`;
    box.appendChild(toast);
    setTimeout(() => { toast.style.opacity='0'; toast.style.transform='translateY(8px)'; setTimeout(() => toast.remove(), 400); }, 3200);
  }
}

window.AdminController = new AdminController();
document.addEventListener('DOMContentLoaded', () => window.AdminController.init());

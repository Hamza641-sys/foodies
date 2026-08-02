/**
 * Foodies - UI Rendering Engine
 * Renders dish cards, reviews, chefs, admin tables with the new Foodies design.
 */

class UIEngine {

  /** Skeleton loader cards */
  getMenuSkeletons(count = 6) {
    let html = '';
    for (let i = 0; i < count; i++) {
      html += `
        <div class="dish-card glass">
          <div class="dish-image-container skeleton" style="height:210px;"></div>
          <div class="dish-card-body">
            <div class="skeleton" style="width:70%;height:18px;margin-bottom:10px;"></div>
            <div class="skeleton" style="width:100%;height:13px;margin-bottom:6px;"></div>
            <div class="skeleton" style="width:88%;height:13px;"></div>
          </div>
          <div class="dish-footer">
            <div class="skeleton" style="width:30%;height:22px;"></div>
            <div class="skeleton" style="width:38px;height:38px;border-radius:50%;"></div>
          </div>
        </div>`;
    }
    return html;
  }

  /** Star rating HTML helper — supports half stars */
  _stars(rating) {
    const full  = Math.floor(rating);
    const half  = rating - full >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    let s = '';
    for (let i = 0; i < full;  i++) s += '<i class="fas fa-star"></i>';
    if (half)                         s += '<i class="fas fa-star-half-alt"></i>';
    for (let i = 0; i < empty; i++) s += '<i class="far fa-star"></i>';
    return s;
  }

  /**
   * Single Dish Card — with improved Best Seller & Discount badges
   */
  renderDishCard(dish) {
    const isWishlisted  = window.app && window.app.state.wishlist.includes(dish.id) ? 'active' : '';
    const finalPrice    = dish.price * (1 - dish.discount / 100);

    // Badge logic — discount takes priority, then best seller
    let badge = '';
    if (dish.discount > 0) {
      badge = `<div class="dish-badge badge-discount">-${dish.discount}% OFF</div>`;
    } else if (dish.bestSeller) {
      badge = `<div class="dish-badge badge-bestseller">🔥 Best Seller</div>`;
    } else if (dish.recommended) {
      badge = `<div class="dish-badge badge-recommended">⭐ Chef's Pick</div>`;
    }

    const originalPrice = dish.discount > 0
      ? `<span class="price-original">$${dish.price.toFixed(2)}</span>` : '';

    return `
      <div class="dish-card glass" data-dish-id="${dish.id}">
        <div class="dish-image-container" onclick="app.showDishDetail('${dish.id}')">
          <img src="${dish.image}" alt="${dish.name}" loading="lazy" onerror="this.src='assets/hero-bg.png'" />
          ${badge}
          <div class="dish-card-icon"><i class="fas fa-utensils"></i></div>
          <i class="fas fa-heart dish-wishlist-btn ${isWishlisted}"
             onclick="event.stopPropagation(); app.toggleWishlist('${dish.id}')"></i>
        </div>
        <div class="dish-card-body" onclick="app.showDishDetail('${dish.id}')">
          <div class="dish-info">
            <h3>${dish.name}</h3>
            <p class="dish-desc">${dish.description}</p>
          </div>
          <div class="dish-rating-row">
            <span style="color:var(--warning);">${this._stars(dish.rating)}</span>
            <span>${dish.rating.toFixed(1)}</span>
            <span style="color:var(--text-muted);font-size:.73rem;">(${dish.reviewsCount})</span>
            <span style="margin-left:auto;font-size:.75rem;color:var(--text-muted);">
              <i class="fas fa-clock"></i> ${dish.cookingTime}
            </span>
          </div>
        </div>
        <div class="dish-footer">
          <div class="dish-price">
            <span class="price-value">$${finalPrice.toFixed(2)}</span>
            ${originalPrice}
          </div>
          <button class="btn-add-cart" title="Add to cart"
                  onclick="event.stopPropagation(); app.addToCart('${dish.id}')">
            <i class="fas fa-shopping-cart"></i>
          </button>
        </div>
      </div>`;
  }

  /**
   * Deal Card — for Deals/Discount section
   */
  renderDealCard(dish) {
    const finalPrice = dish.price * (1 - dish.discount / 100);
    const savings    = (dish.price - finalPrice).toFixed(2);
    return `
      <div class="deal-card glass" data-dish-id="${dish.id}">
        <div class="deal-img-wrap" onclick="app.showDishDetail('${dish.id}')">
          <img src="${dish.image}" alt="${dish.name}" loading="lazy" onerror="this.src='assets/hero-bg.png'" />
          <div class="deal-discount-circle">-${dish.discount}%</div>
        </div>
        <div class="deal-info">
          <h4 onclick="app.showDishDetail('${dish.id}')">${dish.name}</h4>
          <div class="deal-price-row">
            <span class="deal-new-price">$${finalPrice.toFixed(2)}</span>
            <span class="deal-old-price">$${dish.price.toFixed(2)}</span>
            <span class="deal-save-tag">Save $${savings}</span>
          </div>
          <button class="btn-gold" style="width:100%;justify-content:center;margin-top:10px;padding:9px;"
                  onclick="app.addToCart('${dish.id}')">
            <i class="fas fa-shopping-cart"></i> Add to Cart
          </button>
        </div>
      </div>`;
  }

  /**
   * Best Seller Card — horizontal card with rank badge
   */
  renderBestSellerCard(dish, rank) {
    const finalPrice = dish.price * (1 - dish.discount / 100);
    const discountBadge = dish.discount > 0
      ? `<span class="bs-discount-tag">-${dish.discount}%</span>` : '';
    return `
      <div class="bestseller-card glass">
        <div class="bs-rank">#${rank}</div>
        <img src="${dish.image}" alt="${dish.name}" loading="lazy"
             onerror="this.src='assets/hero-bg.png'"
             onclick="app.showDishDetail('${dish.id}')" />
        <div class="bs-info">
          <h4 onclick="app.showDishDetail('${dish.id}')">${dish.name}</h4>
          <div style="font-size:.75rem;color:var(--text-muted);margin-bottom:6px;">
            <span style="color:var(--warning);">${this._stars(dish.rating)}</span>
            ${dish.rating.toFixed(1)} (${dish.reviewsCount})
          </div>
          <div class="bs-price-row">
            <span class="price-value">$${finalPrice.toFixed(2)}</span>
            ${discountBadge}
          </div>
        </div>
        <button class="btn-add-cart" title="Add to cart"
                onclick="app.addToCart('${dish.id}')">
          <i class="fas fa-shopping-cart"></i>
        </button>
      </div>`;
  }

  /**
   * Combo Deal Card — for Combos section
   */
  renderComboCard(combo) {
    const discountPct = Math.round((combo.saves / combo.originalPrice) * 100);
    const itemsList   = combo.items.map(i => `
      <span class="combo-item-tag">
        ${i.qty > 1 ? `<strong>${i.qty}×</strong> ` : ''}${i.name}
      </span>`).join('');

    return `
      <div class="combo-card glass">
        <div class="combo-img-wrap">
          <img src="${combo.image}" alt="${combo.name}" loading="lazy"
               onerror="this.src='assets/hero-bg.png'" />
          <div class="combo-tag-badge" style="background:${combo.badgeColor};">
            ${combo.tagIcon} ${combo.badge}
          </div>
          <div class="combo-discount-pill">-${discountPct}% OFF</div>
        </div>

        <div class="combo-body">
          <div class="combo-header-row">
            <div>
              <span class="combo-category-tag">${combo.tagIcon} ${combo.tag}</span>
              <h3 class="combo-title">${combo.name}</h3>
            </div>
          </div>

          <p class="combo-desc">${combo.description}</p>

          <div class="combo-items-list">${itemsList}</div>

          <div class="combo-meta-row">
            <span><i class="fas fa-users"></i> ${combo.servings}</span>
            <span><i class="fas fa-clock"></i> ${combo.cookingTime}</span>
          </div>

          <div class="combo-footer">
            <div class="combo-price-block">
              <span class="combo-new-price">$${combo.comboPrice.toFixed(2)}</span>
              <span class="combo-old-price">$${combo.originalPrice.toFixed(2)}</span>
              <span class="combo-save-badge">Save $${combo.saves}</span>
            </div>
            <button class="btn-gold combo-add-btn"
                    onclick="app.addComboToCart('${combo.id}')">
              <i class="fas fa-shopping-cart"></i> Add Deal
            </button>
          </div>
        </div>
      </div>`;
  }

  /** Reviews panel */
  renderReviews(reviews) {
    return reviews.map(rev => `
      <div class="glass" style="padding:28px;border-radius:var(--border-radius-md);margin-bottom:18px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
          <div style="display:flex;align-items:center;gap:14px;">
            <div class="dashboard-avatar" style="width:48px;height:48px;font-size:1.1rem;margin:0;flex-shrink:0;">
              ${rev.avatar}
            </div>
            <div>
              <h4 style="font-weight:700;display:flex;align-items:center;gap:8px;">
                ${rev.userName}
                ${rev.badge ? '<span class="status-badge status-ready" style="font-size:.6rem;">Verified</span>' : ''}
              </h4>
              <span style="font-size:.78rem;color:var(--text-muted);">${rev.userTitle}</span>
            </div>
          </div>
          <div style="text-align:right;">
            <div style="color:var(--warning);font-size:.82rem;margin-bottom:3px;">
              ${'<i class="fas fa-star"></i>'.repeat(rev.rating)}
            </div>
            <span style="font-size:.72rem;color:var(--text-muted);">${rev.date}</span>
          </div>
        </div>
        <p style="font-size:.92rem;line-height:1.65;margin-bottom:12px;">"${rev.text}"</p>
        <div style="display:flex;align-items:center;gap:14px;font-size:.78rem;color:var(--text-muted);margin-bottom:12px;">
          <span style="cursor:pointer;display:flex;align-items:center;gap:5px;"
                onclick="app.likeReview('${rev.id}')">
            <i class="fas fa-thumbs-up" style="color:var(--primary);"></i> ${rev.likes} Helpful
          </span>
        </div>
        ${rev.reply ? `
          <div style="margin-left:24px;border-left:3px solid var(--primary);padding-left:14px;margin-top:12px;">
            <h5 style="color:var(--primary);font-size:.8rem;text-transform:uppercase;margin-bottom:4px;">
              <i class="fas fa-reply"></i> Chef's Response
            </h5>
            <p style="font-size:.84rem;font-style:italic;color:var(--text-muted);">"${rev.reply}"</p>
          </div>` : ''}
      </div>`).join('');
  }

  /** Chefs grid */
  renderChefs(chefs) {
    return chefs.map(chef => `
      <div class="chef-card glass">
        <img class="chef-image" src="${chef.image}" alt="${chef.name}"
             onerror="this.src='assets/hero-bg.png'" />
        <div class="chef-overlay-details">
          <h3>${chef.name}</h3>
          <span class="chef-role">${chef.role}</span>
          <div style="font-size:.78rem;margin-bottom:8px;color:rgba(255,255,255,.7);">
            <i class="fas fa-award" style="color:var(--primary);"></i> ${chef.awards}
          </div>
          <p class="chef-bio">${chef.biography}</p>
        </div>
      </div>`).join('');
  }

  /** Admin orders table rows */
  renderAdminOrdersTable(orders) {
    if (!orders.length)
      return '<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--text-muted);">No orders yet.</td></tr>';

    return orders.map(ord => {
      const itemsText = ord.items.map(i => `${i.name} (${i.qty})`).join(', ');
      return `
        <tr>
          <td><strong style="color:var(--primary);">${ord.id}</strong></td>
          <td>${ord.customerName}</td>
          <td style="max-width:190px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${itemsText}</td>
          <td><strong>$${ord.total.toFixed(2)}</strong></td>
          <td>
            <select class="form-input" style="padding:6px;font-size:.78rem;width:auto;"
                    onchange="app.adminUpdateOrderStatus('${ord.id}', this.value)">
              ${['Pending','Preparing','Cooking','Packed','Out For Delivery','Delivered']
                .map(s => `<option value="${s}" ${ord.status===s?'selected':''}>${s}</option>`).join('')}
            </select>
          </td>
          <td style="font-size:.8rem;color:var(--text-muted);">${new Date(ord.createdAt).toLocaleTimeString()}</td>
        </tr>`;
    }).join('');
  }

  /** Admin reservations table rows */
  renderAdminReservationsTable(reservations) {
    if (!reservations.length)
      return '<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-muted);">No reservations yet.</td></tr>';

    return reservations.map(res => `
      <tr>
        <td><strong style="color:var(--primary);">${res.id}</strong></td>
        <td>${res.name}</td>
        <td>${res.date}</td>
        <td>${res.time}</td>
        <td>${res.guests} Guests</td>
        <td><span class="status-badge status-ready">${res.type}</span></td>
        <td style="display:flex;gap:6px;flex-wrap:wrap;">
          <button class="btn-outline" style="padding:4px 10px;font-size:.72rem;"
                  onclick="app.adminUpdateReservation('${res.id}','Confirmed')">Approve</button>
          <button class="btn-outline" style="padding:4px 10px;font-size:.72rem;border-color:var(--danger);color:var(--danger);"
                  onclick="app.adminUpdateReservation('${res.id}','Cancelled')">Cancel</button>
        </td>
      </tr>`).join('');
  }
}

window.UIEngine = new UIEngine();

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

  /** Helper — Firestore Timestamp ya ISO string dono se readable date banao */
  _formatOrderDate(createdAt) {
    try {
      // Firestore Timestamp object (.toDate method hota hai)
      if (createdAt && typeof createdAt.toDate === 'function') {
        return createdAt.toDate().toLocaleString('en-PK');
      }
      // Firestore Timestamp with seconds field (plain object)
      if (createdAt && createdAt.seconds) {
        return new Date(createdAt.seconds * 1000).toLocaleString('en-PK');
      }
      // ISO string ya number
      if (createdAt) {
        const d = new Date(createdAt);
        if (!isNaN(d.getTime())) return d.toLocaleString('en-PK');
      }
    } catch(e) {}
    return '—';
  }

  /** Admin orders table rows */
  renderAdminOrdersTable(orders) {
    if (!orders.length)
      return '<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--text-muted);">No orders yet.</td></tr>';

    return orders.map(ord => {
      const itemsText   = ord.items.map(i => `${i.name} (${i.qty})`).join(', ');
      const isCancelled = ord.status === 'Cancelled';
      const rowStyle    = isCancelled ? 'background:rgba(255,60,60,0.12);' : '';
      const timeStr     = this._formatOrderDate(ord.createdAt);

      return `
        <tr style="${rowStyle};cursor:pointer;" data-status="${ord.status}" data-customer="${ord.customerName.toLowerCase()}" data-orderid="${ord.id.toLowerCase()}" onclick="app.showOrderDetail('${ord.id}')">
          <td><strong style="color:var(--primary);">${ord.id}</strong></td>
          <td>
            <strong>${ord.customerName}</strong>
            ${ord.phone ? `<br><small style="color:var(--primary);font-size:.7rem;"><i class="fas fa-phone"></i> ${ord.phone}</small>` : ''}
            ${ord.address ? `<br><small style="color:var(--text-muted);font-size:.68rem;"><i class="fas fa-map-marker-alt"></i> ${ord.address.length > 28 ? ord.address.substring(0,28)+'...' : ord.address}</small>` : ''}
          </td>
          <td style="max-width:190px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${itemsText}</td>
          <td><strong>$${ord.total.toFixed(2)}</strong></td>
          <td onclick="event.stopPropagation()">
            <select class="form-input" style="padding:6px;font-size:.78rem;width:auto;${isCancelled ? 'color:#ff4444;font-weight:600;' : ''}"
                    onchange="app.adminUpdateOrderStatus('${ord.id}', this.value)">
              ${['Pending','Preparing','Cooking','Packed','Out For Delivery','Delivered','Cancelled']
                .map(s => `<option value="${s}" ${ord.status===s?'selected':''}>${s}</option>`).join('')}
            </select>
          </td>
          <td onclick="event.stopPropagation()" style="font-size:.8rem;color:var(--text-muted);">
            ${timeStr}<br>
            <button onclick="app.quickPrint('${ord.id}')"
                    style="margin-top:5px;background:var(--primary);border:none;border-radius:6px;padding:4px 10px;color:#fff;font-size:.72rem;cursor:pointer;">
              <i class="fas fa-print"></i> Print
            </button>
          </td>
        </tr>`;
    }).join('');
  }

  /** Admin reservations table rows */
  renderAdminReservationsTable(reservations) {
    if (!reservations.length)
      return '<tr><td colspan="10" style="text-align:center;padding:24px;color:var(--text-muted);">No reservations yet.</td></tr>';

    const badge = document.getElementById('reservationsCountBadge');
    if (badge) badge.innerText = `${reservations.length} reservation${reservations.length !== 1 ? 's' : ''}`;

    return reservations.map(res => {
      const bookedAt    = this._formatOrderDate(res.createdAt);
      const isCancelled = res.status === 'Cancelled';
      const isConfirmed = res.status === 'Confirmed';
      const statusColor = isConfirmed ? 'var(--success)' : isCancelled ? 'var(--danger)' : 'var(--warning)';
      const rowStyle    = isCancelled ? 'background:rgba(255,60,60,0.08);' : '';

      return `
        <tr style="${rowStyle};font-size:.74rem;">
          <td style="white-space:nowrap;"><strong style="color:var(--primary);font-size:.7rem;">${res.id}</strong></td>
          <td style="min-width:80px;max-width:110px;">
            <strong style="font-size:.76rem;">${res.name}</strong><br>
            <small style="color:var(--primary);font-size:.66rem;"><i class="fas fa-phone"></i> ${res.phone || '—'}</small>
          </td>
          <td style="white-space:nowrap;font-size:.72rem;">${res.date}</td>
          <td style="font-size:.72rem;">${res.time}</td>
          <td style="text-align:center;font-size:.72rem;">${res.guests}</td>
          <td><span class="status-badge status-ready" style="font-size:.6rem;padding:2px 6px;">${res.type}</span></td>
          <td style="font-size:.68rem;color:var(--text-muted);white-space:nowrap;">${bookedAt}</td>
          <td style="text-align:center;">
            <span style="display:inline-block;padding:2px 7px;border-radius:20px;font-size:.6rem;font-weight:700;white-space:nowrap;
                         background:${statusColor}20;color:${statusColor};border:1px solid ${statusColor}40;">
              ${res.status || 'Pending'}
            </span>
          </td>
          <td style="text-align:center;">
            ${res.specialRequest
              ? `<button onclick="app.showResNote('${res.specialRequest.replace(/'/g,"\\'").replace(/\n/g,' ')}')"
                         style="background:var(--primary);border:none;border-radius:50%;width:26px;height:26px;cursor:pointer;color:#fff;font-size:.72rem;display:inline-flex;align-items:center;justify-content:center;">
                   <i class="fas fa-comment-alt"></i>
                 </button>`
              : '<span style="color:var(--text-muted);">—</span>'}
          </td>
          <td style="white-space:nowrap;">
            ${!isConfirmed && !isCancelled ? `
              <button class="btn-outline" style="padding:3px 7px;font-size:.62rem;margin-right:2px;"
                      onclick="app.adminUpdateReservation('${res.id}','Confirmed')">
                <i class="fas fa-check"></i>
              </button>` : ''}
            ${!isCancelled ? `
              <button class="btn-outline" style="padding:3px 7px;font-size:.62rem;border-color:var(--danger);color:var(--danger);"
                      onclick="app.adminUpdateReservation('${res.id}','Cancelled')">
                <i class="fas fa-times"></i>
              </button>` : '<span style="color:var(--text-muted);font-size:.7rem;">—</span>'}
          </td>
        </tr>`;
    }).join('');
  }
}

window.UIEngine = new UIEngine();

/**
 * Foodies - Firestore Data Layer
 * ================================
 * Replaces all MongoDB/Express /api/ routes.
 * Every function maps 1-to-1 to what the old REST API did.
 *
 * Collections used:
 *   dishes        — menu items  (seeded from data.js on first load)
 *   categories    — menu categories
 *   chefs         — chef profiles
 *   gallery       — gallery items
 *   reviews       — customer reviews
 *   offers        — promo offers
 *   coupons       — discount codes
 *   deliveryZones — delivery area info
 *   orders        — customer orders
 *   reservations  — table bookings
 *   users         — user profiles (role, points, wishlist, etc.)
 *   contacts      — contact form submissions
 */

import {
  db
} from './firebase.js';

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment,
  writeBatch
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// ─────────────────────────────────────────────────
// HELPER — generate readable order IDs  (FD-XXXXX)
// ─────────────────────────────────────────────────
function generateOrderId() {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = 'FD-';
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function generateResId() {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = 'RES-';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// ─────────────────────────────────────────────────
// SEED — runs once to populate Firestore from data.js
// ─────────────────────────────────────────────────
export async function seedFirestoreIfEmpty() {
  try {
    // Check if dishes already seeded
    const dishSnap = await getDocs(collection(db, 'dishes'));
    if (!dishSnap.empty) return; // Already seeded

    console.log('Seeding Firestore with initial data...');
    const batch = writeBatch(db);

    // Seed categories
    const CATS = window.MENU_CATEGORIES || [];
    CATS.forEach(cat => {
      batch.set(doc(db, 'categories', cat.id), cat);
    });

    // Seed dishes
    const DISHES = window.DISHES || [];
    DISHES.forEach(dish => {
      batch.set(doc(db, 'dishes', dish.id), dish);
    });

    // Seed chefs
    const CHEFS = window.CHEFS || [];
    CHEFS.forEach(chef => {
      batch.set(doc(db, 'chefs', chef.id), chef);
    });

    // Seed gallery
    const GALLERY = window.GALLERY_ITEMS || [];
    GALLERY.forEach((item, i) => {
      batch.set(doc(db, 'gallery', `gallery-${i}`), item);
    });

    // Seed reviews
    const REVIEWS = window.REVIEWS || [];
    REVIEWS.forEach(rev => {
      batch.set(doc(db, 'reviews', rev.id), rev);
    });

    // Seed offers
    const OFFERS = window.OFFERS || [];
    OFFERS.forEach(offer => {
      batch.set(doc(db, 'offers', offer.id), offer);
    });

    // Seed coupons
    const COUPONS = window.COUPONS || [];
    COUPONS.forEach(coupon => {
      batch.set(doc(db, 'coupons', coupon.code), coupon);
    });

    // Seed delivery zones
    const ZONES = window.DELIVERY_ZONES || [];
    ZONES.forEach(zone => {
      batch.set(doc(db, 'deliveryZones', zone.zip), zone);
    });

    await batch.commit();
    console.log('Firestore seeding complete!');
  } catch (err) {
    console.warn('Firestore seeding failed (may already exist):', err.message);
  }
}

// ─────────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────────
export async function getCategories() {
  const snap = await getDocs(collection(db, 'categories'));
  return snap.docs.map(d => d.data());
}

// ─────────────────────────────────────────────────
// DISHES
// ─────────────────────────────────────────────────
export async function getDishes() {
  const snap = await getDocs(collection(db, 'dishes'));
  return snap.docs.map(d => d.data());
}

export async function getDishById(id) {
  const snap = await getDoc(doc(db, 'dishes', id));
  return snap.exists() ? snap.data() : null;
}

export async function createDish(data) {
  await setDoc(doc(db, 'dishes', data.id), {
    ...data,
    rating: data.rating || 4.5,
    reviewsCount: data.reviewsCount || 0,
    createdAt: serverTimestamp()
  });
  return data;
}

export async function updateDish(id, data) {
  await updateDoc(doc(db, 'dishes', id), { ...data, updatedAt: serverTimestamp() });
  return data;
}

export async function deleteDish(id) {
  await deleteDoc(doc(db, 'dishes', id));
}

// ─────────────────────────────────────────────────
// CHEFS
// ─────────────────────────────────────────────────
export async function getChefs() {
  const snap = await getDocs(collection(db, 'chefs'));
  return snap.docs.map(d => d.data());
}

// ─────────────────────────────────────────────────
// GALLERY
// ─────────────────────────────────────────────────
export async function getGallery() {
  const snap = await getDocs(collection(db, 'gallery'));
  return snap.docs.map(d => d.data());
}

// ─────────────────────────────────────────────────
// REVIEWS
// ─────────────────────────────────────────────────
export async function getReviews() {
  const snap = await getDocs(collection(db, 'reviews'));
  return snap.docs.map(d => d.data());
}

export async function likeReview(reviewId) {
  const ref = doc(db, 'reviews', reviewId);
  await updateDoc(ref, { likes: increment(1) });
  const updated = await getDoc(ref);
  return updated.data().likes;
}

// ─────────────────────────────────────────────────
// OFFERS
// ─────────────────────────────────────────────────
export async function getOffers() {
  const snap = await getDocs(collection(db, 'offers'));
  return snap.docs.map(d => d.data());
}

// ─────────────────────────────────────────────────
// COUPONS
// ─────────────────────────────────────────────────
export async function getCoupons() {
  const snap = await getDocs(collection(db, 'coupons'));
  return snap.docs.map(d => d.data());
}

export async function validateCoupon(code) {
  const snap = await getDoc(doc(db, 'coupons', code.toUpperCase()));
  return snap.exists() ? snap.data() : null;
}

// ─────────────────────────────────────────────────
// DELIVERY ZONES
// ─────────────────────────────────────────────────
export async function getDeliveryZones() {
  const snap = await getDocs(collection(db, 'deliveryZones'));
  return snap.docs.map(d => d.data());
}

// ─────────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────────
export async function createOrder(orderData, currentUser) {
  const { items, couponCode, address, paymentMethod, specialInstructions } = orderData;

  // Verify prices using Firestore dishes
  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const dish = await getDishById(item.dishId);
    if (!dish) throw new Error(`Dish not found: ${item.dishId}`);
    const itemPrice = dish.price * (1 - (dish.discount || 0) / 100);
    subtotal += itemPrice * item.qty;
    orderItems.push({
      dishId: dish.id,
      name:   dish.name,
      price:  itemPrice,
      qty:    item.qty
    });
  }

  // Apply coupon
  let discount = 0;
  let couponApplied = null;
  if (couponCode) {
    const coupon = await validateCoupon(couponCode);
    if (coupon) {
      couponApplied = coupon.code;
      discount = coupon.type === 'percentage'
        ? subtotal * (coupon.value / 100)
        : coupon.value;
    }
  }

  const discountedSubtotal = Math.max(0, subtotal - discount);
  const tax              = discountedSubtotal * 0.08;
  const deliveryCharges  = subtotal > 50 ? 0 : 5.00;
  const packaging        = 2.00;
  const total            = discountedSubtotal + tax + deliveryCharges + packaging;

  const orderId = generateOrderId();

  const order = {
    id:                  orderId,
    userId:              currentUser ? currentUser.uid : null,
    customerName:        currentUser ? (currentUser.displayName || currentUser.name || 'Diner') : 'Guest Diner',
    email:               currentUser ? currentUser.email : 'hello@foodies.com',
    items:               orderItems,
    coupon:              couponApplied,
    subtotal,
    tax,
    deliveryCharges,
    packaging,
    total,
    address,
    paymentMethod:       paymentMethod || 'cash',
    paymentStatus:       paymentMethod === 'cash' ? 'Unpaid' : 'Paid',
    specialInstructions: specialInstructions || '',
    status:              'Pending',
    deliveryTime:        '30-40 mins',
    createdAt:           serverTimestamp()
  };

  // Save order with readable ID as document ID
  await setDoc(doc(db, 'orders', orderId), order);

  // Award loyalty points to logged-in user
  if (currentUser) {
    const pointsEarned = Math.round(total * 10);
    await updateUserPoints(currentUser.uid, pointsEarned, address);
  }

  return order;
}

export async function getOrderById(orderId) {
  const snap = await getDoc(doc(db, 'orders', orderId));
  return snap.exists() ? snap.data() : null;
}

export async function getOrdersByUser(uid) {
  // Simple where query — no composite index needed
  // Sort client-side to avoid Firestore index requirement
  const q = query(
    collection(db, 'orders'),
    where('userId', '==', uid)
  );
  const snap = await getDocs(q);
  const orders = snap.docs.map(d => d.data());
  // Sort by createdAt descending (newest first)
  return orders.sort((a, b) => {
    const ta = a.createdAt?.toMillis?.() || 0;
    const tb = b.createdAt?.toMillis?.() || 0;
    return tb - ta;
  });
}

export async function getAllOrders() {
  // Get all orders, sort client-side — no index needed
  const snap = await getDocs(collection(db, 'orders'));
  const orders = snap.docs.map(d => d.data());
  return orders.sort((a, b) => {
    const ta = a.createdAt?.toMillis?.() || 0;
    const tb = b.createdAt?.toMillis?.() || 0;
    return tb - ta;
  });
}

export async function updateOrderStatus(orderId, status) {
  const ref = doc(db, 'orders', orderId);
  const updates = { status };
  if (status === 'Delivered') updates.paymentStatus = 'Paid';
  await updateDoc(ref, updates);
}

// ─────────────────────────────────────────────────
// RESERVATIONS
// ─────────────────────────────────────────────────
export async function createReservation(data, currentUser) {
  const { name, email, phone, date, time, guests, type, specialRequest } = data;
  const resId = generateResId();

  const reservation = {
    id:             resId,
    userId:         currentUser ? currentUser.uid : null,
    name,
    email,
    phone,
    date,
    time,
    guests:         parseInt(guests),
    type:           type || 'Indoor',
    specialRequest: specialRequest || '',
    status:         'Pending',
    createdAt:      serverTimestamp()
  };

  await setDoc(doc(db, 'reservations', resId), reservation);

  // Award 50 loyalty points for booking
  if (currentUser) {
    await updateUserPoints(currentUser.uid, 50, null);
  }

  return reservation;
}

export async function getReservationsByUser(uid) {
  // Simple where query — sort client-side
  const q = query(
    collection(db, 'reservations'),
    where('userId', '==', uid)
  );
  const snap = await getDocs(q);
  const reservations = snap.docs.map(d => d.data());
  return reservations.sort((a, b) => {
    const ta = a.createdAt?.toMillis?.() || 0;
    const tb = b.createdAt?.toMillis?.() || 0;
    return tb - ta;
  });
}

export async function getAllReservations() {
  // Get all, sort client-side
  const snap = await getDocs(collection(db, 'reservations'));
  const reservations = snap.docs.map(d => d.data());
  return reservations.sort((a, b) => {
    const ta = a.createdAt?.toMillis?.() || 0;
    const tb = b.createdAt?.toMillis?.() || 0;
    return tb - ta;
  });
}

export async function updateReservationStatus(resId, status) {
  await updateDoc(doc(db, 'reservations', resId), { status });
}

// ─────────────────────────────────────────────────
// USER PROFILES
// ─────────────────────────────────────────────────
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

export async function createUserProfile(uid, data) {
  const profile = {
    uid,
    name:           data.name || 'Diner',
    email:          data.email || '',
    role:           data.role || 'Customer',
    vipStatus:      'Regular',
    points:         0,
    savedAddresses: [],
    wishlist:       [],
    createdAt:      serverTimestamp()
  };
  await setDoc(doc(db, 'users', uid), profile);
  return profile;
}

export async function updateUserProfile(uid, data) {
  await updateDoc(doc(db, 'users', uid), { ...data, updatedAt: serverTimestamp() });
}

export async function updateUserPoints(uid, pointsToAdd, address) {
  const ref     = doc(db, 'users', uid);
  const snap    = await getDoc(ref);
  if (!snap.exists()) return;

  const user       = snap.data();
  const newPoints  = (user.points || 0) + pointsToAdd;

  let vipStatus = user.vipStatus || 'Regular';
  if (newPoints >= 5000)      vipStatus = 'VIP Diner';
  else if (newPoints >= 2000) vipStatus = 'Gold Member';
  else if (newPoints >= 1000) vipStatus = 'Silver Member';
  else if (newPoints >= 500)  vipStatus = 'Bronze Member';

  const updates = { points: newPoints, vipStatus };

  if (address && !(user.savedAddresses || []).includes(address)) {
    updates.savedAddresses = [...(user.savedAddresses || []), address];
  }

  await updateDoc(ref, updates);
}

export async function toggleWishlist(uid, dishId) {
  const ref  = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return [];

  const user     = snap.data();
  const wishlist = user.wishlist || [];
  const index    = wishlist.indexOf(dishId);

  let newWishlist;
  if (index !== -1) {
    newWishlist = wishlist.filter(id => id !== dishId);
  } else {
    newWishlist = [...wishlist, dishId];
  }

  await updateDoc(ref, { wishlist: newWishlist });
  return newWishlist;
}

export async function getAllUsers() {
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs.map(d => d.data());
}

// ─────────────────────────────────────────────────
// ADMIN STATS
// ─────────────────────────────────────────────────
export async function getAdminStats() {
  const [ordersSnap, usersSnap, dishesSnap] = await Promise.all([
    getDocs(collection(db, 'orders')),
    getDocs(collection(db, 'users')),
    getDocs(collection(db, 'dishes'))
  ]);

  const orders       = ordersSnap.docs.map(d => d.data());
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  return {
    totalOrders:    orders.length,
    totalRevenue:   parseFloat(totalRevenue.toFixed(2)),
    totalUsers:     usersSnap.size,
    totalMenuItems: dishesSnap.size
  };
}

// ─────────────────────────────────────────────────
// KITCHEN — advance order status
// ─────────────────────────────────────────────────
const STATUS_PIPELINE = ['Pending', 'Preparing', 'Cooking', 'Packed', 'Out For Delivery', 'Delivered'];

export async function advanceOrderStatus(orderId) {
  const ref  = doc(db, 'orders', orderId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error('Order not found');

  const order      = snap.data();
  const currentIdx = STATUS_PIPELINE.indexOf(order.status);
  if (currentIdx === -1 || currentIdx === STATUS_PIPELINE.length - 1) {
    throw new Error('Order already delivered or invalid status');
  }

  const nextStatus = STATUS_PIPELINE[currentIdx + 1];
  const updates    = { status: nextStatus };
  if (nextStatus === 'Delivered') updates.paymentStatus = 'Paid';

  await updateDoc(ref, updates);
  return nextStatus;
}

export async function getKitchenOrders() {
  // Get all orders, filter and sort client-side — no composite index needed
  const snap = await getDocs(collection(db, 'orders'));
  const orders = snap.docs.map(d => d.data());
  return orders
    .filter(o => o.status !== 'Delivered')
    .sort((a, b) => {
      const ta = a.createdAt?.toMillis?.() || 0;
      const tb = b.createdAt?.toMillis?.() || 0;
      return ta - tb; // oldest first for kitchen
    });
}

// ─────────────────────────────────────────────────
// CONTACT FORM
// ─────────────────────────────────────────────────
export async function submitContact(data) {
  const ref = await addDoc(collection(db, 'contacts'), {
    ...data,
    createdAt: serverTimestamp()
  });
  return ref.id;
}

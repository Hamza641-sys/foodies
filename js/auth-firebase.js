/**
 * Foodies - Firebase Authentication Layer
 * =========================================
 * Replaces JWT-based auth (routes/auth.js + middleware/)
 *
 * Exports:
 *   registerUser(name, email, password)
 *   loginUser(email, password)
 *   loginWithGoogle()
 *   logoutUser()
 *   onAuthChange(callback)     — listen for auth state changes
 *   getCurrentUser()           — returns Firebase user or null
 *   isAdmin(uid)               — checks role in Firestore users collection
 */

import { auth, db }                        from './firebase.js';
import { getUserProfile, createUserProfile } from './firestore.js';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

import {
  doc,
  getDoc
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const googleProvider = new GoogleAuthProvider();

// ─────────────────────────────────────────────────
// REGISTER (Email + Password)
// ─────────────────────────────────────────────────
export async function registerUser(name, email, password) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user       = credential.user;

  // Set display name in Firebase Auth
  await updateProfile(user, { displayName: name });

  // Create user document in Firestore
  const profile = await createUserProfile(user.uid, { name, email, role: 'Customer' });

  return { user, profile };
}

// ─────────────────────────────────────────────────
// LOGIN (Email + Password)
// ─────────────────────────────────────────────────
export async function loginUser(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const user       = credential.user;
  const profile    = await getUserProfile(user.uid);
  return { user, profile };
}

// ─────────────────────────────────────────────────
// LOGIN WITH GOOGLE
// ─────────────────────────────────────────────────
export async function loginWithGoogle() {
  const result  = await signInWithPopup(auth, googleProvider);
  const user    = result.user;

  // Create Firestore profile if first time
  let profile = await getUserProfile(user.uid);
  if (!profile) {
    profile = await createUserProfile(user.uid, {
      name:  user.displayName || 'Google Diner',
      email: user.email,
      role:  'Customer'
    });
  }

  return { user, profile };
}

// ─────────────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────────────
export async function logoutUser() {
  await signOut(auth);
}

// ─────────────────────────────────────────────────
// AUTH STATE LISTENER
// ─────────────────────────────────────────────────
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

// ─────────────────────────────────────────────────
// GET CURRENT USER (sync)
// ─────────────────────────────────────────────────
export function getCurrentUser() {
  return auth.currentUser;
}

// ─────────────────────────────────────────────────
// ADMIN CHECK — reads role from Firestore users doc
// ─────────────────────────────────────────────────
export async function isAdmin(uid) {
  if (!uid) {
    console.warn('isAdmin: no uid provided');
    return false;
  }
  try {
    console.log('isAdmin: checking uid:', uid);
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) {
      console.warn('isAdmin: user document not found for uid:', uid);
      return false;
    }
    const role = snap.data().role;
    console.log('isAdmin: role found =', role);
    return role === 'admin' || role === 'Manager';
  } catch (e) {
    console.error('isAdmin: Firestore read failed:', e.code, e.message);
    return false;
  }
}

// ─────────────────────────────────────────────────
// GET FULL PROFILE for currently logged-in user
// ─────────────────────────────────────────────────
export async function getMyProfile() {
  const user = auth.currentUser;
  if (!user) return null;
  const profile = await getUserProfile(user.uid);
  return profile
    ? { ...profile, uid: user.uid, email: user.email }
    : null;
}

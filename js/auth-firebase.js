import { auth, db } from './firebase.js';
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

export async function registerUser(name, email, password) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user = credential.user;
  await updateProfile(user, { displayName: name });
  const profile = await createUserProfile(user.uid, { name, email, role: 'Customer' });
  return { user, profile };
}

export async function loginUser(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const user = credential.user;
  const profile = await getUserProfile(user.uid);
  return { user, profile };
}

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  let profile = await getUserProfile(user.uid);
  if (!profile) {
    profile = await createUserProfile(user.uid, {
      name: user.displayName || 'Google Diner',
      email: user.email,
      role: 'Customer'
    });
  }
  return { user, profile };
}

export async function logoutUser() {
  await signOut(auth);
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

export function getCurrentUser() {
  return auth.currentUser;
}

// ADMIN CHECK — email based, no Firestore needed
export async function isAdmin(uid) {
  const user = auth.currentUser;
  if (!user) return false;
  // Direct email check — fastest and most reliable
  if (user.email === 'admin@foodies.com') return true;
  if (user.email === 'admin@client.com') return true;
  // Firestore role check for other admins
  try {
    const snap = await getDoc(doc(db, 'users', user.uid));
    if (snap.exists() && (snap.data().role === 'admin' || snap.data().role === 'Manager')) {
      return true;
    }
  } catch (e) {}
  return false;
}

export async function getMyProfile() {
  const user = auth.currentUser;
  if (!user) return null;
  const profile = await getUserProfile(user.uid);
  return profile ? { ...profile, uid: user.uid, email: user.email } : null;
}

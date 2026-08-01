/**
 * Foodies - Firebase Configuration & Initialization
 * ===================================================
 * Replace the firebaseConfig values below with YOUR
 * project's config from:
 *   Firebase Console → Project Settings → Your Apps → SDK setup
 *
 * HOW TO GET YOUR CONFIG:
 * 1. Go to https://console.firebase.google.com
 * 2. Open your project
 * 3. Click the gear icon → Project Settings
 * 4. Scroll to "Your apps" → click your web app (</>)
 * 5. Copy the firebaseConfig object and paste it below
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth }       from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getFirestore }  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// ── YOUR FIREBASE CONFIG ──────────────────────────
// Replace ALL values below with your own project config
const firebaseConfig = {
  apiKey:            "AIzaSyAB75IT2kauzAYAQ4djd4DID3pvfOXGaWs",
  authDomain:        "foodies-app-94531.firebaseapp.com",
  projectId:         "foodies-app-94531",
  storageBucket:     "foodies-app-94531.firebasestorage.app",
  messagingSenderId: "734711711721",
  appId:             "1:734711711721:web:c748ec1dbd8dd614c22d78",
  measurementId:     "G-ZTQ8TYWGRF"
};
// ─────────────────────────────────────────────────

const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db   = getFirestore(firebaseApp);
export default firebaseApp;

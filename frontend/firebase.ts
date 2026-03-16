import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';

import firebaseConfig from './firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Google provider
export const googleProvider = new GoogleAuthProvider();

// Restrict Google login to nitc domain
googleProvider.setCustomParameters({
  hd: 'nitc.ac.in'
});


// ========================================================
// Google Login Function
// ========================================================

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Additional domain safety check
  if (!user.email?.endsWith('@nitc.ac.in')) {
    await signOut(auth);
    throw new Error('Only NITC email accounts are allowed');
  }

  await ensureUserDocument(user);

  return user;
}


// ========================================================
// Ensure Firestore User Document Exists
// ========================================================

async function ensureUserDocument(user: User) {
  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    await setDoc(userRef, {
      id: user.uid,
      name: user.displayName ?? '',
      email: user.email,
      role: 'student', // default role
      department: '',
      status: 'Active',
      avatar: user.photoURL ?? '',
      hasPasswordSet: false,
      createdAt: serverTimestamp()
    });
  }
}
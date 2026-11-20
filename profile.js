import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { auth, db, firebaseConfigured } from "./firebase.js";

const firebaseStatus = document.getElementById("firebase-status");
const accountAccess = document.getElementById("account-access");
const profileSetup = document.getElementById("profile-setup");
const profileComplete = document.getElementById("profile-complete");
const signUpStatus = document.getElementById("sign-up-status");
const signInStatus = document.getElementById("sign-in-status");
const profileStatus = document.getElementById("profile-status");

if (!firebaseConfigured) {
  firebaseStatus.textContent = "Account setup is not configured yet. Add your Firebase web app settings to firebase-config.js, enable Email/Password sign-in, and set up Firestore.";
} else {
  firebaseStatus.hidden = true;
  accountAccess.hidden = false;

  document.getElementById("sign-up-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    signUpStatus.textContent = "";
    const formData = new FormData(event.currentTarget);

    try {
      await createUserWithEmailAndPassword(auth, formData.get("email"), formData.get("password"));
    } catch (error) {
      signUpStatus.textContent = `Could not create your account: ${error.message}`;
    }
  });

  document.getElementById("sign-in-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    signInStatus.textContent = "";
    const formData = new FormData(event.currentTarget);

    try {
      await signInWithEmailAndPassword(auth, formData.get("email"), formData.get("password"));
    } catch (error) {
      const signInMessages = {
        "auth/invalid-credential": "The email or password is incorrect.",
        "auth/user-disabled": "This account has been disabled.",
        "auth/too-many-requests": "Too many sign-in attempts. Wait a moment and try again.",
        "auth/network-request-failed": "Could not connect. Check your internet connection and try again.",
        "auth/operation-not-allowed": "Email/password sign-in is not enabled in Firebase."
      };
      signInStatus.textContent = signInMessages[error.code] || `Could not sign in: ${error.message}`;
    }
  });

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      profileStatus.textContent = `Could not sign out: ${error.message}`;
    }
  };
  document.getElementById("sign-out-button").addEventListener("click", handleSignOut);
  document.getElementById("complete-sign-out-button").addEventListener("click", handleSignOut);

  document.getElementById("profile-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    profileStatus.textContent = "";
    const user = auth.currentUser;

    if (!user) {
      profileStatus.textContent = "Your session ended. Sign in again to save your profile.";
      return;
    }

    const formData = new FormData(event.currentTarget);
    const profile = {
      uid: user.uid,
      fullName: formData.get("fullName").trim(),
      email: user.email,
      phone: formData.get("phone").trim(),
      studentNumber: formData.get("studentNumber").trim(),
      university: formData.get("university"),
      studyYear: formData.get("studyYear"),
      createdAt: serverTimestamp()
    };

    try {
      await setDoc(doc(db, "profiles", user.uid), profile);
      profileSetup.hidden = true;
      profileComplete.hidden = false;
    } catch (error) {
      profileStatus.textContent = `Could not save your profile: ${error.message}`;
    }
  });

  onAuthStateChanged(auth, async (user) => {
    accountAccess.hidden = Boolean(user);
    profileSetup.hidden = true;
    profileComplete.hidden = true;

    if (!user) {
      return;
    }

    document.getElementById("signed-in-email").textContent = `Signed in as ${user.email}.`;

    try {
      const profileSnapshot = await getDoc(doc(db, "profiles", user.uid));
      if (profileSnapshot.exists()) {
        profileComplete.hidden = false;
      } else {
        profileSetup.hidden = false;
      }
    } catch (error) {
      profileSetup.hidden = false;
      profileStatus.textContent = `Could not load your profile: ${error.message}`;
    }
  });
}

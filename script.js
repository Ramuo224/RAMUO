// script.js — RAMUO (Firebase v9 modulaire)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

/**
 * 1) Remplace cette configuration par celle de TON projet Firebase
 *    Firebase Console > Project Settings > Your apps > SDK setup and configuration
 */
const firebaseConfig = {
  apiKey: "REMPLACE_MOI",
  authDomain: "REMPLACE_MOI.firebaseapp.com",
  projectId: "REMPLACE_MOI",
  // Optionnel: storageBucket, messagingSenderId, appId
};

// 2) Initialisation Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 3) Gestion des vues (navigation simple)
const homeSection = document.getElementById("homeSection");
const authSection = document.getElementById("authSection");
const chatSection = document.getElementById("chatSection");

function show(section) {
  homeSection.classList.add("hidden");
  authSection.classList.add("hidden");
  chatSection.classList.add("hidden");
  section.classList.remove("hidden");
  // Met à jour l'état des onglets
  document.querySelectorAll(".nav .link").forEach((b) => b.classList.remove("active"));
  if (section === homeSection) document.getElementById("btnHome").classList.add("active");
  if (section === authSection) document.getElementById("btnAuth").classList.add("active");
  if (section === chatSection) document.getElementById("btnChat").classList.add("active");
}

// 4) Navigation
document.getElementById("btnHome").addEventListener("click", () => show(homeSection));
document.getElementById("btnAuth").addEventListener("click", () => show(authSection));
document.getElementById("btnChat").addEventListener("click", () => show(chatSection));
document.getElementById("btnStart").addEventListener("click", () => show(authSection));

// 5) Auth — Inscription / Connexion / Déconnexion
const regEmail = document.getElementById("regEmail");
const regPassword = document.getElementById("regPassword");
const logEmail = document.getElementById("logEmail");
const logPassword = document.getElementById("logPassword");
const btnRegister = document.getElementById("btnRegister");
const btnLogin = document.getElementById("btnLogin");
const btnLogout = document.getElementById("btnLogout");
const userStatus = document.getElementById("userStatus");

btnRegister.addEventListener("click", async () => {
  try {
    await createUserWithEmailAndPassword(auth, regEmail.value, regPassword.value);
    alert("Inscription réussie. Bienvenue sur RAMUO !");
  } catch (e) {
    alert("Erreur inscription: " + (e.message || e));
  }
});

btnLogin.addEventListener("click", async () => {
  try {
    await signInWithEmailAndPassword(auth, logEmail.value, logPassword.value);
    show(chatSection);
  } catch (e) {
    alert("Erreur connexion: " + (e.message || e));
  }
});

btnLogout.addEventListener("click", async () => {
  try {
    await signOut(auth);
  } catch (e) {
    alert("Erreur déconnexion: " + (e.message || e));
  }
});

// 6) État utilisateur
onAuthStateChanged(auth, (user) => {
  if (user) {
    userStatus.textContent = `Connecté: ${user.email}`;
    btnLogout.classList.remove("hidden");
  } else {
    userStatus.textContent = "Non connecté";
    btnLogout.classList.add("hidden");
  }
});

// 7) Chat temps réel (salon public de démo)
const messageInput = document.getElementById("messageInput");
const profileNameInput = document.getElementById("profileName");
const btnSend = document.getElementById("btnSend");
const messagesDiv = document.getElementById("messages");

// Flux des messages ordonnés par date
const messagesRef = collection(db, "messages");
const messagesQuery = query(messagesRef, orderBy("createdAt", "asc"));

onSnapshot(messagesQuery, (snapshot) => {
  messagesDiv.innerHTML = "";
  snapshot.forEach((doc) => {
    const data = doc.data();
    const div = document.createElement("div");
    div.className = "message";
    const who = data.displayName || data.user || "Anonyme";
    const when = data.createdAt?.toDate?.().toLocaleString?.() || "";
    div.innerHTML = `
      <div class="meta">${who} • ${when}</div>
      <div>${data.text || ""}</div>
    `;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
});

btnSend.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) {
    alert("Tu dois être connecté pour envoyer des messages.");
    show(authSection);
    return;
  }
  const text = messageInput.value.trim();
  const displayName = profileNameInput.value.trim();
  if (!text) return;

  try {
    await addDoc(messagesRef, {
      text,
      user: user.email,
      displayName: displayName || null,
      createdAt: serverTimestamp(),
    });
    messageInput.value = "";
  } catch (e) {
    alert("Erreur envoi: " + (e.message || e));
  }
});
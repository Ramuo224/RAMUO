// Import Firebase depuis le CDN (version web)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { 
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
  signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { 
  getDatabase, ref, push, onChildAdded 
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";

// Configuration Firebase (corrigée)
const firebaseConfig = {
  apiKey: "AIzaSyBTPMMvThUYN5jQqtN3MCi7Fy2IK3V6bHg",
  authDomain: "ramuo-352c6.firebaseapp.com",
  databaseURL: "https://ramuo-352c6-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ramuo-352c6",
  storageBucket: "ramuo-352c6.appspot.com",   // ✅ corrigé
  messagingSenderId: "458890962598",
  appId: "1:458890962598:web:705493b81db4f40e247667",
  measurementId: "G-SNCEZETYX2"
};

// Initialisation
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Exemple inscription
document.getElementById("btnRegister").addEventListener("click", async () => {
  try {
    await createUserWithEmailAndPassword(auth,
      document.getElementById("regEmail").value,
      document.getElementById("regPassword").value
    );
    alert("Inscription réussie !");
  } catch (e) {
    alert("Erreur inscription : " + e.message);
  }
});

// Exemple connexion
document.getElementById("btnLogin").addEventListener("click", async () => {
  try {
    await signInWithEmailAndPassword(auth,
      document.getElementById("logEmail").value,
      document.getElementById("logPassword").value
    );
    alert("Connexion réussie !");
    document.getElementById("chatSection").classList.remove("hidden");
  } catch (e) {
    alert("Erreur connexion : " + e.message);
  }
});

// Déconnexion
document.getElementById("btnLogout").addEventListener("click", async () => {
  await signOut(auth);
  alert("Déconnecté !");
  document.getElementById("chatSection").classList.add("hidden");
});

// État utilisateur
onAuthStateChanged(auth, (user) => {
  const userStatus = document.getElementById("userStatus");
  if (user) {
    userStatus.textContent = `Connecté: ${user.email}`;
    document.getElementById("btnLogout").classList.remove("hidden");
  } else {
    userStatus.textContent = "Non connecté";
    document.getElementById("btnLogout").classList.add("hidden");
  }
});

// Chat en temps réel
const messagesDiv = document.getElementById("messages");
document.getElementById("btnSend").addEventListener("click", async () => {
  const text = document.getElementById("messageInput").value;
  const user = auth.currentUser;
  if (!user) {
    alert("Connecte-toi pour envoyer un message !");
    return;
  }
  const displayName = document.getElementById("profileName").value || user.email;
  push(ref(db, "messages"), {
    text,
    user: user.email,
    displayName,
    createdAt: Date.now()
  });
  document.getElementById("messageInput").value = "";
});

onChildAdded(ref(db, "messages"), (snapshot) => {
  const data = snapshot.val();
  const div = document.createElement("div");
  div.className = "message";
  div.innerHTML = `<b>${data.displayName}:</b> ${data.text}`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

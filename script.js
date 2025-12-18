// script.js — RAMUO avec Realtime Database
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  getDatabase,
  ref,
  push,
  onChildAdded,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// ⚡ Configuration Firebase (remplace par tes infos)
<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBTPMMvThUYN5jQqtN3MCi7Fy2IK3V6bHg",
    authDomain: "ramuo-352c6.firebaseapp.com",
    databaseURL: "https://ramuo-352c6-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "ramuo-352c6",
    storageBucket: "ramuo-352c6.firebasestorage.app",
    messagingSenderId: "458890962598",
    appId: "1:458890962598:web:705493b81db4f40e247667",
    measurementId: "G-SNCEZETYX2"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Auth (inscription/connexion)
document.getElementById("btnRegister").addEventListener("click", async () => {
  await createUserWithEmailAndPassword(auth,
    document.getElementById("regEmail").value,
    document.getElementById("regPassword").value
  );
  alert("Inscription réussie !");
});

document.getElementById("btnLogin").addEventListener("click", async () => {
  await signInWithEmailAndPassword(auth,
    document.getElementById("logEmail").value,
    document.getElementById("logPassword").value
  );
  alert("Connexion réussie !");
});

document.getElementById("btnLogout").addEventListener("click", async () => {
  await signOut(auth);
  alert("Déconnecté !");
});

// Chat (messages en temps réel)
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
    createdAt: Date.now(),
  });
  document.getElementById("messageInput").value = "";
});

// Affichage des messages en direct
onChildAdded(ref(db, "messages"), (snapshot) => {
  const data = snapshot.val();
  const div = document.createElement("div");
  div.className = "message";
  div.innerHTML = `<div class="meta">${data.displayName} • ${new Date(data.createdAt).toLocaleString()}</div>
                   <div>${data.text}</div>`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});



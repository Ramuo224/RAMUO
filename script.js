import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { 
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
  signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { 
  getDatabase, ref, push, onChildAdded 
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";

// ⚡ Mets ici ta configuration Firebase copiée depuis la console
const firebaseConfig = {
  apiKey: "TA_CLE_API",
  authDomain: "ramuo-352c6.firebaseapp.com",
  databaseURL: "https://ramuo-352c6-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ramuo-352c6",
  storageBucket: "ramuo-352c6.appspot.com",
  messagingSenderId: "458890962598",
  appId: "1:458890962598:web:705493b81db4f40e247667",
  measurementId: "G-SNCEZETYX2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Auth
const userStatus = document.getElementById("userStatus");
const btnLogout = document.getElementById("btnLogout");

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
  document.getElementById("chatSection").classList.remove("hidden");
});

btnLogout.addEventListener("click", async () => {
  await signOut(auth);
  alert("Déconnecté !");
  document.getElementById("chatSection").classList.add("hidden");
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    userStatus.textContent = `Connecté: ${user.email}`;
    btnLogout.classList.remove("hidden");
  } else {
    userStatus.textContent = "Non connecté";
    btnLogout.classList.add("hidden");
  }
});

// Chat
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
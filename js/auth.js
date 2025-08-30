import { auth, fs } from './firebaseConfig.js'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const notyf = new Notyf({
  position: { x: 'center', y: 'top' },
  duration: 2000
});

function showRegisterSuccess() {
    notyf.success("Registered Successfully");
}

function showLoginSuccess() {
    notyf.success("Logged In Successfully");
}

function showLogoutSuccess() {
    notyf.success("Logged Out Successfully");
}

function showError(msg) {
    notyf.error(msg || "Something went wrong!");
}

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginForm');
    const signupBtn = document.getElementById('signupForm');
    const logoutBtn = document.getElementById('logout-btn');


    if (loginBtn) {
        loginBtn.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value
            const password = document.getElementById('loginPassword').value
            try {
                const userCredentials = await signInWithEmailAndPassword(auth, email, password)
                const user = userCredentials.user;
                const userDocRef = doc(fs, "users", user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const localCart = JSON.parse(localStorage.getItem("cart")) || [];
                    const firestoreCart = userData.cart || [];

                    const mergedCart = [...firestoreCart];
                    localCart.forEach(localItem => {
                        const exists = mergedCart.some(item => item.id == localItem.id);
                        if (!exists) mergedCart.push(localItem);
                    });

                    await updateDoc(userDocRef, { cart: mergedCart });

                    localStorage.setItem("cart", JSON.stringify(mergedCart));
                    localStorage.setItem("userName", userData.name);
                    localStorage.setItem("role", userData.role);
                    localStorage.setItem("userLoggedIn", true);
                    localStorage.setItem("userId", user.uid);
                    localStorage.setItem("userEmail", user.email);

                    showLoginSuccess();
                    window.location.href = "index.html";
                } else {
                    showError("User data not found!");
                }
            } catch (error) {
                showError("Incorrect email or password!");
                console.log(error.message);
            }
        })
    }

    if (signupBtn) {
        signupBtn.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById('signupName').value
            const email = document.getElementById('signupEmail').value
            const password = document.getElementById('signupPassword').value
            const role = document.getElementById('role').value

            try {
                const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
                const userObject = {
                    uid: userCredentials.user.uid,
                    email: email,
                    name: name,
                    role: role,
                    createdAt: new Date().toISOString(),
                    cart: [],
                    prescriptions: []
                }
                await setDoc(doc(fs, "users", userCredentials.user.uid), userObject)
                showRegisterSuccess();
                window.location.href = "login.html"
            } catch (error) {
                showError("Something went wrong!");
                console.log(error.message);
            }
        })
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            await signOut(auth);
            showLogoutSuccess()
            localStorage.clear();
            window.location.href = "login.html"
        })
    }
})
import { ref, get, child } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";
import { doc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js';
import { db, fs } from "./firebaseConfig.js"

const urlParams = new URLSearchParams(window.location.search)
const medId = urlParams.get("id")

const medContainer = document.getElementById("medicineDetails");

const notyf = new Notyf({
    position: { x: 'center', y: 'top' },
    duration: 2000
});

function showSuccess() {
    notyf.success("Item added to Cart");
}

function showError() {
    notyf.error("This item is already in your cart.");
}

if (!medId) {
    medContainer.innerHTML = "<p>Invalid medicine ID.</p>"
} else {
    const dbRef = ref(db);

    get(child(dbRef, `medicines/${medId}`)).then(snapshot => {
        if (snapshot.exists()) {
            const med = snapshot.val();
            medContainer.innerHTML = `
            <div class="product-card">
        <div class="left">
            <img src="https://medlineplus.gov/images/Medicines_share.jpg" alt="${med.name}">
        </div>
        <div class="right">
            <h3>${med.name}</h3>
            <p><strong>Price:</strong> ₹${med.price}</p>
            <p><strong>Brand:</strong> ${med.brand || 'Not specified'}</p>
            <p><strong>Description:</strong> ${med.description || 'No description available.'}</p>
            <p><strong>Available:</strong> ${med.available ? 'Yes ✅' : 'No ❌'}</p>
            <button id="addToCartBtn" ${!med.available ? 'disabled' : ''}>Add to Cart</button>
        </div>
    </div>`;

            const addToCartBtn = document.getElementById("addToCartBtn");
            if (addToCartBtn) {
                addToCartBtn.addEventListener("click", async () => {
                    const isLoggedIn = localStorage.getItem("userLoggedIn")
                    const userId = localStorage.getItem("userId");

                    const cart = JSON.parse(localStorage.getItem("cart")) || [];
                    const exists = cart.find(item => item.id == med.id);

                    if (!exists) {
                        cart.push(med);
                        localStorage.setItem("cart", JSON.stringify(cart));

                        if (isLoggedIn && userId) {
                            try {
                                const userRef = doc(fs, "users", userId);
                                const userSnap = await getDoc(userRef);
                                if (userSnap.exists()) {
                                    await updateDoc(userRef, { cart: cart });
                                }
                            } catch (err) {
                                console.error("Failed to update Firestore cart:", err.message);
                            }
                        }
                        showSuccess();
                    } else {
                        showError()
                    }
                });
            }
        } else {
            medContainer.innerHTML = "<p>Medicine not found.</p>";
        }
    }).catch(error => {
        medContainer.innerHTML = "<p>Error fetching medicinee details.</p>";
        console.error(error);
    })
}




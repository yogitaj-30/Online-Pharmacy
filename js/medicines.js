import { db } from './firebaseConfig.js'
import { ref, get } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js"

const searchInput = document.getElementById("searchInput");
const priceValue = document.getElementById("priceValue");
const priceFilter = document.getElementById("priceFilter");
const availabilityFilter = document.getElementById("availabilityFilter");
const medicineGrid = document.getElementById("medicineGrid");

const prevPageBtn = document.getElementById("prevPage");
const pageInfo = document.getElementById("pageInfo");
const nextPageBtn = document.getElementById("nextPage");

let allMedicines = [];
let filteredMedicines = [];
let currentPage = 1;
let itemsPerPage = 8;

const fetchMedicines = async () => {
    const snapshot = await get(ref(db, "medicines"));
    if (snapshot.exists()) {
        allMedicines = Object.values(snapshot.val());
        filteredMedicines = [...allMedicines]
        renderMedicines();
    } else {
        medicineGrid.innerHTML = "<p>No medicines found.</p>";
    }
}

const applyFilters = () => {
    const nameQuery = searchInput.value.toLowerCase();
    const maxPrice = parseInt(priceFilter.value);
    const showAvailableOnly = availabilityFilter.checked

    filteredMedicines = allMedicines.filter(med => {
        const nameMatch = med.name.toLowerCase().includes(nameQuery)
        const priceMatch = med.price <= maxPrice;
        const availableMatch = showAvailableOnly ? med.available : true;

        return nameMatch && priceMatch && availableMatch;
    });
    currentPage = 1;
    renderMedicines();
}

const renderMedicines = () => {
    medicineGrid.innerHTML = "";
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const currentItems = filteredMedicines.slice(start, end)

    currentItems.forEach(med => {
        const card = document.createElement('div');
        card.classList.add("medicine-card");
        card.innerHTML = `
        <img src="${med.image}" alt="${med.name}">
    <h4>${med.name}</h4>
    <p>₹${med.price}</p>
    <button onclick="window.location.href='medicine.html?id=${med.id-1}'">View</button>
    `;
        medicineGrid.appendChild(card);
    });

    pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(filteredMedicines.length / itemsPerPage)}`
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = end >= filteredMedicines.length;
}

searchInput.addEventListener("input", applyFilters);
priceFilter.addEventListener("input", () => {
    priceValue.textContent = priceFilter.value;
    applyFilters();
});

availabilityFilter.addEventListener("change", applyFilters)

prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderMedicines();
    }
});

nextPageBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(filteredMedicines.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderMedicines();
    }
});


fetchMedicines();


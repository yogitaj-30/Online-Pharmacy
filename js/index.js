import { ref, get, child } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js"
import { db } from "./firebaseConfig.js"

const uploadBtn = document.getElementById("uploadBtn");
const prescriptionUpload = document.getElementById("prescriptionUpload");
const fileName = document.getElementById("fileName");
const searchInput = document.getElementById('searchMed');
const suggestionList = document.getElementById("suggestionList");

uploadBtn.addEventListener("click", () => {
    prescriptionUpload.click();
});

prescriptionUpload.addEventListener("change", () => {
    if (prescriptionUpload.files.length > 0) {
        fileName.textContent = `Selected: ${prescriptionUpload.files[0].name}`;
    }
});

function debounce(func, delay) {
    let timerId;
    return function (...args) {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            func.apply(this, args)
        }, delay);
    }
}

let debouncedFetch = debounce(searchMedicines, 300);

searchInput.addEventListener("input", function (e) {
    debouncedFetch(e.target.value);
})

function searchMedicines(query) {
    if (!query) {
        suggestionList.innerHTML = "";
        return;
    }
    const dbRef = ref(db);
    get(child(dbRef, "medicines")).then(snapshot => {
        if (snapshot.exists()) {
            const data = snapshot.val()
            const results = [];
            const seenNames = new Set();

            for (let key in data) {
                const med = data[key];
                const name = med.name.toLowerCase()
                if (name.includes(query) && !seenNames.has(name)) {
                    results.push({ id: key, name: med.name });
                    seenNames.add(name);
                }
            }
            displaySuggestions(results);
        } else {
            suggestionList.style.display = "block";
            suggestionList.innerHTML = "<li>No results found</li>";
        }
    }).catch(err => {
        console.error(err);
    });
}

function displaySuggestions(results) {
    suggestionList.innerHTML = "";

    if (results.length == 0) {
        suggestionList.style.display = "block";
        suggestionList.innerHTML = "<li>No matches found</li>"
        return;
    }
    suggestionList.style.display = "block";

    results.forEach(result => {
        const li = document.createElement("li");
        li.textContent = result.name;
        li.classList.add("suggestion-item");
        li.style.cursor = "pointer";
        li.addEventListener("click", () => {
            window.location.href = `medicine.html?id=${result.id}`;
        });
        suggestionList.appendChild(li);
    });
}


document.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = localStorage.getItem("userLoggedIn");
    const name = localStorage.getItem("userName");

    const authSection = document.getElementById("authSection");
    const userSection = document.getElementById("userSection");
    const greeting = document.getElementById("greetingText");

    if (isLoggedIn && name) {
        authSection.style.display = "none";
        userSection.style.display = "inline-flex";
        greeting.textContent = `Hello, ${name}`;
    } else {
        authSection.style.display = "inline-flex";
        userSection.style.display = "none";
    }

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.clear();
            window.location.href = "login.html";
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("navLinks");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("show");
        });
    }
});

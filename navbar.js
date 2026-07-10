function toggleMenu() {
  const nav = document.getElementById("navMenu");
  nav.classList.toggle("open");
}


/* =========================
THEME SYSTEM
========================= */

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  const button = document.getElementById("themeToggle");

  if (button) {
    button.textContent = theme === "dark" ? "☀️" : "🌙";
    button.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
    );
  }
}

function toggleTheme() {
  const current =
    document.documentElement.getAttribute("data-theme") || "light";

  const next = current === "dark" ? "light" : "dark";

  localStorage.setItem("theme", next);
  applyTheme(next);
}


document.addEventListener("DOMContentLoaded", () => {

  const savedTheme = localStorage.getItem("theme");

  const systemTheme = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches
    ? "dark"
    : "light";

  applyTheme(savedTheme || systemTheme);


  const themeButton = document.getElementById("themeToggle");

  if (themeButton) {
    themeButton.addEventListener("click", toggleTheme);
  }


  // Close menu after clicking a link
  const nav = document.getElementById("navMenu");

  if (nav) {
    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
      });
    });
  }

});


// Close menu when clicking outside navbar
document.addEventListener("click", (e) => {

  const nav = document.getElementById("navMenu");
  const navbar = document.querySelector(".navbar");

  if (!navbar || !nav) return;

  if (!navbar.contains(e.target)) {
    nav.classList.remove("open");
  }

});

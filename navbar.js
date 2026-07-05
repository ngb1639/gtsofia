function toggleMenu() {
  const nav = document.getElementById("navMenu");
  nav.classList.toggle("open");
}

// Close menu after clicking a link (mobile UX improvement)
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("navMenu");

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
    });
  });
});

// Close menu when clicking outside of navbar
document.addEventListener("click", (e) => {
  const nav = document.getElementById("navMenu");
  const toggle = document.querySelector(".nav-toggle");
  const navbar = document.querySelector(".navbar");

  if (!navbar) return;

  const clickedInside = navbar.contains(e.target);

  if (!clickedInside) {
    nav.classList.remove("open");
  }
});

function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);
}

function toggleTheme() {
  const isDark = document.body.classList.contains("dark");
  applyTheme(isDark ? "light" : "dark");
}

// Auto init theme
document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("theme");

  if (saved) {
    applyTheme(saved);
    return;
  }

  // system preference fallback
  const prefersDark = window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  applyTheme(prefersDark ? "dark" : "light");
});

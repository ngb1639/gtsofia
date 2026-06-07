// Navigation functionality for multi-page app

function navigateTo(page) {
  // Hide all pages
  const pages = document.querySelectorAll('.page');
  pages.forEach(p => p.classList.remove('active'));

  // Show selected page
  const targetPage = document.getElementById(`${page}-page`);
  if (targetPage) {
    targetPage.classList.add('active');
    
    // If navigating to lines page, initialize the lines
    if (page === 'lines') {
      renderLines();
    }
  }

  // Close mobile menu
  const navbarMenu = document.getElementById('navbarMenu');
  if (navbarMenu) {
    navbarMenu.classList.remove('active');
  }

  // Scroll to top
  window.scrollTo(0, 0);
}

function toggleMobileMenu() {
  const navbarMenu = document.getElementById('navbarMenu');
  if (navbarMenu) {
    navbarMenu.classList.toggle('active');
  }
}

function handleFormSubmit(event) {
  event.preventDefault();
  
  // Get form values
  const form = event.target;
  const name = form.querySelector('input[type="text"]').value;
  const email = form.querySelector('input[type="email"]').value;
  const message = form.querySelector('textarea').value;

  // Simple validation and feedback
  if (name && email && message) {
    alert(`Thank you for your message, ${name}! We'll get back to you at ${email} soon.`);
    form.reset();
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  // Show lines page by default
  navigateTo('lines');

  // Close mobile menu when clicking on a link
  const navLinks = document.querySelectorAll('.navbar-menu a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      const navbarMenu = document.getElementById('navbarMenu');
      if (navbarMenu) {
        navbarMenu.classList.remove('active');
      }
    });
  });
});

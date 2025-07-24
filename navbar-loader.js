document.addEventListener("DOMContentLoaded", function () {
  fetch("/navbar.html")
    .then(response => response.text())
    .then(html => {
      const navContainer = document.getElementById("navbar-placeholder");
      if (navContainer) {
        navContainer.innerHTML = html;

        // Highlight current page in navbar
        const currentPath = window.location.pathname;
        const navLinks = navContainer.querySelectorAll("a.nav-link");
        navLinks.forEach(link => {
          if (link.getAttribute("href") === currentPath) {
            link.classList.add("active");
          }
        });

        // Adjust body padding for fixed navbar
        setTimeout(() => {
          const navbar = document.querySelector(".navbar");
          if (navbar) {
            const height = navbar.offsetHeight;
            document.body.style.paddingTop = height + "px";
          }
        }, 100);
      }
    });
});

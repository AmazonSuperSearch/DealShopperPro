document.addEventListener("DOMContentLoaded", function () {
  fetch("/navbar.html")
    .then(response => response.text())
    .then(html => {
      const navContainer = document.getElementById("navbar-placeholder");
      if (navContainer) {
        navContainer.innerHTML = html;

        // Wait for browser to reflow with the inserted navbar
        setTimeout(() => {
          const navbar = document.querySelector(".navbar");
          if (navbar) {
            const height = navbar.offsetHeight;
            document.body.style.paddingTop = height + "px";
          }
        }, 100); // slight delay to ensure rendering
      }
    });
});

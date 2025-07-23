document.addEventListener("DOMContentLoaded", function () {
  fetch("/navbar.html")
    .then(response => response.text())
    .then(html => {
      const navContainer = document.getElementById("navbar-placeholder");
      if (navContainer) navContainer.innerHTML = html;
    });
});

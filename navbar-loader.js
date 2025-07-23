document.addEventListener("DOMContentLoaded", function () {
  // Load the navbar
  fetch("/navbar.html")
    .then(response => response.text())
    .then(html => {
      const navContainer = document.getElementById("navbar-placeholder");
      if (navContainer) navContainer.innerHTML = html;
    });

  // Inject padding-top for fixed navbar
  const style = document.createElement("style");
  style.innerHTML = `
    body {
      padding-top: 70px;
    }
  `;
  document.head.appendChild(style);
});

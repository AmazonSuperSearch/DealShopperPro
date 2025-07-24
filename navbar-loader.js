document.addEventListener("DOMContentLoaded", () => {
  const placeholder = document.getElementById("navbar-placeholder");
  if (!placeholder) return;

  fetch("/navbar.html")
    .then(res => res.ok ? res.text() : Promise.reject("Failed to load navbar"))
    .then(html => {
      placeholder.innerHTML = html;

      // Highlight current page
      const path = window.location.pathname.replace(/\/$/, "");
      placeholder.querySelectorAll("a.nav-link").forEach(link => {
        const href = link.getAttribute("href").replace(/\/$/, "");
        if (href === path) {
          link.classList.add("active");
        }
      });

      // Adjust body padding for fixed navbar after render
      requestAnimationFrame(() => {
        const navbar = document.querySelector(".navbar");
        if (navbar) {
          document.body.style.paddingTop = `${navbar.offsetHeight}px`;
        }
      });
    })
    .catch(err => console.error("Navbar load error:", err));
});

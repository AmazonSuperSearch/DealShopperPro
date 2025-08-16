document.addEventListener("DOMContentLoaded", () => {
  const placeholder = document.getElementById("navbar-placeholder");
  if (!placeholder) return;

  fetch("/navbar.html")
    .then(res => res.ok ? res.text() : Promise.reject("Failed to load navbar"))
    .then(html => {
      placeholder.innerHTML = html;

      // ---- Active link highlighting (handles "/" vs "/index.html")
      const current = location.pathname.replace(/\/$/, "") || "/index.html";
      placeholder.querySelectorAll("a.nav-link[href]").forEach(link => {
        const href = (link.getAttribute("href") || "").replace(/\/$/, "");
        if (href === current || (current === "/index.html" && (href === "/" || href.endsWith("/index.html")))) {
          link.classList.add("active");
          link.setAttribute("aria-current", "page");
        }
      });

      // ---- Initialize Bootstrap Collapse on injected navbar
      const toggler = placeholder.querySelector(".navbar-toggler");
      const targetSel = toggler?.getAttribute("data-bs-target");
      const target = targetSel ? document.querySelector(targetSel) : null;

      if (toggler && target) {
        // If Bootstrap is available, use it; otherwise simple fallback
        if (window.bootstrap?.Collapse) {
          new bootstrap.Collapse(target, { toggle: false });
          toggler.addEventListener("click", () => {
            const inst = bootstrap.Collapse.getOrCreateInstance(target, { toggle: false });
            target.classList.contains("show") ? inst.hide() : inst.show();
          });
        } else {
          toggler.addEventListener("click", () => target.classList.toggle("show"));
        }
      }

      // ---- OPTIONAL: Tooltips on demand (idle)
      (window.requestIdleCallback || ((fn)=>setTimeout(fn,0)))(() => {
        placeholder.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
          try { window.bootstrap && new bootstrap.Tooltip(el); } catch {}
        });
      });
    })
    .catch(err => console.error("Navbar load error:", err));
});

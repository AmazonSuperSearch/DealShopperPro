// /footer-loader.js
(async () => {
  try {
    const placeholder = document.getElementById('footer-placeholder');
    if (!placeholder) return;

    // Fetch shared footer markup
    const res = await fetch('/footer.html', {
      credentials: 'same-origin',
      cache: 'no-store'
    });
    if (!res.ok) throw new Error(`Footer fetch failed: ${res.status}`);

    const html = await res.text();

    // Inject footer after the placeholder, then remove placeholder
    placeholder.insertAdjacentHTML('afterend', html);
    placeholder.remove();

    // Ensure dynamic year is set (works even if footer.html has no script)
    const y = document.getElementById('dsp-year');
    if (y) y.textContent = new Date().getFullYear();
  } catch (err) {
    // Don’t block rendering if the footer fails to load
    console.warn('[footer-loader]', err);
  }
})();

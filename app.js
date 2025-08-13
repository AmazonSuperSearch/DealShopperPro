/* App init — single entry, idempotent */
(function init() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
    return;
  }

  // --- 1) Bootstrap tooltips (safe, deduped) ---
  function initTooltips(root = document) {
    if (!window.bootstrap || typeof bootstrap.Tooltip !== 'function') return;
    root.querySelectorAll('[data-bs-toggle="tooltip"]:not([data-has-tooltip])').forEach(el => {
      new bootstrap.Tooltip(el);
      el.setAttribute('data-has-tooltip', '');
    });
  }
  initTooltips();
  // Re-init for dynamically injected nodes (e.g., navbar loader)
  const tooltipObserver = new MutationObserver(muts => {
    for (const m of muts) {
      if (m.addedNodes && m.addedNodes.length) initTooltips();
    }
  });
  tooltipObserver.observe(document.documentElement, { childList: true, subtree: true });

  // --- 2) Accordion button ↔ panel state sync ---
  // Initial sync for any panels marked .show on load
  document.querySelectorAll('.accordion-collapse[id]').forEach(panel => {
    const btn = document.querySelector(`[data-bs-target="#${panel.id}"]`);
    if (!btn) return;
    const open = panel.classList.contains('show');
    btn.classList.toggle('collapsed', !open);
    btn.setAttribute('aria-expanded', String(open));
  });
  // Live sync on Bootstrap show/hide
  document.addEventListener('show.bs.collapse', e => {
    const btn = document.querySelector(`[data-bs-target="#${e.target.id}"]`);
    if (btn) { btn.classList.remove('collapsed'); btn.setAttribute('aria-expanded','true'); }
  });
  document.addEventListener('hide.bs.collapse', e => {
    const btn = document.querySelector(`[data-bs-target="#${e.target.id}"]`);
    if (btn) { btn.classList.add('collapsed'); btn.setAttribute('aria-expanded','false'); }
  });

  // --- 3) Lite YouTube: click-to-load embeds (no cookies until click) ---
  (function initLiteYouTube() {
    const blocks = document.querySelectorAll('.yt-lite:not([data-yt-initialized])');
    blocks.forEach(el => {
      const id = el.dataset.id;
      if (!id) return;
      el.dataset.ytInitialized = 'true';
      const title = el.dataset.title || 'YouTube video';

      // Thumbnail
      el.style.backgroundImage = `url(https://i.ytimg.com/vi/${id}/hqdefault.jpg)`;

      // Play button (accessible)
      const btn = document.createElement('button');
      btn.className = 'yt-play';
      btn.setAttribute('aria-label', `Play video: ${title}`);
      el.appendChild(btn);

      el.addEventListener('click', () => {
        if (el.classList.contains('activated')) return;
        el.classList.add('activated');
        const iframe = document.createElement('iframe');
        iframe.title = title;
        iframe.loading = 'lazy';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen = true;
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&modestbranding=1&rel=0`;
        el.innerHTML = '';
        el.appendChild(iframe);
      });
    });
  })();

  // --- 4) Submit status announcer (a11y) ---
  (function initSubmitStatus() {
    const form = document.getElementById('amazon-search-form');
    const statusEl = document.getElementById('search-status');
    if (!form || !statusEl) return;
    form.addEventListener('submit', () => {
      statusEl.textContent = 'Opening Amazon results…';
      setTimeout(() => { statusEl.textContent = ''; }, 4000);
    });
  })();
})();
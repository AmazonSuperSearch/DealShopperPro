document.write(`
  <div class="d-flex justify-content-center my-4">
    <div class="dropdown">
      <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="shareDropdown" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="bi bi-share me-1"></i> Share This Page
      </button>
      <ul class="dropdown-menu text-start" aria-labelledby="shareDropdown" id="shareLinks">
        <!-- JS will populate -->
      </ul>
    </div>
  </div>
`);

const currentURL = encodeURIComponent(window.location.href);

const shareLinks = () => {
  const platforms = [
    {
      name: "Twitter",
      icon: "twitter",
      url: `https://twitter.com/intent/tweet?url=${currentURL}`
    },
    {
      name: "Facebook",
      icon: "facebook",
      url: `intent://www.facebook.com/sharer/sharer.php?u=${currentURL}#Intent;package=com.facebook.katana;scheme=https;end`
    },
    {
      name: "LinkedIn",
      icon: "linkedin",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${currentURL}`
    },
    {
      name: "Pinterest",
      icon: "pinterest",
      url: `intent://pinterest.com/pin/create/button/?url=${currentURL}#Intent;package=com.pinterest;scheme=https;end`
    },
    {
      name: "Email",
      icon: "envelope",
      url: `mailto:?subject=Check this out&body=${currentURL}`
    },
  ];

  const menu = document.getElementById('shareLinks');
  if (menu) {
    menu.innerHTML = platforms.map(p => `
      <li>
        <a class="dropdown-item" href="${p.url}" target="_blank" rel="noopener">
          <i class="bi bi-${p.icon} me-2"></i>${p.name}
        </a>
      </li>
    `).join('');
  }
};

window.addEventListener('DOMContentLoaded', shareLinks);

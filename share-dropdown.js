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
const rawURL = window.location.href;

const shareLinks = () => {
  const platforms = [
    {
      name: "Facebook",
      icon: "facebook",
      appLink: `fb://facewebmodal/f?href=https://www.facebook.com/sharer/sharer.php?u=${currentURL}`,
      webFallback: `https://www.facebook.com/sharer/sharer.php?u=${currentURL}`
    },
    {
      name: "Twitter / X",
      icon: "twitter",
      appLink: `twitter://post?message=${rawURL}`,
      webFallback: `https://twitter.com/intent/tweet?url=${currentURL}`
    },
    {
      name: "LinkedIn",
      icon: "linkedin",
      appLink: `linkedin://shareArticle?mini=true&url=${currentURL}`,
      webFallback: `https://www.linkedin.com/sharing/share-offsite/?url=${currentURL}`
    },
    {
      name: "Pinterest",
      icon: "pinterest",
      appLink: `pinterest://pin/create/button/?url=${currentURL}`,
      webFallback: `https://www.pinterest.com/pin/create/button/?url=${currentURL}`
    },
    {
      name: "Email",
      icon: "envelope",
      appLink: `mailto:?subject=Check this out&body=Take a look: ${rawURL}`,
      webFallback: null // No fallback needed
    },
  ];

  const menu = document.getElementById('shareLinks');
  if (!menu) return;

  menu.innerHTML = platforms.map(p => `
    <li>
      <a class="dropdown-item" href="${p.appLink}" onclick="${
        p.webFallback
          ? `setTimeout(() => { window.open('${p.webFallback}', '_blank'); }, 500);`
          : ''
      } return true;" rel="noopener">
        <i class="bi bi-${p.icon} me-2"></i>${p.

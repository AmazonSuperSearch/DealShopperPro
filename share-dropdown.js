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

const isAndroid = /Android/i.test(navigator.userAgent);

const shareLinks = () => {
  const platforms = [
    {
      name: "Facebook",
      icon: "facebook",
      url: isAndroid
        ? `intent://www.facebook.com/sharer/sharer.php?u=${currentURL}#Intent;package=com.facebook.katana;scheme=https;end`
        : `https://www.facebook.com/sharer/sharer.php?u=${currentURL}`
    },
    {
      name: "Twitter / X",
      icon: "twitter",
      url: isAndroid
        ? `intent://twitter.com/intent/tweet?url=${currentURL}#Intent;package=com.twitter.android;scheme=https;end`
        : `https://twitter.com/intent/tweet?url=${currentURL}`
    },
    {
      name: "LinkedIn",
      icon: "linkedin",
      url: isAndroid
        ? `intent://www.linkedin.com/sharing/share-offsite/?url=${currentURL}#Intent;package=com.linkedin.android;scheme=https;end`
        : `https://www.linkedin.com/sharing/share-offsite/?url=${currentURL}`
    },
    {
      name: "Pinterest",
      icon: "pinterest",
      url: isAndroid
        ? `intent://pinterest.com/pin/create/button/?url=${currentURL}#Intent;package=com.pinterest;scheme=https;end`
        : `https://www.pinterest.com/pin/create/button/?url=${currentURL}`
    },
    {
      name: "WhatsApp",
      icon: "whatsapp",
      url: isAndroid
        ? `intent://send?text=Check this out ${rawURL}#Intent;package=com.whatsapp;scheme=whatsapp;end`
        : `https://wa.me/?text=Check%20this%20out%20${currentURL}`
    },
    {
      name: "Messenger",
      icon: "messenger",
      url: isAndroid
        ? `intent://www.facebook.com/dialog/send?link=${currentURL}&app_id=966242223397117&redirect_uri=${currentURL}#Intent;package=com.facebook.orca;scheme=https;end`
        : `https://www.facebook.com/dialog/send?link=${currentURL}&app_id=966242223397117&redirect_uri=${currentURL}`
    },

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
      appLink: `twitter://post?message=Check this out ${rawURL}`,
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
      name: "WhatsApp",
      icon: "whatsapp",
      appLink: `whatsapp://send?text=Check this out ${rawURL}`,
      webFallback: `https://wa.me/?text=Check%20this%20out%20${currentURL}`
    },
    {
      name: "Messenger",
      icon: "messenger",
      appLink: `fb-messenger://share/?link=${currentURL}`,
      webFallback: `https://www.facebook.com/dialog/send?link=${currentURL}&app_id=966242223397117&redirect_uri=${currentURL}`
    },
    {
      name: "Telegram",
      icon: "telegram",
      appLink: `tg://msg_url?url=${currentURL}`,
      webFallback: `https://t.me/share/url?url=${c

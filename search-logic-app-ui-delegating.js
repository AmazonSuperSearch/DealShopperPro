
// --- YouTube Lite Player functionality ---
function initYouTubePlayer() {
  const ytElements = document.querySelectorAll('.yt-lite');
  ytElements.forEach(element => {
    const videoId = element.dataset.id;
    if (!videoId) return;

    element.style.backgroundImage = `url(https://i.ytimg.com/vi/${videoId}/hqdefault.jpg)`;

    const playButton = document.createElement('button');
    playButton.className = 'yt-play';
    playButton.setAttribute('aria-label', 'Play video');
    element.appendChild(playButton);

    element.addEventListener('click', function () {
      if (element.classList.contains('activated')) return;

      element.classList.add('activated');
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';

      element.innerHTML = '';
      element.appendChild(iframe);
    });
  });
}

// --- Step toggle functionality ---
function toggleStep(stepNumber) {
  const body = document.getElementById(`step${stepNumber}-body`);
  const header = document.querySelector(`[data-target="step${stepNumber}"]`);

  if (body && header) {
    const isVisible = !body.classList.contains('d-none');

    if (isVisible) {
      body.classList.add('d-none');
      header.classList.add('collapsed');
      const icon = header.querySelector('i');
      if (icon) {
        icon.classList.remove('bi-chevron-up');
        icon.classList.add('bi-chevron-down');
      }
    } else {
      body.classList.remove('d-none');
      header.classList.remove('collapsed');
      const icon = header.querySelector('i');
      if (icon) {
        icon.classList.remove('bi-chevron-down');
        icon.classList.add('bi-chevron-up');
      }
    }
  }
}

// --- Accordion functionality for FAQ ---
function toggleAccordion(accordionId) {
  const body = document.getElementById(accordionId + '-body');
  const icon = document.getElementById(accordionId + '-icon');

  if (body && icon) {
    const isVisible = !body.classList.contains('d-none');

    document.querySelectorAll('.accordion-body-mobile').forEach(acc => {
      acc.classList.add('d-none');
    });
    document.querySelectorAll('.accordion-header-mobile i').forEach(ic => {
      ic.classList.remove('bi-chevron-up');
      ic.classList.add('bi-chevron-down');
    });

    if (!isVisible) {
      body.classList.remove('d-none');
      icon.classList.remove('bi-chevron-down');
      icon.classList.add('bi-chevron-up');
    }
  }
}

// --- Progress Tracker ---
function initProgressTracker() {
  const steps = document.querySelectorAll('.step-header-mobile');
  const progressSteps = document.querySelectorAll('.progress-step-mobile');

  steps.forEach((step, index) => {
    step.addEventListener('click', () => {
      progressSteps.forEach((progStep, progIndex) => {
        progStep.classList.remove('active');
        if (progIndex <= index) {
          progStep.classList.add('completed');
        } else {
          progStep.classList.remove('completed');
        }
      });
      if (progressSteps[index]) {
        progressSteps[index].classList.add('active');
      }
    });
  });
}

// --- Checkbox handling (with touch helper) ---
function initCheckboxes() {
  document.querySelectorAll('.checkbox-input-mobile').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
      const card = this.closest('.checkbox-card-mobile');
      if (card) {
        card.classList.toggle('checked', this.checked);
      }
    });
    const card = checkbox.closest('.checkbox-card-mobile');
    if (card && checkbox.checked) {
      card.classList.add('checked');
    }
  });

  document.querySelectorAll('.checkbox-card-mobile').forEach(card => {
    card.addEventListener('click', function (e) {
      if (e.target && e.target.type === 'checkbox') return;
      const checkbox = card.querySelector('.checkbox-input-mobile');
      if (checkbox) checkbox.click();
    });
  });
}

function toggleCheckbox(checkboxId) {
  const checkbox = document.getElementById(checkboxId);
  if (checkbox) {
    checkbox.checked = !checkbox.checked;
    const card = checkbox.closest('.checkbox-card-mobile');
    if (card) card.classList.toggle('checked', checkbox.checked);
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    if (navigator.vibrate) navigator.vibrate(10);
  }
}

// --- Form UX helpers (non-blocking) ---
function setupFormValidation() {
  const searchInput = document.getElementById('mainSearchInput');
  if (searchInput) {
    const submitBtn = document.querySelector('button[type="submit"]');
    if (!submitBtn) return;
    // Do NOT hard-block empty input; let DSP/searchlogic-v2 handle empty searches gracefully
    searchInput.addEventListener('input', function () {
      // Keep button enabled; optionally add visual cue only
      submitBtn.classList.toggle('btn-disabled-visual', !this.value.trim());
    });
  }
}

function scrollToForm() {
  const form = document.getElementById('search-form');
  if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// --- Mobile share bar ---
function showShareBar() {
  const shareBar = document.getElementById('shareBar');
  if (shareBar && window.innerWidth <= 768) {
    shareBar.classList.add('show');
    setTimeout(() => {
      shareBar.classList.remove('show');
    }, 10000);
  }
}

// --- Share helpers ---
function shareWhatsApp(e) {
  e.preventDefault();
  const message = encodeURIComponent('Check out this Amazon deal finder: ' + window.location.href);
  window.open(`https://wa.me/?text=${message}`, '_blank', 'noopener');
}

function shareSMS() {
  const message = encodeURIComponent('Check out this Amazon deal finder: ' + window.location.href);
  window.location.href = `sms:?body=${message}`;
}

function copyLink(e) {
  navigator.clipboard.writeText(window.location.href).then(() => {
    const btn = e.target.closest('.share-btn');
    if (!btn) return;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="bi bi-check"></i> Copied!';
    setTimeout(() => { btn.innerHTML = originalText; }, 2000);
  }).catch(() => {
    const textArea = document.createElement('textarea');
    textArea.value = window.location.href;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  });
}

// --- Expose selected helpers globally ---
window.toggleStep = toggleStep;
window.toggleAccordion = toggleAccordion;
window.scrollToForm = scrollToForm;
window.toggleCheckbox = toggleCheckbox;
window.shareWhatsApp = shareWhatsApp;
window.shareSMS = shareSMS;
window.copyLink = copyLink;

// --- Main initialization ---
document.addEventListener('DOMContentLoaded', () => {
  initYouTubePlayer();
  initProgressTracker();
  initCheckboxes();
  setupFormValidation();

  // Make headers toggle steps
  document.querySelectorAll('.step-header-mobile').forEach((btn, i) => {
    btn.onclick = () => toggleStep(i + 1);
  });

  // Auto-open first step and focus search input if present
  setTimeout(() => {
    const firstStep = document.querySelector('.step-header-mobile');
    if (firstStep && !firstStep.classList.contains('collapsed')) {
      const searchInput = document.getElementById('mainSearchInput');
      if (searchInput) searchInput.focus();
    }
  }, 500);

  // --- Delegate search to DSP/searchlogic-v2.js ---
  const form = document.getElementById('amazon-search-form');
  if (!form) return;

  // Remove any existing inline submit handlers (defensive)
  form.onsubmit = null;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    let originalText = null;
    if (submitBtn) {
      originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Searching...';
      submitBtn.disabled = true;
    }

    // Prefer DSP.handleSubmit if available (from /searchlogic-v2.js)
    if (window.DSP && typeof window.DSP.handleSubmit === 'function') {
      try {
        window.DSP.handleSubmit(e);
      } finally {
        setTimeout(() => {
          if (submitBtn) {
            submitBtn.innerHTML = originalText || 'Search';
            submitBtn.disabled = false;
          }
        }, 1200);
      }
      return;
    }

    // Fallback: open with a minimal keyword-only search if DSP not loaded
    const data = new FormData(form);
    let k = (data.get('q') || '').toString().trim() || 'Deals';
    const url = `https://www.amazon.com/s?k=${encodeURIComponent(k)}`;
    const win = window.open(url, '_blank', 'noopener');
    if (!win) location.href = url;

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.innerHTML = originalText || 'Search';
        submitBtn.disabled = false;
      }
    }, 1200);
  });
});

// --- Optional social share extras ---
function shareMessenger(e) {
  e.preventDefault();
  const url = encodeURIComponent(window.location.href);
  if (/FBAN|FBAV/i.test(navigator.userAgent)) {
    window.location.href = `fb-messenger://share?link=${url}`;
  } else {
    window.open(
      `https://www.facebook.com/dialog/send?link=${url}&app_id=YOUR_APP_ID&redirect_uri=${url}`,
      '_blank', 'noopener'
    );
  }
}

function shareTwitter(e) {
  e.preventDefault();
  const message = encodeURIComponent(`Found this free Amazon deal finder – makes filters actually work ${window.location.href}`);
  if (/Twitter/i.test(navigator.userAgent)) {
    window.location.href = `twitter://post?message=${message}`;
  } else {
    window.open(`https://twitter.com/intent/tweet?text=${message}`, '_blank', 'noopener');
  }
}

function shareFacebook(e) {
  e.preventDefault();
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'noopener');
}

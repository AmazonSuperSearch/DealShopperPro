// searchlogic-v2.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('amazon-search-form');

  // ▶️ NEW: when Lightning-Deals is toggled, disable all other controls
  const lightningToggle = form.querySelector('#lightningDeals');
  const keep = ['q','currency','min-price','max-price','lightning-deals'];
  const controlsToToggle = Array.from(form.querySelectorAll('input, select'))
    .filter(el => !keep.includes(el.name));
  const updateControls = () => {
    const off = lightningToggle.checked;
    controlsToToggle.forEach(el => {
      el.disabled = off;
      if (off && el.type === 'checkbox') el.checked = false;
    });
  };
  lightningToggle.addEventListener('change', updateControls);
  updateControls();

  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);

    // ⚡ 1) Base query (allow Lightning-only searches)
    const lightningOnly = data.get('lightning-deals') === 'on';
    let q = (data.get('q') || '').trim();
    if (!q && !lightningOnly) {
      return alert('Please enter a search term.');
    }

    // 2) Keyword-based filters (always appended to q)
    const keywordAppend = (id, phrase) => {
      if (data.get(id) === 'on') {
        q += (q.endsWith(' ') ? '' : ' ') + phrase;
      }
    };
keywordAppend('eco-friendly',            'eco friendly');
keywordAppend('biodegradable-packaging', 'biodegradable packaging');
keywordAppend('vegan-products',          'vegan');
keywordAppend('organic-products',        'organic');
keywordAppend('carbon-neutral-delivery','carbon-neutral delivery');
keywordAppend('filter-cruelty-free',     'cruelty free');
keywordAppend('low-emf-devices',         'low emf');
keywordAppend('allergy-friendly',        'allergy friendly');

keywordAppend('gifts-for-her',           'gifts for her');
keywordAppend('gifts-for-him',           'gifts for him');
keywordAppend('gifts-for-dad',           'gifts for dad');
keywordAppend('gifts-for-mom',           'gifts for mom');
keywordAppend('gifts-for-kids',          'gifts for kids');
keywordAppend('birthday-gifts',          'birthday gifts');
keywordAppend('anniversary-gifts',       'anniversary gifts');
keywordAppend('holiday-gift-picks',      'holiday gift picks');

keywordAppend('meditation-mindfulness-gear', 'mindfulness gear');
keywordAppend('best-value-per-ounce',        'best value per ounce');
keywordAppend('most-reviewed',               'most reviewed');
keywordAppend('steady-price-no-spike',       'steady price');
keywordAppend('amazon-choice', 'amazon choice');
keywordAppend('free-returns',        'free returns');
keywordAppend('crowdfunded-origins', 'crowdfunded origins');

    // 3) % Off, Rating & Sort → query params
    const pct = data.get('percent-off');
    if (pct)    params.set('pct-off', pct);
    const rating = data.get('min-rating');
    if (rating === '1') rh.push('p_72:1248880011');
    if (rating === '2') rh.push('p_72:1248881011');
    if (rating === '3') rh.push('p_72:1248882011');
    if (rating === '4') rh.push('p_72:1248883011');
    if (rating === '5') rh.push('p_72:1248884011');
    const sort = data.get('sort');
    if (sort)   params.set('s', sort);

    // ── Normalize Tagify’s JSON or fallback to comma-split ──
    let raw = data.get('brand-include') || '';
    let brands = [];
    if (raw.startsWith('[')) {
      try {
        brands = JSON.parse(raw).map(tag => tag.value);
      } catch (err) {
        console.warn('Failed parsing brands JSON:', err);
      }
    }
    if (!brands.length && raw) {
      brands = raw.split(',').map(s => s.trim()).filter(Boolean);
    }

    // ── Inject brand RH-facets ──
    if (brands.length) {
      if (data.get('include-only') === 'on') {
        rh = []; // clear all non-brand filters
      }
      brands.forEach(b => {
        rh.push(`p_89:${encodeURIComponent(b)}`);
      });
    }

    // 4) Non-brand RH facets (always check Lightning Deals, others only if not brand-only)
    const pushRh = (field, code) => {
      if (data.get(field) === 'on') rh.push(code);
    };
    const rhMap = {
      'prime-only':      'p_85:2470955011',
      'free-shipping':   'p_76:1249177011',
      'in-stock':        'p_n_availability:2661601011',
      'coupons':         'p_n_feature_browse-bin:6779703011',
      'fba-only':        'p_n_shipping_option-bin:3242350011',
      'subscribe-save':  'p_n_is_sns_available:2619533011',
      'small-business':  'p_n_cpf_eligible:5191495011',
      'amazon-brands':   'p_n_feature_fourteen_browse-bin:18584192011',
      'warehouse-refurb':'p_n_condition-type:2224371011'
    };

    for (let [field, code] of Object.entries(rhMap)) {
      if (field === 'lightning-deals' || data.get('include-only') !== 'on') {
        pushRh(field, code);
      }
    }

    // 5) Now push your price-range facet last
    const min = parseFloat(data.get('min-price') || 0);
    const max = parseFloat(data.get('max-price') || 0);
    if (min > 0 || max > 0) {
      const lower = min  > 0 ? Math.round(min * 100) : 0;
      const upper = max  > 0 ? Math.round(max * 100) : '';
      rh.push(`p_36:${lower}-${upper}`);
    }
    
    // ————— If Lightning Deals ONLY, go to Goldbox instead —————
    if (data.get('lightning-deals') === 'on') {
      const lower = min  > 0 ? Math.round(min * 100) : '';
      const upper = max  > 0 ? Math.round(max * 100) : '';
      const goldboxBase = 'https://www.amazon.com/gp/goldbox?ref_=nav_topnav_deals';
      const goldboxURL =
        `${goldboxBase}`
        + `&k=${encodeURIComponent(q)}`
        + (lower    ? `&low-price=${lower}`  : '')
        + (upper    ? `&high-price=${upper}` : '');
      window.open(goldboxURL, '_blank');
      return;  // stop here — don’t fall back to the regular search URL
    }

    // 6) Build & open URL
    params.set('k', q);
    if (rh.length) params.set('rh', rh.join(','));
    params.set('tag', 'dealshopperpr-20');

    const hostMap = {
      usd: 'www.amazon.com',
      eur: 'www.amazon.de',
      gbp: 'www.amazon.co.uk',
      jpy: 'www.amazon.co.jp',
      inr: 'www.amazon.in'
    };
    const host = hostMap[data.get('currency')] || 'www.amazon.com';
    const url = `https://${host}/s?${params.toString()}`;

    console.log('🔗 Amazon URL:', url);
    window.open(url, '_blank');
  });
});


// ✅ Universal Click Sound Logic including checkboxes
window.addEventListener('load', () => {
  const clickSound = new Audio('/click.mp3');

  document.body.addEventListener('click', e => {
    const tag = e.target.tagName.toLowerCase();
    const type = e.target.type?.toLowerCase();

    if (
      ['button', 'a'].includes(tag) ||
      ['submit', 'checkbox', 'radio'].includes(type)
    ) {
      try {
        clickSound.currentTime = 0;
        clickSound.play();
      } catch (err) {
        // silently ignore
      }
    }
  });
});

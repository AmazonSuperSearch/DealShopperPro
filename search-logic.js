// search-logic.js
// Consolidated, updated Amazon search logic moved to an external file

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('amazon-search-form');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const data   = new FormData(form);
    const params = new URLSearchParams();
    const rh     = [];

    // 1) Base query
    let q = data.get('q')?.trim();
    if (!q) return alert('Please enter a search term.');

    // 2) Keyword-append helper
    function keywordAppend(id, keyword) {
      if (data.get(id) === 'on') {
        q += (q.endsWith(' ') ? '' : ' ') + keyword;
      }
    }
    // … your existing keywordAppend calls …

    // 3) RH-push helper + static map
    function pushRh(field, code) {
      if (data.get(field) === 'on') rh.push(code);
    }
    const rhMap = {
      'prime-only':      'p_85:2470955011',
      'lightning-deals': 'p_n_deal_type:23566065011',
      'todays-deals':    'p_n_deal_type:23566065011',
      'free-shipping':   'p_76:1249177011',
      'in-stock':        'p_n_availability:2661601011',
      'coupons':         'p_n_feature_browse-bin:6779703011',
      'fba-only':        'p_n_shipping_option-bin:3242350011',
      'subscribe-save':  'p_n_is_sns_available:2619533011',
      'amazon-choice':   'p_n_feature_twenty_browse-bin:21223116011',
      'small-business':  'p_n_cpf_eligible:5191495011',
      'amazon-brands':   'p_n_feature_fourteen_browse-bin:18584192011',
      'warehouse-refurb':'p_n_condition-type:2224371011'
    };
    for (const [f, code] of Object.entries(rhMap)) {
      pushRh(f, code);
    }

    // ————— New: % Off filter —————
    const pct = data.get('percent-off');
    if (pct) {
      // Amazon's percent-off facet uses p_n_pct-off:<value>
      rh.push(`p_n_pct-off:${pct}`);
    }

    // ————— New: Customer Review filter —————
    const rating = data.get('min-rating');
    if (rating) {
      // "4 stars & up" translates to p_72:4star
      rh.push(`p_72:${rating}star`);
    }

    // ————— New: Sort-by filter —————
    const sort = data.get('sort');
    if (sort) {
      // Amazon uses the "s" param for sort order
      params.set('s', sort);
    }

    // ————— New: Brand-include tags —————
    const rawBrands = data.get('brand-include'); // Tagify outputs JSON here
    if (rawBrands) {
      try {
        const brands = JSON.parse(rawBrands);
        brands.forEach(b => {
          if (b.value) rh.push(`p_89:${encodeURIComponent(b.value)}`);
        });
        // If "Match only these brands" is checked, you could remove
        // any other rh entries here, but for now it'll just add brand facets.
      } catch (err) {
        console.warn('Failed to parse brands JSON', err);
      }
    }

    // 4) Build and open URL
    params.set('k', q);
    if (rh.length) params.set('rh', rh.join(','));
    params.set('tag', 'echolover25-20');

    const hostMap = {
      usd: 'www.amazon.com',
      eur: 'www.amazon.de',
      gbp: 'www.amazon.co.uk',
      jpy: 'www.amazon.co.jp',
      inr: 'www.amazon.in'
    };
    const host = hostMap[data.get('currency')] || 'www.amazon.com';
    const url  = `https://${host}/s?${params.toString()}`;

    window.open(url, '_blank');
  });
});

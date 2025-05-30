// search-logic.js
// Consolidated, updated Amazon search logic moved to an external file

document.addEventListener('DOMContentLoaded', () => {
  // ————————————————
  // 0) Restore Tagify on your brand field
  // ————————————————
  const brandInput = document.getElementById('brandInclude');
  if (brandInput) {
    try {
      new Tagify(brandInput, {
        dropdown: {
          enabled: 0,       // completely disable the suggestion dropdown
          closeOnSelect: true
        },
        addTagOnBlur: false // don’t auto-add whatever is in the input when you blur
      });
    } catch (err) {
      console.warn('Tagify init failed:', err);
    }
  }

  // ————————————————
  // 1) Your main search form handler
  // ————————————————
  const form = document.getElementById('amazon-search-form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const params = new URLSearchParams();
    let rh = [];

    // 1) Base query
    let q = data.get('q')?.trim();
    if (!q) return alert('Please enter a search term.');

    // detect “Match only these brands”
    const brandOnly = data.get('include-only') === 'on';

    // 2) Keyword-based filters (always appended to q)
    const keywordAppend = (id, phrase) => {
      if (data.get(id) === 'on') {
        q += (q.endsWith(' ') ? '' : ' ') + phrase;
      }
    };
    // …add all your keywordAppend calls here…
    keywordAppend('eco-friendly',            'eco friendly');
    keywordAppend('gifts-for-her',           'gifts for her');
    keywordAppend('gifts-for-mom',           'gifts for mom');
    // (etc. — include your entire list)

    // 3) Price-range facet
    const min = parseFloat(data.get('min-price') || 0);
    const max = parseFloat(data.get('max-price') || 0);
    if (min > 0 || max > 0) {
      const lower = min > 0 ? Math.round(min * 100) : 0;
      const upper = max > 0 ? Math.round(max * 100) : '';
      rh.push(`p_36:${lower}-${upper}`);
    }

    // 4) Percent-off, rating & sort → params
    if (data.get('percent-off')) params.set('pct-off', data.get('percent-off'));
    if (data.get('min-rating'))  params.set('min-rating', data.get('min-rating'));
    if (data.get('sort'))        params.set('sort', data.get('sort'));

    // 5) Non-brand RH facets (skip if brandOnly)
    if (!brandOnly) {
      const pushRh = (field, code) => {
        if (data.get(field) === 'on') rh.push(code);
      };
      const rhMap = {
        'prime-only':       'p_85:2470955011',
        'lightning-deals':  'p_n_deal_type:23566065011',
        'todays-deals':     'p_n_deal_type:23566065011',
        'free-shipping':    'p_76:1249177011',
        'in-stock':         'p_n_availability:2661601011',
        'coupons':          'p_n_feature_browse-bin:6779703011',
        'fba-only':         'p_n_shipping_option-bin:3242350011',
        'subscribe-save':   'p_n_is_sns_available:2619533011',
        'amazon-choice':    'p_n_feature_twenty_browse-bin:21223116011',
        'small-business':   'p_n_cpf_eligible:5191495011',
        'amazon-brands':    'p_n_feature_fourteen_browse-bin:18584192011',
        'warehouse-refurb': 'p_n_condition-type:2224371011'
      };
      for (const [field, code] of Object.entries(rhMap)) {
        pushRh(field, code);
      }
    }

    // 6) Brand-only or brand-plus-others logic
    const rawBrands = data.get('brand-include');
    if (rawBrands) {
      try {
        const brands = JSON.parse(rawBrands);
        if (brandOnly) rh = [];  // drop any other filters
        brands.forEach(b => {
          if (b.value) rh.push(`p_89:${encodeURIComponent(b.value)}`);
        });
      } catch {
        console.warn('Invalid brands JSON');
      }
    }

    // 7) Build & open URL
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

    console.log('🔗 Amazon URL:', url);
    window.open(url, '_blank');
  });
});

// search-logic.js
// Consolidated, updated Amazon search logic moved to an external file

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('amazon-search-form');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const params = new URLSearchParams();
    const rh = [];

    // 1) Base query
    let q = data.get('q')?.trim();
    if (!q) return alert('Please enter a search term.');

    // 2) Keyword-append helper
    function keywordAppend(id, keyword) {
      if (data.get(id) === 'on') {
        q += (q.endsWith(' ') ? '' : ' ') + keyword;
      }
    }
    // ✅ Add new filters here
    keywordAppend('eco-friendly', 'eco friendly');
    keywordAppend('gifts-for-her', 'gifts for her');
    // …repeat for all keyword filters…

    // 3) RH-push helper and mapping
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
    for (const [field, code] of Object.entries(rhMap)) {
      pushRh(field, code);
    }

    // 4) Build URL
    params.set('k', q);
    if (rh.length) params.set('rh', rh.join(','));
    params.set('tag', 'echolover25-20');

    const hostMap = {
      usd: 'www.amazon.com', eur: 'www.amazon.de', gbp: 'www.amazon.co.uk',
      jpy: 'www.amazon.co.jp', inr: 'www.amazon.in'
    };
    const host = hostMap[data.get('currency')] || 'www.amazon.com';
    const url = `https://${host}/s?${params}`;

    window.open(url, '_blank');
  });
});

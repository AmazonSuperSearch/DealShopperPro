// searchlogic-v2.js
// Consolidated, updated Amazon search logic moved to an external file

// This file no longer disables controls; it supports Lightning-Only searches and Goldbox redirect.
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('amazon-search-form');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);

    // ── Init query-builder ──
    const params = new URLSearchParams();
    let rh = [];

    // 1) Base query (allow Lightning-only searches)
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
    // (add other keywordAppend calls as needed)

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

    // 4) Brand filters
    let raw = data.get('brand-include') || '';
    let brands = [];
    if (raw.startsWith('[')) {
      try {
        brands = JSON.parse(raw).map(tag => tag.value);
      } catch {}
    }
    if (!brands.length && raw) {
      brands = raw.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (brands.length) {
      if (data.get('include-only') === 'on') rh = [];
      brands.forEach(b => rh.push(`p_89:${encodeURIComponent(b)}`));
    }

    // 5) Non-brand RH facets
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
    Object.entries(rhMap).forEach(([field, code]) => pushRh(field, code));

    // 6) Price range
    const min = parseFloat(data.get('min-price') || 0);
    const max = parseFloat(data.get('max-price') || 0);
    if (min > 0 || max > 0) {
      const lower = min > 0 ? Math.round(min * 100) : 0;
      const upper = max > 0 ? Math.round(max * 100) : '';
      rh.push(`p_36:${lower}-${upper}`);
    }

   // 7) Lightning-only: Goldbox redirect (with affiliate tag)
if (lightningOnly) {
  let url = 'https://www.amazon.com/gp/goldbox?ref_=nav_topnav_deals';
  if (q)        url += `&k=${encodeURIComponent(q)}`;
  if (min > 0)  url += `&low-price=${Math.round(min*100)}`;
  if (max > 0)  url += `&high-price=${Math.round(max*100)}`;
  url += '&tag=dealshopperpr-20';          // ← add the tag here
  window.open(url, '_blank');
  return;
}
    // 8) Fallback search URL
    params.set('k', q);
    if (rh.length) params.set('rh', rh.join(','));
    params.set('tag', 'dealshopperpr-20');
    const hostMap = {usd:'www.amazon.com', eur:'www.amazon.de', gbp:'www.amazon.co.uk', jpy:'www.amazon.co.jp', inr:'www.amazon.in'};
    const host = hostMap[data.get('currency')] || 'www.amazon.com';
    const url = `https://${host}/s?${params.toString()}`;
    window.open(url, '_blank');
  });
});

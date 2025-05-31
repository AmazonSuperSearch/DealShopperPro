// search-logic.js
// Consolidated, updated Amazon search logic moved to an external file

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('amazon-search-form');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const params = new URLSearchParams();
    let rh = [];

    // 1) Base query
    let q = data.get('q')?.trim();
    if (!q) return alert('Please enter a search term.');

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

keywordAppend('free-returns',        'free returns');
keywordAppend('crowdfunded-origins', 'crowdfunded origins');
    
    // 3) % Off, Rating & Sort → query params
    const pct = data.get('percent-off');
    if (pct)    params.set('pct-off', pct);
    const rating = data.get('min-rating');
    if (rating) params.set('min-rating', rating);
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

    // 4) Non-brand RH facets (only if not brand-only)
    if (data.get('include-only') !== 'on') {
      const pushRh = (field, code) => {
        if (data.get(field) === 'on') rh.push(code);
      };
      const rhMap = {
        'prime-only':      'p_85:2470955011',
        'lightning-deals': 'p_n_deal_type:23566065011',
        'free-shipping':   'p_76:1249177011',
        'in-stock':        'p_n_availability:2661601011',
        'coupons':         'p_n_feature_browse-bin:6779703011',
        'fba-only':        'p_n_shipping_option-bin:3242350011',
        'subscribe-save':  'p_n_is_sns_available:2619533011',
        'amazon-choice':   'p_n_feature_twenty_browse-bin:17254144011',
        'small-business':  'p_n_cpf_eligible:5191495011',
        'amazon-brands':   'p_n_feature_fourteen_browse-bin:18584192011',
        'warehouse-refurb':'p_n_condition-type:2224371011'
      };
      for (let [field, code] of Object.entries(rhMap)) {
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

    // 6) Build & open URL
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
    const url = `https://${host}/s?${params.toString()}`;

    console.log('🔗 Amazon URL:', url);
    window.open(url, '_blank');
  });
});

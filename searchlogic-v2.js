document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('amazon-search-form');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);

    // ── Init query-builder ──
    const params = new URLSearchParams();
    let rh = [];

    // 1) Base query
    let q = (data.get('q') || '').trim();
    if (!q) return alert('Please enter a search term.');

    // 2) Keyword-based filters
    const keywordAppend = (id, phrase) => {
      if (data.get(id) === 'on') {
        q += (q.endsWith(' ') ? '' : ' ') + phrase;
      }
    };

   // ✅ Highly Effective - direct impact on search results
keywordAppend('vegan-products',           'vegan');
keywordAppend('organic-products',         'organic');
keywordAppend('subscribe-save',           'subscribe and save');
keywordAppend('sns-with-coupon',          'subscribe and save coupon');
keywordAppend('refurbished-deals',        'refurbished deal');
keywordAppend('warehouse-deals',          'warehouse deal');
keywordAppend('open-box-deals',           'open box deal');
keywordAppend('free-shipping-deals',      'free shipping deals');
keywordAppend('prime-only',               'prime');
keywordAppend('lightning-coupon',         'lightning deal with coupon');
keywordAppend('coupon-stacking',          'coupon stacking');
keywordAppend('promo-codes',              'amazon promo codes');
keywordAppend('subscribe-and-save-deals', 'subscribe and save');
keywordAppend('clearance-deals',          'clearance');
keywordAppend('deal-of-the-day',          'deal of the day');
keywordAppend('best-seller-deals',        'best seller deals');
keywordAppend('new-release',              'new release');
keywordAppend('back-in-stock',            'back in stock');
keywordAppend('over-50-off',              'over 50 percent off');

// ⚠️ Moderately Effective - partial impact or indirect relevance
keywordAppend('eco-friendly',             'eco friendly');
keywordAppend('bogo-deals',               'buy one get one free');
keywordAppend('price-drop-deals',         'price drop');
keywordAppend('ends-soon-deals',          'ends soon');
keywordAppend('trending-deals',           'trending deals');
keywordAppend('flash-sales',              'flash sale');
keywordAppend('budget-friendly-picks',    'budget friendly picks');
keywordAppend('hidden-deals',             'hidden deals');
keywordAppend('just-dropped-deals',       'just dropped deals');
keywordAppend('free-with-subscription',   'free with subscription');
keywordAppend('clearance-countdown',      'clearance countdown');
keywordAppend('buy-more-save-more',       'buy more save more');
keywordAppend('daily-deal-rotation',      'daily deal rotation');
keywordAppend('top-rated-deals',          'top rated deals');
keywordAppend('sample-size',              'sample size');
keywordAppend('multi-pack-savings',       'multi-pack savings');
keywordAppend('limited-quantity-deals',   'limited quantity deal');
keywordAppend('extra-discount-codes',     'extra discount code');



    // 3) % Off, Rating & Sort
    const pct = data.get('percent-off');
    if (pct) params.set('pct-off', pct);

    const rating = data.get('min-rating');
    if (rating === '1') rh.push('p_72:1248879011');
    if (rating === '2') rh.push('p_72:1248880011');
    if (rating === '3') rh.push('p_72:1248882011');
    if (rating === '4') rh.push('p_72:1248883011');
    if (rating === '5') rh.push('p_72:1248884011');

    const sort = data.get('sort');
    if (sort) params.set('s', sort);

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
    const validBrands = brands.filter(b => b.trim().length > 0);
    if (validBrands.length) {
      if (data.get('include-only') === 'on') rh = [];
      validBrands.forEach(b => rh.push(`p_89:${encodeURIComponent(b)}`));
    }

    // 5) Non-brand RH facets
    const pushRh = (field, code) => {
      if (data.get(field) === 'on') rh.push(code);
    };

   const rhMap = {
  'prime-only':       'p_85:2470955011',
  'free-shipping':    'p_76:1249177011',
  'in-stock':         'p_n_availability:2661601011',
  'coupons':          'p_n_feature_browse-bin:6779703011',
  'fba-only':         'p_n_shipping_option-bin:3242350011',
  'subscribe-save':   'p_n_is_sns_available:2619533011',
  'small-business':   'p_n_cpf_eligible:5191495011',
  'amazon-brands':    'p_n_feature_fourteen_browse-bin:18584192011',
  'warehouse-refurb': 'p_n_condition-type:2224371011',
  'lightning-deals':  'p_n_deal_type:23566065011',
  'outlet-deals':     'p_n_deal_type:493167011',
  'fair-trade':       'p_n_feature_seven_browse-bin:21246940011',
  'biodegradable':    'p_n_feature_four_browse-bin:22407761011' // ✅ New line
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

    // 7) Final URL
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

    // ✅ Show "Opening..." toast
    const toast = document.getElementById('searchToast');
    if (toast) {
      toast.style.display = 'block';
      toast.style.opacity = '1';
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.style.display = 'none', 500);
      }, 2500);
    }

    // ✅ Open Amazon in new tab
    window.open(url, '_blank');
  });
});












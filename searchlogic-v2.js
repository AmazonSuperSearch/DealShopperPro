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

    keywordAppend('eco-friendly',             'eco friendly');
    keywordAppend('biodegradable-packaging',  'biodegradable packaging');
    keywordAppend('vegan-products',           'vegan');
    keywordAppend('organic-products',         'organic');
    keywordAppend('carbon-neutral-delivery',  'carbon-neutral delivery');
    keywordAppend('bogo-deals',               'buy one get one free');
    keywordAppend('stackable-coupons',        'stackable coupon');
    keywordAppend('price-drop-deals',         'price drop');
    keywordAppend('clearance-deals',          'clearance');
    keywordAppend('bulk-discounts',           'bulk discount');
    keywordAppend('limited-time-deals',       'limited time deal');
    keywordAppend('ends-soon-deals',          'ends soon');
    keywordAppend('under-25-deals',           'under 25 deals');
    keywordAppend('expiring-coupons',         'expiring coupon');
    keywordAppend('sns-with-coupon',          'subscribe and save coupon');
    keywordAppend('best-seller-deals',        'best seller deals');
    keywordAppend('new-release', 'new release');
    keywordAppend('amazon-pantry', 'amazon pantry');
    keywordAppend('climate-pledge', 'climate pledge friendly');
    keywordAppend('hidden-gem', 'hidden gem');
    keywordAppend('filter-cruelty-free',      'cruelty free');
    keywordAppend('low-emf-devices',          'low emf');
    keywordAppend('allergy-friendly',         'allergy friendly');
    keywordAppend('gifts-for-her',            'gifts for her');
    keywordAppend('gifts-for-mom',            'gifts for mom');
    keywordAppend('anniversary-gifts',        'anniversary gifts');
    keywordAppend('gifts-for-him',            'gifts for him');
    keywordAppend('gifts-for-kids',           'gifts for kids');
    keywordAppend('gifts-for-dad',            'gifts for dad');
    keywordAppend('birthday-gifts',           'birthday gifts');
    keywordAppend('holiday-gift-picks',       'holiday gift picks');
    keywordAppend('gifts-for-teens',        'gift ideas for teens');
    keywordAppend('gifts-for-grandparents', 'gift ideas for grandparents');
    keywordAppend('gifts-under-25',         'gifts under 25 dollars');
    keywordAppend('funny-gag-gifts',        'funny gag gifts');
    keywordAppend('luxury-gift-ideas',      'luxury gift ideas');
    keywordAppend('last-minute-gifts',      'last minute gifts');
    keywordAppend('gifts-for-teachers',     'gifts for teachers');
    keywordAppend('gifts-for-coworkers',    'gifts for coworkers');
    keywordAppend('free-trials',              'free trial');
    keywordAppend('extra-discount-codes',     'extra discount code');
    keywordAppend('coupon-stacking',          'coupon stacking');
    keywordAppend('lowest-price',             'lowest price');
    keywordAppend('limited-quantity-deals',   'limited quantity deal');
    keywordAppend('warehouse-deals',          'warehouse deal');
    keywordAppend('open-box-deals',           'open box deal');
    keywordAppend('refurbished-deals',        'refurbished deal');
    keywordAppend('flash-sales',              'flash sale');
    keywordAppend('top-rated-deals',          'top rated deals');
    keywordAppend('buy-more-save-more',       'buy more save more');
    keywordAppend('cashback-deals',           'cashback');
    keywordAppend('lightning-coupon',         'lightning deal with coupon');
    keywordAppend('promo-codes',              'amazon promo codes');
    keywordAppend('trending-deals',           'trending deals');
    keywordAppend('new-deals-today',          'new deals today');
    keywordAppend('hourly-updated-deals',     'hourly updated deals');
    keywordAppend('exclude-sponsored',        'exclude sponsored');
    keywordAppend('recurring-deals',          'recurring deals');
    keywordAppend('back-in-stock',            'back in stock');
    keywordAppend('free-with-subscription',     'free with subscription');
keywordAppend('digital-coupons',            'digital coupons');
keywordAppend('instant-coupons',            'instant coupons');
keywordAppend('hidden-deals',               'hidden deals');
keywordAppend('buy-2-get-1',                'buy 2 get 1 free');
keywordAppend('closeout-sales',             'closeout sales');
keywordAppend('surprise-deals',             'surprise deals');
keywordAppend('daily-deal-rotation',        'daily deal rotation');
keywordAppend('free-shipping-deals',        'free shipping deals');
keywordAppend('subscribe-save-bundles',     'subscribe and save bundles');
keywordAppend('over-50-off',                'over 50 percent off');
keywordAppend('multi-pack-savings',         'multi-pack savings');
keywordAppend('budget-friendly-picks',      'budget friendly picks');
keywordAppend('unadvertised-discounts',     'unadvertised discounts');
keywordAppend('clearance-countdown',        'clearance countdown');
keywordAppend('just-dropped-deals',         'just dropped deals');
keywordAppend('bundle-and-save',            'bundle and save');
keywordAppend('deal-of-the-day',            'deal of the day');
keywordAppend('rare-discounts',             'rare discounts');
keywordAppend('invitation-only-deals',      'invitation only deals');
keywordAppend('ships-from-us',        'ships from United States');
keywordAppend('arrives-tomorrow',     'arrives tomorrow');
keywordAppend('same-day',             'same-day delivery');
keywordAppend('global-shipping',      'amazon global shipping');
keywordAppend('subscribe-save',       'subscribe and save');
keywordAppend('pickup-available',     'amazon pickup location');
keywordAppend('ships-from-amazon',    'ships from Amazon');
keywordAppend('recyclable-packaging', 'recyclable packaging');
keywordAppend('plastic-free', 'plastic free');
keywordAppend('minimal-packaging', 'minimal packaging');
keywordAppend('sustainably-sourced', 'sustainably sourced');
keywordAppend('rechargeable-batteries', 'rechargeable batteries');
keywordAppend('no-microplastics', 'no microplastics');
keywordAppend('bee-friendly', 'bee friendly');
keywordAppend('fair-trade', 'fair trade');
keywordAppend('ethically-made', 'ethically made');
keywordAppend('no-animal-testing', 'no animal testing');
keywordAppend('made-in-usa', 'made in usa');
keywordAppend('palm-oil-free', 'palm oil free');
keywordAppend('climate-neutral-certified', 'climate neutral certified');
keywordAppend('low-carbon-footprint', 'low carbon footprint');
keywordAppend('reusable-products', 'reusable products');
keywordAppend('compostable-materials', 'compostable materials');
keywordAppend('energy-efficient', 'energy efficient');
keywordAppend('trending-now', 'trending deals');
keywordAppend('back-in-stock', 'back in stock');
keywordAppend('new-this-month', 'new releases this month');
keywordAppend('clever-gadgets', 'clever gadgets');
keywordAppend('luxury-picks', 'premium product');
keywordAppend('budget-essentials', 'under $10 essentials');
keywordAppend('limited-quantity-left', 'only left in stock');
keywordAppend('made-in-usa', 'made in usa');
keywordAppend('woman-owned', 'woman owned business');
keywordAppend('minority-owned', 'black owned business');
keywordAppend('neurodiverse-friendly', 'autism-friendly');
keywordAppend('multi-pack-savings', 'multi-pack savings');
keywordAppend('refillable-products', 'refillable');
keywordAppend('sample-size', 'sample size');
keywordAppend('subscribe-and-save-deals', 'subscribe and save');



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
      'prime-only':      'p_85:2470955011',
      'free-shipping':   'p_76:1249177011',
      'in-stock':        'p_n_availability:2661601011',
      'coupons':         'p_n_feature_browse-bin:6779703011',
      'fba-only':        'p_n_shipping_option-bin:3242350011',
      'subscribe-save':  'p_n_is_sns_available:2619533011',
      'small-business':  'p_n_cpf_eligible:5191495011',
      'amazon-brands':   'p_n_feature_fourteen_browse-bin:18584192011',
      'warehouse-refurb':'p_n_condition-type:2224371011',
      'lightning-deals': 'p_n_deal_type:23566065011',
      'outlet-deals':    'p_n_deal_type:493167011'
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










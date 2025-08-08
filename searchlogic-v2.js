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

// Filters without rh codes
 // 🎯🔥 Deals & Discounts (fallback)
  'todays-deals': 'today\'s deals',
  'best-seller-deals': 'best seller deals',
  'bogo-deals': 'buy one get one',
  'clearance-deals': 'clearance',
  'limited-time-deals': 'limited time deals',
  'ends-soon-deals': 'ends soon deals',
  'under-25-deals': 'under $25',
  'expiring-coupons': 'expiring coupons',
  'amazon-brands': 'Amazon brand',
  'lowest-price': 'lowest price',
  'flash-sales': 'flash sale',
  'trending-deals': 'trending deals',
  'new-deals-today': 'new deals today',
  'open-box-deals': 'open box deals',
  'back-in-stock-deals': 'back in stock deals',

  // ♻️ Eco & Ethical (fallback)
  'biodegradable': 'biodegradable',
  'carbon-neutral-delivery': 'carbon neutral shipping',
  'recyclable-packaging': 'recyclable packaging',
  'plastic-free': 'plastic free',
  'minimal-packaging': 'minimal packaging',
  'rechargeable-batteries': 'rechargeable batteries',
  'made-in-usa': 'made in usa',

  // 🎯 Special Categories (fallback)
  'warehouse-refurb': 'refurbished warehouse',
  'new-release': 'new release',
  'trending-now': 'trending now',
  'back-in-stock': 'back in stock',
  'budget-essentials': 'budget essentials',
  'limited-quantity-left': 'limited quantity left',

  // 🎁 Gift Ideas (fallback)
  'gifts-for-her': 'gifts for her',
  'gifts-for-him': 'gifts for him',
  'gifts-for-kids': 'gifts for kids',
  'birthday-gifts': 'birthday gifts',
  'holiday-gift-picks': 'holiday gift picks',
  'giftUnder25': 'gifts under 25 dollars',
  'funnyGifts': 'funny gag gifts',
  'lastMinuteGifts': 'last minute gifts',
};



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
 
 // 🚚 Shipping & Availability
  'prime-only': 'p_85:2470955011',
  'free-shipping': 'p_76:1249177011',
  'in-stock': 'p_n_availability:2661601011',
  'fba-only': 'p_n_fulfilled_by_amazon:1',
  'ships-from-us': 'p_n_country_origin:14680873011',

  // 🎯🔥 Deals & Discounts
  'lightning-deals': 'p_n_deal_type:493167011',
  'coupons': 'p_n_deal_type:10252710011',
  'outlet-deals': 'p_n_deal_type:1258780011',

  // ♻️ Eco & Ethical
  'eco-friendly': 'p_n_feature_five_browse-bin:9331780011',
  'vegan-products': 'p_n_feature_nine_browse-bin:2619825011',
  'organic-products': 'p_n_feature_nine_browse-bin:2631394011',
  'cruelty-free': 'p_n_feature_nine_browse-bin:2675545011',
  'no-microplastics': 'p_n_feature_four_browse-bin:24040811011',
  'climate-pledge': 'p_n_cpf:10210330011',
  'fair-trade': 'p_n_feature_five_browse-bin:9331790011',

  // 🏪 Small Business
  'small-business': 'p_n_cpf:10210327011',
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




















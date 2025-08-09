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
const keywordAppendMap = {
   // 🎯🔥 Deals & Discounts (fallback)
  'todays-deals': 'today\'s deals', // ⚠️ experimental
  'best-seller-deals': 'best seller deals', // ⚠️ experimental
  'bogo-deals': 'buy one get one', // ⚠️ experimental
  'clearance-deals': 'clearance', // ⚠️ experimental
  'limited-time-deals': 'limited time deals', // ⚠️ experimental
  'ends-soon-deals': 'ends soon deals', // ⚠️ experimental
  'under-25-deals': 'under $25', // ⚠️ experimental
  'expiring-coupons': 'expiring coupons', // ⚠️ experimental
  'amazon-brands': 'Amazon brand', // ⚠️ experimental
  'lowest-price': 'lowest price', // ⚠️ experimental
  'flash-sales': 'flash sale', // ⚠️ experimental
  'trending-deals': 'trending deals', // ⚠️ experimental
  'new-deals-today': 'new deals today', // ⚠️ experimental
  'open-box-deals': 'open box deals', // ⚠️ experimental
  'back-in-stock-deals': 'back in stock deals', // ⚠️ experimental

  // ✅ Added from append file
  'budget-friendly-picks': 'budget friendly picks', // ⚠️ experimental
  'buy-more-save-more': 'buy more save more', // ⚠️ experimental
  'clearance-countdown': 'clearance countdown', // ⚠️ experimental
  'coupon-stacking': 'coupon stacking', // ⚠️ experimental
  'daily-deal-rotation': 'daily deal rotation', // ⚠️ experimental
  'deal-of-the-day': 'deal of the day', // ⚠️ experimental
  'extra-discount-codes': 'extra discount code', // ⚠️ experimental
  'free-shipping-deals': 'free shipping deals', // ⚠️ experimental
  'free-with-subscription': 'free with subscription', // ⚠️ experimental
  'hidden-deals': 'hidden deals', // ⚠️ experimental
  'just-dropped-deals': 'just dropped deals', // ⚠️ experimental
  'lightning-coupon': 'lightning deal with coupon', // ⚠️ experimental
  'limited-quantity-deals': 'limited quantity deal', // ⚠️ experimental
  'multi-pack-savings': 'multi-pack savings', // ⚠️ experimental
  'over-50-off': 'over 50% off', // ⚠️ experimental
  'price-drop-deals': 'price drop', // ⚠️ experimental
  'promo-codes': 'amazon promo codes', // ⚠️ experimental
  'sample-size': 'sample size', // ⚠️ experimental
  'sns-with-coupon': 'subscribe and save coupon', // ⚠️ experimental
  'subscribe-and-save-deals': 'subscribe and save', // ⚠️ experimental
  'top-rated-deals': 'top rated deals', // ⚠️ experimental

  // ♻️ Eco & Ethical (fallback)
  'biodegradable': 'biodegradable', // ⚠️ experimental
  'carbon-neutral-delivery': 'carbon neutral shipping', // ⚠️ experimental
  'recyclable-packaging': 'recyclable packaging', // ⚠️ experimental
  'plastic-free': 'plastic free', // ⚠️ experimental
  'minimal-packaging': 'minimal packaging', // ⚠️ experimental
  'rechargeable-batteries': 'rechargeable batteries', // ⚠️ experimental
  'made-in-usa': 'made in usa', // ⚠️ experimental

  // 🎯 Special Categories (fallback)
  'warehouse-refurb': 'refurbished warehouse', // ⚠️ experimental
  'new-release': 'new release', // ⚠️ experimental
  'trending-now': 'trending now', // ⚠️ experimental
  'back-in-stock': 'back in stock', // ⚠️ experimental
  'budget-essentials': 'budget essentials', // ⚠️ experimental
  'limited-quantity-left': 'limited quantity left', // ⚠️ experimental

  // 🎁 Gift Ideas (fallback)
  'gifts-for-her': 'gifts for her', // ⚠️ experimental
  'gifts-for-him': 'gifts for him', // ⚠️ experimental
  'gifts-for-kids': 'gifts for kids', // ⚠️ experimental
  'birthday-gifts': 'birthday gifts', // ⚠️ experimental
  'holiday-gift-picks': 'holiday gift picks', // ⚠️ experimental
  'holiday-gifts': 'holiday gifts', // ⚠️ experimental
  'giftUnder25': 'gifts under 25 dollars', // ⚠️ experimental
  'funnyGifts': 'funny gag gifts', // ⚠️ experimental
  'funny-gag-gifts': 'funny gag gifts', // ⚠️ experimental
  'lastMinuteGifts': 'last minute gifts' // ⚠️ experimental
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

 // 5) Non-brand RH facets
const pushRh = (field, code) => {
  if (data.get(field) === 'on') rh.push(code);
};

const rhMap = {
  // 🚚 Shipping & Availability
  'prime-only': 'p_85:2470955011',
  'free-shipping': 'p_76:1249177011',
  'in-stock': 'p_n_availability:2661601011',
  'fba-only': 'p_n_shipping_option-bin:3242350011',         // updated from older fulfilled_by_amazon
  'ships-from-us': 'p_n_country_origin:14680873011',

  // 🎯🔥 Deals & Discounts
  'lightning-deals': 'p_n_deal_type:23566065011',            // more complete RH code from append file
  'outlet-deals': 'p_n_deal_type:493167011',
  'coupons': 'p_n_feature_browse-bin:6779703011',
  'subscribe-save': 'p_n_is_sns_available:2619533011',
  'amazon-brands': 'p_n_feature_fourteen_browse-bin:18584192011',
  'warehouse-deals': 'p_n_condition-type:6461716011',
  'refurbished-deals': 'p_n_condition-type:1269692011',
  'under-25': 'p_36:-2500', // price facet

  // ♻️ Eco & Ethical
  'eco-friendly': 'p_n_feature_five_browse-bin:9331780011',
  'vegan-products': 'p_n_feature_nine_browse-bin:2619825011',
  'organic-products': 'p_n_feature_nine_browse-bin:2631394011',
  'cruelty-free': 'p_n_feature_nine_browse-bin:2675545011',
  'no-microplastics': 'p_n_feature_four_browse-bin:24040811011',
  'biodegradable': 'p_n_feature_twenty_browse-bin:12741577011',
  'fair-trade': 'p_n_feature_seven_browse-bin:21246940011',
  'climate-pledge': 'p_n_cpf_eligible:5191495011',  // more complete RH code from append file

  // 🏪 Small Business
  'small-business': 'p_n_cpf_eligible:5191495011'   // updated to match correct schema from append file
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

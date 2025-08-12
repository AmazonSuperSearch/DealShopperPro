document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('amazon-search-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);

    // ── Init query-builder ──
    const params = new URLSearchParams();
    let rh = [];

    // 1) Base query
    let q = (data.get('q') || '').trim();
    if (!q) return alert('Please enter a search term.');

    // 2) Keyword-based filters (fallbacks without RH codes)
    const keywordAppend = (id, phrase) => {
      if (data.get(id) === 'on') {
        q += (q.endsWith(' ') ? '' : ' ') + phrase;
      }
    };

    const keywordAppendMap = {
      // 🎯🔥 Deals & Discounts (fallback)
      'todays-deals': "today's deals",
      'best-seller-deals': 'best seller deals',
      'bogo-deals': 'buy one get one',
      'clearance-deals': 'clearance',
      'limited-time-deals': 'limited time deals',
      'ends-soon-deals': 'ends soon deals',
      'under-25-deals': 'under $25',
      'expiring-coupons': 'expiring coupons',  // <-- fixed missing comma
      'lowest-price': 'lowest price',
      'flash-sales': 'flash sale',
      'trending-deals': 'trending deals',
      'new-deals-today': 'new deals today',
      'open-box-deals': 'open box deals',
      'back-in-stock-deals': 'back in stock deals',

      // ✅ Added from append file
      'budget-friendly-picks': 'budget friendly picks',
      'buy-more-save-more': 'buy more save more',
      'clearance-countdown': 'clearance countdown',
      'coupon-stacking': 'coupon stacking',
      'daily-deal-rotation': 'daily deal rotation',
      'deal-of-the-day': 'deal of the day',
      'extra-discount-codes': 'extra discount code',
      'free-shipping-deals': 'free shipping deals',
      'free-with-subscription': 'free with subscription',
      'hidden-deals': 'hidden deals',
      'just-dropped-deals': 'just dropped deals',
      'lightning-coupon': 'lightning deal with coupon',
      'limited-quantity-deals': 'limited quantity deal',
      'multi-pack-savings': 'multi-pack savings',
      'over-50-off': 'over 50% off',
      'price-drop-deals': 'price drop',
      'promo-codes': 'amazon promo codes',
      'sample-size': 'sample size',
      'sns-with-coupon': 'subscribe and save coupon',
      'subscribe-and-save-deals': 'subscribe and save',
      'top-rated-deals': 'top rated deals',

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
      'holiday-gifts': 'holiday gifts',
      'giftUnder25': 'gifts under 25 dollars',
      'funnyGifts': 'funny gag gifts',
      'funny-gag-gifts': 'funny gag gifts',
      'lastMinuteGifts': 'last minute gifts'
    };

    // Apply all keyword fallbacks that are toggled on
    Object.entries(keywordAppendMap).forEach(([id, phrase]) => keywordAppend(id, phrase));

    // --- helpers: clamp to 5..95, step 5, and map to facet code
    function normalizePercentStep(value) {
      let n = parseInt(value, 10);
      if (Number.isNaN(n)) return null;
      n = Math.round(n / 5) * 5;
      if (n < 5) n = 5;
      if (n > 95) n = 95;
      return n;
    }

    // TODO: Fill with VERIFIED facet IDs for your marketplace (.com codes)
    // Keys are 5,10,15,...,95; values like "p_n_pct-off-with-tax:XXXXXXXX"
    const PCT_TO_RH = {
      // 5:  'p_n_pct-off-with-tax:________',
      // 10: 'p_n_pct-off-with-tax:________',
      // 15: 'p_n_pct-off-with-tax:________',
      // ...
      // 95: 'p_n_pct-off-with-tax:________',
    };

    function percentOffToRh(pct) {
      const n = normalizePercentStep(pct);
      if (!n) return null;
      return PCT_TO_RH[n] || null;
    }

    // 3) % Off, Rating & Sort
    const pct = data.get('min-discount'); // from your <select name="min-discount">
    const pctRh = percentOffToRh(pct);
    if (pctRh) rh.push(pctRh);

    const rating = data.get('min-rating');
    if (rating === '1') rh.push('p_72:1248879011');
    if (rating === '2') rh.push('p_72:1248880011');
    if (rating === '3') rh.push('p_72:1248882011');
    if (rating === '4') rh.push('p_72:1248883011');
    if (rating === '5') rh.push('p_72:1248884011');

    // ✅ Updated sort handling
const sort = (data.get('sort') || '').trim();
if (sort && sort !== 'relevance') params.set('s', sort);

    // 4) Brand filters
    let raw = data.get('brand-include') || '';
    let brands = [];
    if (raw.startsWith('[')) {
      try { brands = JSON.parse(raw).map(tag => tag.value); } catch {}
    }
    if (!brands.length && raw) {
      brands = raw.split(',').map(s => s.trim()).filter(Boolean);
    }
    const validBrands = brands.filter(b => b.trim().length > 0);
    if (validBrands.length) {
      if (data.get('include-only') === 'on') rh = []; // include-only nukes other non-brand filters
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
      'fba-only': 'p_n_shipping_option-bin:3242350011', // prefer this over the older fulfilled_by_amazon flag
      'ships-from-us': 'p_n_country_origin:14680873011',

      // 🎯🔥 Deals & Discounts
      'lightning-deals': 'p_n_deal_type:23566065011',
      'outlet-deals': 'p_n_deal_type:493167011',
      'coupons': 'p_n_feature_browse-bin:6779703011',
      'subscribe-save': 'p_n_is_sns_available:2619533011',
      'amazon-brands': 'p_n_feature_fourteen_browse-bin:18584192011',
      'warehouse-deals': 'p_n_condition-type:6461716011',
      'refurbished-deals': 'p_n_condition-type:1269692011',
      'under-25': 'p_36:-2500', // price facet (cents)

      // ♻️ Eco & Ethical
      'eco-friendly': 'p_n_feature_five_browse-bin:9331780011',
      'vegan-products': 'p_n_feature_nine_browse-bin:2619825011',
      'organic-products': 'p_n_feature_nine_browse-bin:2631394011',
      'cruelty-free': 'p_n_feature_nine_browse-bin:2675545011',
      'no-microplastics': 'p_n_feature_four_browse-bin:24040811011',
      'biodegradable': 'p_n_feature_twenty_browse-bin:12741577011',
      'fair-trade': 'p_n_feature_seven_browse-bin:21246940011',

      // ♻️ Badge
      'climate-pledge': 'p_n_cpf_eligible:5191495011',

      // 🏪 Small Business (⚠️ verify code; placeholder uses same CPF id)
      'small-business': 'p_n_cpf_eligible:5191495011'
    };

    Object.entries(rhMap).forEach(([field, code]) => pushRh(field, code));

    // 6) Price range (in cents)
    const min = parseFloat(data.get('min-price') || 0);
    const max = parseFloat(data.get('max-price') || 0);
    if (min > 0 || max > 0) {
      const lower = min > 0 ? Math.round(min * 100) : 0;
      const upper = max > 0 ? Math.round(max * 100) : '';
      rh.push(`p_36:${lower}-${upper}`);
    }

    // Tidy query
    q = q.replace(/\s+/g, ' ').trim();

    // 7) Final URL
    if (rh.length) {
      rh = [...new Set(rh)]; // de-dupe
      params.set('rh', rh.join(','));
    }
    params.set('k', q);
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

    // ✅ Open Amazon in new tab (with fallback if blocked)
    const win = window.open(url, '_blank');
    if (!win) location.href = url;
  });
});


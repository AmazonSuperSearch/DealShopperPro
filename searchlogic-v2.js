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
  'min-rating': 'p_72:1248882011',
  'under-25': 'p_36:-2500',
  'lightning-deals': 'p_n_deal_type:23566065011',
  'outlet-deals': 'p_n_deal_type:493167011',
  'prime-only': 'p_85:2470955011',
  'fba-only': 'p_n_shipping_option-bin:3242350011',
  'free-shipping': 'p_76:1249177011',
  'in-stock': 'p_n_availability:2661601011',
  'coupons': 'p_n_feature_browse-bin:6779703011',
  'subscribe-save': 'p_n_is_sns_available:2619533011',
  'sns-coupon': 'p_n_feature_browse-bin:6779703011,p_n_is_sns_available:2619533011',
  'small-business': 'p_n_cpf_eligible:5191495011',
  'climate-pledge': 'p_n_cpf_eligible:5191495011',
  'amazon-brands': 'p_n_feature_fourteen_browse-bin:18584192011',
  'warehouse-deals': 'p_n_condition-type:6461716011',
  'refurbished-deals': 'p_n_condition-type:1269692011',
  'biodegradable': 'p_n_feature_twenty_browse-bin:12741577011',
  'no-microplastics': 'p_n_feature_four_browse-bin:24040811011',
  'fair-trade': 'p_n_feature_seven_browse-bin:21246940011',
  'cruelty-free': 'p_n_feature_eight_browse-bin:22801363011',
  'paraben-free': 'p_n_feature_nine_browse-bin:23847964011',
  'sulfate-free': 'p_n_feature_ten_browse-bin:23847965011',
  'alcohol-free': 'p_n_feature_seventeen_browse-bin:23847966011',
  'fragrance-free': 'p_n_feature_eighteen_browse-bin:2661619011',
  'hypoallergenic': 'p_n_feature_three_browse-bin:6202592011',
  'non-gmo': 'p_n_feature_five_browse-bin:3012491011',
  'gluten-free': 'p_n_feature_six_browse-bin:3012492011',
  'made-in-usa': 'p_n_feature_twenty_browse-bin:22427944011',
  'gift-wrap': 'p_n_feature_browse-bin:10012400011',
  'new-arrivals': 'p_n_date:1249037011'
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



















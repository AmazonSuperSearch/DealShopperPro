<script>
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

    // 2) Keyword-based filters
    const keywordAppend = (id, phrase) => {
      if (data.get(id) === 'on') {
        q += (q.endsWith(' ') ? '' : ' ') + phrase;
      }
    };

    // Filters without rh codes
    const keywordAppendMap = {
      // 🎯🔥 Deals & Discounts (fallback)
      'todays-deals': "today's deals",
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
      'giftUnder

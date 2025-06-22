// search-logic.js
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
    keywordAppend('amazon-choice', 'amazon choice');
    keywordAppend('free-returns',        'free returns');
    keywordAppend('crowdfunded-origins', 'crowdfunded origins');

    // 3) % Off, Rating & Sort
    const pct = data.get('percent-off');
    if (pct)    params.set('pct-off', pct);
    const sort = data.get('sort');
    if (sort)   params.set('s', sort);

    // 4) Special flag for Lightning Deals
    const isLightningOnly = dat

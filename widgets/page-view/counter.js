// Page View Counter using CountAPI (no auth, CORS-friendly).
// URL params:
//   id = stable identifier for your page (string)
//   ns = optional namespace (default: 'alexmoon89.widgets')
//   inc = how much to increment (default 1; set 0 to just read)
// Example:
//   .../widgets/page-view/?id=portfolio
//   .../widgets/page-view/?id=about&ns=alexmoon89.widgets

(function () {
  const out = document.getElementById('pv');

  // tiny non-crypto hash for fallback IDs (based on referrer)
  function hash(s) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(36);
  }

  const params = new URLSearchParams(location.search);
  const ns = (params.get('ns') || 'alexmoon89.widgets').trim();
  const inc = Number.isFinite(+params.get('inc')) ? +params.get('inc') : 1;

  // Prefer explicit id. If absent, derive from referrer (works in Notion embeds).
  let id = (params.get('id') || '').trim();
  if (!id) {
    const ref = (document.referrer || 'unknown').replace(/^https?:\/\//, '');
    id = 'ref-' + hash(ref);
  }

  if (!id) {
    out.textContent = '—';
    document.querySelector('.card').setAttribute('aria-busy', 'false');
    return;
  }

  // CountAPI endpoints:
  //  - hit: increments and returns { value }
  //  - get: returns current { value } without increment
  const base = `https://api.countapi.xyz`;
  const endpoint = (inc === 0 ? 'get' : 'hit');
  const url = `${base}/${endpoint}/${encodeURIComponent(ns)}/${encodeURIComponent(id)}`;

  fetch(url, { mode: 'cors', cache: 'no-store' })
    .then(r => r.ok ? r.json() : Promise.reject(new Error(r.status + ' ' + r.statusText)))
    .then(data => {
      const value = (typeof data?.value === 'number') ? data.value : null;
      out.textContent = value !== null ? value.toLocaleString() : '—';
    })
    .catch(() => { out.textContent = '—'; })
    .finally(() => {
      document.querySelector('.card').setAttribute('aria-busy', 'false');
    });
})();

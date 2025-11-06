// Minimal page-view counter using CountAPI (no auth).
// Usage: /widgets/page-view/?id=<your-page-id>&ns=<optional-namespace>
(function(){
  const el = document.getElementById('pv');
  const params = new URLSearchParams(location.search);
  const id = (params.get('id') || 'default').trim();
  const ns = (params.get('ns') || 'alexmoon89.widgets').trim();
  if (!id) { el.textContent = 'error'; return; }

  // CountAPI docs: https://countapi.xyz
  const url = `https://api.countapi.xyz/hit/${encodeURIComponent(ns)}/${encodeURIComponent(id)}`;

  fetch(url, { mode: 'cors', cache: 'no-store' })
    .then(r => r.json())
    .then(data => {
      // data.value is the new count
      if (typeof data.value === 'number') {
        el.textContent = data.value.toLocaleString();
      } else {
        el.textContent = '—';
      }
    })
    .catch(() => { el.textContent = '—'; });
})();

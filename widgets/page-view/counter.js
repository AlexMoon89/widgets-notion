// CountAPI-based page view counter with dark/light + style options.
// Params:
//   id=<string>           unique ID for the page (recommended)
//   ns=<string>           namespace (default: 'alexmoon89.widgets')
//   inc=<number>          increment (default 1; use 0 to read without increment)
//   theme=auto|light|dark (default auto)
//   style=pill|min        (default pill)
//   label=<string>        label text (default "Views")

(function () {
  const $ = sel => document.querySelector(sel);
  const root = $('#pv-root');
  const out  = $('#pv-val');
  const lab  = $('#pv-label');
  const eye  = document.querySelector('.pv-icon');

  /* ---- params ---- */
  const p = new URLSearchParams(location.search);
  const ns    = (p.get('ns') || 'alexmoon89.widgets').trim();
  const label = (p.get('label') || 'Views').trim();
  const style = (p.get('style') || 'pill').trim();   // pill|min
  const theme = (p.get('theme') || 'auto').trim();   // auto|light|dark
  const inc   = Number.isFinite(+p.get('inc')) ? +p.get('inc') : 1;

  lab.textContent = label;
  if (style === 'min') {
    root.classList.add('pv-min');
    eye.style.display = 'inline-block';
  }

  if (theme === 'light') {
    document.documentElement.style.colorScheme = 'light';
  } else if (theme === 'dark') {
    document.documentElement.style.colorScheme = 'dark';
  }

  // tiny non-crypto hash for stable fallback if id missing
  function hash(s){ let h=2166136261>>>0; for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619);} return (h>>>0).toString(36);}
  let id = (p.get('id') || '').trim();
  if (!id) {
    const ref = (document.referrer || 'unknown').replace(/^https?:\/\//,'');
    id = 'ref-' + hash(ref);
  }

  const endpoint = (inc === 0 ? 'get' : 'hit');
  const url = `https://api.countapi.xyz/${endpoint}/${encodeURIComponent(ns)}/${encodeURIComponent(id)}`;

  fetch(url, { mode:'cors', cache:'no-store' })
    .then(r => r.ok ? r.json() : Promise.reject(new Error(r.status + ' ' + r.statusText)))
    .then(d => {
      const v = (typeof d?.value === 'number') ? d.value : null;
      out.textContent = v !== null ? v.toLocaleString() : '—';
    })
    .catch(() => { out.textContent = '—'; });
})();

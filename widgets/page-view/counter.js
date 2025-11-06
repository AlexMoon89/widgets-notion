// Page-view counter using visitorbadge.io + resilient local/session fallback.
//
// Params:
//   id=<string>             stable key for the page (recommended)
//   ns=<string>             namespace (default: 'alexmoon89_widgets')
//   theme=auto|light|dark   (handled by index.html CSS)
//   style=pill|min          (handled by index.html CSS)
//   label=<string>          label text (default "Views")
//   debug=1                 inline debug note
//   mode=local              force local/session only (ignore network)
//   store=local|session     where to store fallback count (default: local)
//   reset=1                 reset stored counter on this device (for testing)

(function () {
  const $ = s => document.querySelector(s);
  const out  = $('#pv-val');
  const lab  = $('#pv-label');
  const root = $('#pv-root');
  const eye  = document.querySelector('.pv-icon');

  const q = new URLSearchParams(location.search);
  const ns    = (q.get('ns') || 'alexmoon89_widgets').trim();
  const label = (q.get('label') || 'Views').trim();
  const style = (q.get('style') || 'pill').trim();
  const theme = (q.get('theme') || 'auto').trim();
  const debug = q.get('debug') === '1';
  const forceLocal = (q.get('mode') || '').toLowerCase() === 'local';
  const storeKind  = (q.get('store') || 'local').toLowerCase(); // local | session
  const doReset    = q.get('reset') === '1';

  // stable id
  function hash(s){ let h=2166136261>>>0; for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619);} return (h>>>0).toString(36); }
  let id = (q.get('id') || '').trim();
  if (!id) { const ref=(document.referrer||'unknown').replace(/^https?:\/\//,''); id='ref-'+hash(ref); }

  lab.textContent = label;
  if (style === 'min') { root.classList.add('pv-min'); eye.style.display = 'inline-block'; }

  if (theme === 'light') document.documentElement.setAttribute('data-theme','light');
  else if (theme === 'dark') document.documentElement.setAttribute('data-theme','dark');
  else document.documentElement.setAttribute('data-theme', matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  const storage = storeKind === 'session' ? window.sessionStorage : window.localStorage;
  const key = `pv:${ns}:${id}`;

  function getStored(){ try { return Number(storage.getItem(key) || '0'); } catch { return 0; } }
  function setStored(n){ try { storage.setItem(key, String(n)); } catch {} }
  function clearStored(){ try { storage.removeItem(key); } catch {} }
  function show(n){ out.textContent = Number.isFinite(n) ? n.toLocaleString() : '0'; }

  // Optional: reset for testing
  if (doReset) clearStored();

  // Always render something immediately
  show(getStored());

  const uniquePath = `${ns}/${id}`;
  const badgeURL = `https://visitorbadge.io/api/visitors?path=${encodeURIComponent(uniquePath)}&label=views&style=flat`;

  async function tryFetchSVG() {
    try {
      const r = await fetch(badgeURL, { mode:'cors', cache:'no-store' });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const svg = await r.text();
      const texts = [...svg.matchAll(/>([\d,]+)<\/text>/g)];
      const last = texts.length ? texts[texts.length - 1][1] : null;
      const num = last ? Number(last.replace(/,/g,'')) : NaN;
      if (!Number.isFinite(num)) throw new Error('No number in SVG');
      setStored(num); show(num);
      return true;
    } catch (e) { if (debug) console.warn('[pv] SVG fetch parse failed:', e); return false; }
  }

  function imgIncrementAndShowLocal() {
    try {
      const img = new Image();
      img.src = badgeURL + `&t=${Date.now()}`; // increments remotely even if unreadable
      const next = (getStored() + 1);
      setStored(next); show(next);
      return true;
    } catch (e) { if (debug) console.warn('[pv] <img> fallback failed:', e); return false; }
  }

  (async function boot(){
    if (forceLocal) { const next = getStored() + 1; setStored(next); show(next); return; }

    // Best: read global value
    if (await tryFetchSVG()) return;

    // Next: increment remotely via <img>, bump local for UI
    if (imgIncrementAndShowLocal()) return;

    // Last resort: purely local bump
    const next = getStored() + 1;
    setStored(next); show(next);
    if (debug) {
      const note = document.createElement('div');
      note.style.cssText='position:fixed;bottom:8px;left:8px;background:#fee;color:#900;border:1px solid #faa;padding:6px 8px;border-radius:8px;font:12px system-ui;max-width:70vw';
      note.textContent='Using local/session fallback (network blocked).';
      document.body.appendChild(note);
    }
  })();
})();

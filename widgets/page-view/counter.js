// Page-view counter using visitorbadge.io, with graceful fallbacks.
// Flow:
// 1) Try fetching the SVG badge as text -> parse number.
// 2) If blocked by CORS: load the SVG in an <img> (increments remotely) and
//    show a localStorage-based number so the pill never looks empty.
// 3) If network fails entirely -> full localStorage fallback.
//
// URL params (same as before):
//   id=<string>            unique key for the page (recommended)
//   ns=<string>            namespace (default: 'alexmoon89_widgets')
//   inc=<number>           increment (default 1; visitorbadge increments on every load anyway)
//   theme=auto|light|dark  (handled by index.html CSS)
//   style=pill|min         (handled by index.html CSS)
//   label=<string>         label text (default "Views")
//   debug=1                show inline debug note

(function () {
  const $ = s => document.querySelector(s);
  const root = $('#pv-root');
  const out  = $('#pv-val');
  const lab  = $('#pv-label');
  const eye  = document.querySelector('.pv-icon');

  const p = new URLSearchParams(location.search);
  const ns    = (p.get('ns') || 'alexmoon89_widgets').trim();
  const label = (p.get('label') || 'Views').trim();
  const style = (p.get('style') || 'pill').trim();
  const theme = (p.get('theme') || 'auto').trim();
  const inc   = Number.isFinite(+p.get('inc')) ? +p.get('inc') : 1;
  const debug = p.get('debug') === '1';

  lab.textContent = label;
  if (style === 'min') { root.classList.add('pv-min'); eye.style.display = 'inline-block'; }

  // Theme hookup (CSS uses [data-theme])
  if (theme === 'light') document.documentElement.setAttribute('data-theme','light');
  else if (theme === 'dark') document.documentElement.setAttribute('data-theme','dark');
  else document.documentElement.setAttribute('data-theme', matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  // Stable ID
  function hash(s){ let h=2166136261>>>0; for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619);} return (h>>>0).toString(36); }
  let id = (p.get('id') || '').trim();
  if (!id) {
    const ref=(document.referrer||'unknown').replace(/^https?:\/\//,'');
    id='ref-'+hash(ref);
  }

  // Local storage helpers
  const localKey = `pv:${ns}:${id}`;
  function localGet(){ try { return Number(localStorage.getItem(localKey) || '0'); } catch { return 0; } }
  function localSet(n){ try { localStorage.setItem(localKey, String(n)); } catch {} }
  function localBump(){
    const cur = localGet();
    const next = cur + (inc === 0 ? 0 : 1);
    if (inc !== 0) localSet(next);
    return (inc === 0 ? cur : next);
  }

  // Build visitorbadge path (each unique path has its own counter)
  // Keep it simple and short to avoid encoding issues.
  const uniquePath = `${ns}/${id}`;
  const badgeURL = `https://visitorbadge.io/api/visitors?path=${encodeURIComponent(uniquePath)}&label=views&countColor=%2300c853&labelColor=%23a3a3a3&style=flat`;

  async function tryVisitorBadgeText() {
    // Try to fetch the SVG as text and parse the number out.
    try {
      const r = await fetch(badgeURL, { mode: 'cors', cache: 'no-store' });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const svg = await r.text();

      // Extract the last numeric text in the SVG. Works with visitorbadge.io layout.
      const texts = [...svg.matchAll(/>([\d,]+)<\/text>/g)];
      const last = texts.length ? texts[texts.length - 1][1] : null;
      const num = last ? Number(last.replace(/,/g,'')) : NaN;

      if (!Number.isFinite(num)) throw new Error('No number found in SVG');
      out.textContent = num.toLocaleString();
      localSet(num); // cache latest value locally for offline display
      return true;
    } catch (e) {
      if (debug) console.warn('[pv] visitorbadge text parse failed ->', e);
      return false;
    }
  }

  function incrementViaImageAndShowLocal() {
    // Load the badge as <img> to ensure the remote counter increments,
    // but display a local number so UI isn't empty.
    try {
      const img = new Image();
      img.src = badgeURL + `&t=${Date.now()}`; // bust caches
      const shown = localBump();
      out.textContent = shown.toLocaleString();
      return true;
    } catch (e) {
      if (debug) console.warn('[pv] <img> increment fallback failed ->', e);
      return false;
    }
  }

  (async function boot(){
    // Best path: parse SVG (global number in UI)
    if (await tryVisitorBadgeText()) return;

    // Next best: increment via <img>, show local
    if (incrementViaImageAndShowLocal()) return;

    // Final fallback: pure local
    const shown = localBump();
    out.textContent = shown ? shown.toLocaleString() : '—';
    if (debug) {
      const note = document.createElement('div');
      note.style.cssText = 'position:fixed;bottom:8px;left:8px;background:#fee;color:#900;border:1px solid #faa;padding:6px 8px;border-radius:8px;font:12px system-ui';
      note.textContent = 'Using localStorage fallback (network blocked).';
      document.body.appendChild(note);
    }
  })();
})();

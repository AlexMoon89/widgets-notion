# 🧮 Page View Widget

A lightweight, self-contained **page-view counter** designed for Notion embeds, blogs, or any static site.  
It runs entirely in the browser, works without any backend, and gracefully falls back to local counting if network requests are blocked.

---

## 🔧 Features

- ✅ **Works in Notion embeds** and static GitHub Pages  
- 🔁 **Auto-increments locally** on every page load  
- ☁️ **Best-effort global sync** through [visitorbadge.io](https://visitorbadge.io)  
- 🌓 **Dark / light / auto theme** support  
- 💾 Uses `localStorage` or `sessionStorage` for resilience  
- 🧩 No dependencies, no third-party analytics, privacy-friendly

---

## 📁 Folder structure

```
widgets/
└── page-view/
├── index.html # main HTML wrapper
├── counter.js # counter logic
└── README.md # this file
```

---

## 🚀 Usage

Embed it anywhere that supports iframes — for example, in a Notion block:

https://alexmoon89.github.io/widgets-notion/widgets/page-view/?ns=alexmoon89_widgets&id=blog-page

ruby
Copiar código

### Parameters

| Param | Description | Example / Default |
|:------|:-------------|:------------------|
| `ns` | Namespace (groups counters) | `alexmoon89_widgets` |
| `id` | Unique page ID | `blog-page` |
| `label` | Custom text label | `Views` |
| `theme` | `auto` \| `light` \| `dark` | `auto` |
| `style` | `pill` \| `min` | `pill` |
| `store` | Storage type | `local` or `session` |
| `mode` | Force local only | `local` |
| `reset` | Reset stored count (for testing) | `1` |
| `debug` | Show diagnostic overlay | `1` |
| `v` | Cache-buster (forces reload when code updates) | `v=5` |

---

## 💡 Example URLs

**Basic counter (recommended):**
https://alexmoon89.github.io/widgets-notion/widgets/page-view/?ns=alexmoon89_widgets&id=blog-page

**Session storage (better for Notion):**
.../page-view/?ns=alexmoon89_widgets&id=blog-page&store=session

**Force local mode (for debugging or offline use):**
.../page-view/?ns=alexmoon89_widgets&id=blog-page&mode=local&store=session&debug=1


**Dark theme, minimal pill:**
.../page-view/?ns=alexmoon89_widgets&id=blog-page&theme=dark&style=min

---

## ⚙️ How It Works

1. On each load, the widget:
   - Immediately displays the locally stored count (starting from `0`).
   - Increments and stores the value (`localStorage` or `sessionStorage`).
   - Attempts to sync with a global counter via **visitorbadge.io**.
   - If the global request is blocked, it still keeps working locally.

2. Use `&v=2`, `&v=3`, etc. when you update code so Notion’s cache refreshes the iframe.

---

## 🧭 Roadmap

- [ ] Optional **Supabase backend** for true shared counts  
- [ ] **Rate limiting** and anti-spam protection  
- [ ] Compact “read-only badge” mode for blogs

---

## 🛡️ License

MIT © [AlexMoon89](https://github.com/AlexMoon89)

Feel free to fork, modify, and embed your own counters!

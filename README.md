# Notion Widgets (GitHub Pages)

Self-hosted widgets you can embed in Notion using the **/Embed** block.  
No third-party hosting, no external deps — just GitHub Pages.

## Live catalog

- **Catalog:** `https://alexmoon89.github.io/widgets-notion/`
- **Slider demo:** `https://alexmoon89.github.io/widgets-notion/widgets/slider/?data=data/slider/example.json`

> If a JSON change doesn’t appear in Notion, append `&v=YYYYMMDD` to bypass cache.

---

## Repository structure

widgets-notion/
├─ index.html # Catalog page (links to each widget)
├─ README.md
├─ assets/ # Shared images/icons (optional)
├─ data/
│ └─ slider/
│ └─ example.json # Example data for the slider
└─ widgets/
└─ slider/
└─ index.html # Slider widget (embeddable page)

yaml
Copiar código

> **Note:** Folder is `widgets/` (with **d**). Keep this naming for future widgets.

---

## Enable GitHub Pages

1. Repo → **Settings → Pages**
2. Source: **Deploy from branch**
3. Branch: `main` (or the branch you use)
4. Folder: `/ (root)`
5. Save — you’ll get `https://<user>.github.io/widgets-notion/`

---

## Widget: Image Slider

**URL pattern**

/widgets/slider/?data=<path-to-json>

bash
Copiar código

You can pass either:
- **Repo-relative:** `data/slider/example.json`
- **Root-relative:** `/widgets-notion/data/slider/example.json`
- **Absolute URL:** `https://alexmoon89.github.io/widgets-notion/data/slider/example.json`

**JSON schema**

```json
{
  "title": "Projects (Agile)",
  "images": [
    { "url": "assets/product/1.png", "alt": "Hero", "caption": "" },
    { "url": "assets/product/2.png", "alt": "Roadmap" }
  ]
}
url: image path. Use repo-relative (assets/...) or root-relative (/widgets-notion/assets/...).

alt: accessibility text (recommended).

caption: optional.

Example embed URL (Notion)

bash
Copiar código
https://alexmoon89.github.io/widgets-notion/widgets/slider/?data=data/slider/example.json
Add it via /Embed in your Notion page.

Troubleshooting
404 JSON: Check the path in ?data=. Try root-relative: /widgets-notion/data/slider/example.json

Wrong images: Ensure the JSON url values exist and are reachable under GitHub Pages.

Weird slide width in Notion: The slider re-measures on resize and after images load. If it still misbehaves, ensure your Notion block width isn’t too narrow; try full-width page or wide column.

Cache: Add &v=YYYYMMDD to the widget URL to force refresh.

Roadmap
widgets/timeline — milestones from JSON (vertical/horizontal)

widgets/countdown — countdown to a target timestamp

widgets/cards — icon + title + link cards grid

PRs and ideas welcome!

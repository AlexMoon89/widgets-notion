# 🧩 Notion Widgets (GitHub Pages)

Public, self-hosted widgets you can embed directly in **Notion** using the `/Embed` block.  
No third-party hosting or external dependencies — everything runs from GitHub Pages.

---

## 🌐 Live Catalog

- **Catalog:**  
  [https://alexmoon89.github.io/widgets-notion/](https://alexmoon89.github.io/widgets-notion/)
- **Slider Demo:**  
  [https://alexmoon89.github.io/widgets-notion/widgets/slider/?data=data/slider/example.json](https://alexmoon89.github.io/widgets-notion/widgets/slider/?data=data/slider/example.json)

> If Notion caches an old version, add a cache-buster like `&v=20251105`.

---

## 📁 Repository Structure

```text
widgets-notion/
├─ index.html                  # Catalog page
├─ README.md
├─ assets/                     # Shared images/icons (optional)
├─ data/
│  └─ slider/
│     └─ example.json          # Example data for the slider widget
└─ widgets/
   └─ slider/
      └─ index.html            # Slider widget (embeddable)
```

## ⚙️ GitHub Pages Setup

1. Go to **Settings → Pages**
2. Set **Source** → “Deploy from branch”
3. Choose branch `main` and folder `/ (root)`
4. Save — your site will publish to  
   `https://alexmoon89.github.io/widgets-notion/`

---

## 🖼️ Widget 1: Image Slider

A responsive slider with arrows, dots, keyboard and swipe navigation.  
Loads its content from a JSON file provided via the `?data=` query parameter.

### Embed URL Pattern
/widgets/slider/?data=<path-to-json>

bash
Copiar código

#### Examples
- Repo-relative:  
  `/widgets/slider/?data=data/slider/example.json`
- Root-relative:  
  `/widgets/slider/?data=/widgets-notion/data/slider/example.json`
- Full URL:  
  `https://alexmoon89.github.io/widgets-notion/widgets/slider/?data=data/slider/example.json`

Add that URL into a Notion **/Embed** block.

---

### JSON Schema

```json
{
  "title": "Projects (Agile)",
  "images": [
    { "url": "assets/product/1.png", "alt": "Hero", "caption": "" },
    { "url": "assets/product/2.png", "alt": "Roadmap" },
    { "url": "assets/product/3.png", "alt": "Team" }
  ]
}
```

#### Fields

url – image path (repo-relative or root-relative)

alt – accessibility text (recommended)

caption – optional text overlay

## Troubleshooting
Problem	Fix
- 404 on JSON	Check ?data= path. Try root-relative: /widgets-notion/data/slider/example.json.
- Images not showing	Verify the image URLs in your JSON exist under /assets/….
- Weird layout / cropped slide	The slider re-measures on load and resize. Use Notion full-width or wide columns.
- Cache not updating	Append &v=YYYYMMDD to the URL to force reload.

### 🧮 Widget 2: Page View 

A lightweight, privacy-friendly page-view counter for Notion or static sites.  
Works entirely client-side, auto-increments locally, and optionally syncs via visitorbadge.io.  
➡️ [View widget](https://alexmoon89.github.io/widgets-notion/widgets/page-view/)

## 🚧 Roadmap
Planned widgets (same lightweight architecture):
```
Widget	Description	Folder
Timeline	Milestones from JSON (vertical / horizontal)	/widgets/timeline/
Countdown	Timer to a target date/time	/widgets/countdown/
Cards	Grid of icon + title + link cards	/widgets/cards/
```
## 🧭 Contributing

Fork the repo

Create a new folder under /widgets/<name>/

Add its demo JSON in /data/<name>/

Update index.html (catalog) and README links


© 2025 Alejandra Sofía Reyes — Made for Notion enthusiasts 🚀

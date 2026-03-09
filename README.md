<p align="center">
  <img src="https://raw.githubusercontent.com/0xR3TRO/IconVault/main/preview-site/og-image.svg" alt="IconVault" width="120">
</p>

<h1 align="center">IconVault</h1>
<p align="center">
  <strong>Free, open-source SVG icon library for modern web projects.</strong><br>
  Minimalist &middot; Dev-friendly &middot; Zero restrictions
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> &middot;
  <a href="#-browse-icons">Browse Icons</a> &middot;
  <a href="#-usage">Usage</a> &middot;
  <a href="#-contributing">Contributing</a> &middot;
  <a href="#-license">License</a>
</p>

---

## Overview

IconVault is a carefully crafted collection of **140+ SVG icons** designed for web applications, dashboards, and digital products. Every icon is free to use — no attribution required, no license fees, no restrictions.

### Key Principles

- **Open-source & free forever** — CC0 / public domain icons, MIT-licensed code
- **Minimalist design** — clean lines, consistent stroke width, pixel-aligned
- **Developer-friendly** — `currentColor` support, clean SVG markup, copy-paste ready
- **Multiple styles** — Outline, Solid, Mini, Brands, and Custom variants
- **Zero dependencies** — pure SVG, works everywhere

---

## Repository Structure

```
IconVault/
├── icons/                    # SVG icon files
│   ├── outline/              # Stroke-based icons (24×24, stroke-width: 2)
│   ├── solid/                # Filled icons (24×24)
│   ├── mini/                 # Compact filled icons (20×20)
│   ├── brands/               # Brand/logo icons (24×24)
│   └── custom/               # Special-purpose UI icons (24×24)
├── preview-site/             # Interactive icon browser
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── tools/                    # Developer utilities
│   ├── optimize.js           # SVG optimization
│   └── generate-index.js     # Metadata & index generation
├── docs/                     # Documentation
│   ├── usage.md              # Integration guide (HTML, React, Vue, Tailwind)
│   ├── contributing.md       # How to contribute
│   └── naming-conventions.md # Naming & categorization standards
├── changelog/                # Monthly release notes
├── icons.json                # Icon metadata (names, categories, tags, paths)
├── index.js                  # ES module exports for bundlers
├── package.json
├── LICENSE
└── README.md
```

---

## Quick Start

### Option 1 — Download & Use

Clone or download the repository and reference icons directly:

```bash
git clone https://github.com/0xR3TRO/IconVault.git
```

Copy any SVG file into your project and use it inline:

```html
<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    width="24"
    height="24"
>
    <path d="M3 9.5L12 2l9 7.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.5z" />
    <polyline points="9 22 9 12 15 12 15 22" />
</svg>
```

### Option 2 — Import as Module (Future npm Package)

```js
import { icons } from "./path-to-iconvault/index.js";

const homeIcon = icons.find((i) => i.name === "home");
console.log(homeIcon.paths.outline); // "icons/outline/home.svg"
```

---

## Browse Icons

Open `preview-site/index.html` in your browser for an interactive icon browser with:

- **Search** by name and tags
- **Filter** by style (outline, solid, mini, brands, custom) and category
- **Preview** at different sizes (16px–64px)
- **Color picker** for live preview
- **Copy** raw SVG, React component, or Vue component code
- **Dark/light mode** with saved preference

---

## Usage

### HTML (Inline SVG)

```html
<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    width="24"
    height="24"
>
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
</svg>
```

### React

```jsx
function IconSearch(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
        </svg>
    );
}

<IconSearch width={24} height={24} className="text-blue-500" />;
```

### Vue

```vue
<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        :width="size"
        :height="size"
    >
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
    </svg>
</template>
```

### Tailwind CSS

```html
<svg class="w-6 h-6 text-indigo-500" ...>...</svg>
```

> Full integration guide: [docs/usage.md](docs/usage.md)

---

## Icon Styles

| Style   | Canvas | Rendering             | Best For                         |
| ------- | ------ | --------------------- | -------------------------------- |
| Outline | 24×24  | Stroke, width 2       | Navigation, toolbars, general UI |
| Solid   | 24×24  | Filled shapes         | Active states, emphasis, badges  |
| Mini    | 20×20  | Filled, compact       | Dense UI, tables, small buttons  |
| Brands  | 24×24  | Filled brand logos    | Social links, integrations       |
| Custom  | 24×24  | Stroke-based, special | Loading, placeholders, patterns  |

---

## Tools

### SVG Optimizer

```bash
node tools/optimize.js              # Optimize all icons
node tools/optimize.js --style outline  # Only outline icons
node tools/optimize.js --dry-run    # Preview without writing
node tools/optimize.js --verbose    # Detailed output
```

### Index Generator

```bash
node tools/generate-index.js            # Generate icons.json + index.js
node tools/generate-index.js --out dist  # Custom output directory
node tools/generate-index.js --format json  # Only icons.json
```

---

## Contributing

We welcome contributions! Whether it's new icons, bug fixes, or documentation improvements.

1. Fork the repository
2. Create a branch (`git checkout -b add-icon-name`)
3. Add your icon(s) following the [design specifications](docs/contributing.md#icon-requirements)
4. Run `node tools/optimize.js && node tools/generate-index.js`
5. Submit a Pull Request

> Full guide: [docs/contributing.md](docs/contributing.md)

---

## Changelog & Release Cycle

IconVault follows a **monthly release cycle**. Each month's changes are documented in the `changelog/` directory.

| File         | Content                      |
| ------------ | ---------------------------- |
| `2025-01.md` | Initial release (140+ icons) |
| `2025-02.md` | Custom icons, improvements   |

Check the [changelog/](changelog/) directory for the full history.

---

## License

- **Icons** — [CC0 1.0 Universal (Public Domain)](https://creativecommons.org/publicdomain/zero/1.0/). Free for personal and commercial use. No attribution required.
- **Code** (tools, preview site, scripts) — [MIT License](LICENSE).

You can use IconVault icons in any project — commercial, open-source, or personal — without any restrictions.

---

## FAQ

### How do I add my own custom icons?

1. Create your SVG following the [design specs](docs/contributing.md#icon-requirements)
2. Place it in the appropriate `icons/` subdirectory
3. Run `node tools/optimize.js && node tools/generate-index.js`
4. Your icon will appear in the preview site and metadata

### How do I change the size of an icon?

Set `width` and `height` attributes on the `<svg>` element, or use CSS:

```html
<svg width="32" height="32" ...>...</svg>
<!-- or -->
<svg style="width: 2rem; height: 2rem;" ...>...</svg>
<!-- or with Tailwind -->
<svg class="w-8 h-8" ...>...</svg>
```

### How do I change the color?

Icons use `currentColor`, so they inherit the parent element's text color:

```html
<div style="color: #ef4444;">
    <svg ...>...</svg>
    <!-- Will be red -->
</div>
```

### Can I use these icons commercially?

Yes. IconVault icons are released under CC0 1.0 (public domain). There are zero restrictions — no attribution required, no license fees.

### Will there be an npm package?

It's planned for a future release. For now, clone the repo or copy individual SVG files.

### What's the difference between outline and solid?

**Outline** icons use strokes (lines) — best for navigation and general UI. **Solid** icons use filled shapes — best for active/selected states and emphasis.

---

<p align="center">
  Made with care by <a href="https://github.com/0xR3TRO">0xR3TRO</a>
</p>

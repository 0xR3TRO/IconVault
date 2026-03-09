# Contributing to IconVault

Thank you for your interest in contributing to IconVault! This document outlines the process and requirements for adding new icons or improving existing ones.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Icon Requirements](#icon-requirements)
- [Adding a New Icon](#adding-a-new-icon)
- [Naming Conventions](#naming-conventions)
- [Pull Request Process](#pull-request-process)
- [Code Contributions](#code-contributions)

---

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
    ```bash
    git clone https://github.com/YOUR_USERNAME/IconVault.git
    cd IconVault
    ```
3. **Create a branch** for your changes:
    ```bash
    git checkout -b add-icon-camera-off
    ```
4. Make your changes
5. Run the optimization and index generation:
    ```bash
    node tools/optimize.js
    node tools/generate-index.js
    ```
6. Submit a Pull Request

---

## Icon Requirements

### Design Specifications

| Property         | Outline / Custom   | Solid          | Mini           | Brands         |
| ---------------- | ------------------ | -------------- | -------------- | -------------- |
| **Canvas**       | 24×24px            | 24×24px        | 20×20px        | 24×24px        |
| **viewBox**      | `0 0 24 24`        | `0 0 24 24`    | `0 0 20 20`    | `0 0 24 24`    |
| **Stroke width** | 2px                | N/A            | N/A            | N/A            |
| **Fill**         | `none`             | `currentColor` | `currentColor` | `currentColor` |
| **Stroke**       | `currentColor`     | N/A            | N/A            | N/A            |
| **Corners**      | `round` cap & join | N/A            | N/A            | N/A            |

### Quality Standards

- **Pixel-perfect alignment** — align paths to the pixel grid where possible
- **Consistent weight** — maintain visual consistency with existing icons
- **Centered** — icons should be optically centered within the canvas
- **Padding** — leave at least 1px padding from the edge of the viewBox
- **Simplicity** — icons should be recognizable at small sizes (16px)

### SVG Requirements

- Must include `xmlns="http://www.w3.org/2000/svg"`
- Must include `viewBox` attribute
- Must use `currentColor` for dynamic coloring
- **No** hardcoded colors (no hex, rgb, or named colors)
- **No** `id`, `class`, or `data-*` attributes
- **No** `<style>` blocks, CSS, or inline styles
- **No** `width` or `height` attributes (let viewBox handle sizing)
- **No** `<title>`, `<desc>`, or `<metadata>` elements
- **No** raster images or `<image>` elements
- **No** JavaScript or event handlers
- Paths should be optimized (minimal nodes, clean curves)

---

## Adding a New Icon

### Step 1 — Design

Create your icon in a vector editor (Figma, Sketch, Illustrator, Inkscape) following the [Icon Requirements](#icon-requirements).

### Step 2 — Export & Optimize

1. Export as SVG
2. Place in the correct style directory:
    - `icons/outline/` — stroke-based, 24×24
    - `icons/solid/` — filled, 24×24
    - `icons/mini/` — filled, 20×20 (compact)
    - `icons/brands/` — brand logos, 24×24
    - `icons/custom/` — special-purpose, 24×24
3. Name the file using [kebab-case](#naming-conventions): `icon-name.svg`
4. Run the optimizer:
    ```bash
    node tools/optimize.js --verbose
    ```

### Step 3 — Update Metadata

Run the index generator to update `icons.json`:

```bash
node tools/generate-index.js
```

If automatic category/tag inference doesn't produce ideal results, you can manually edit `icons.json` to adjust categories and tags.

### Step 4 — Verify

1. Open `preview-site/index.html` in a browser
2. Search for your new icon
3. Verify it displays correctly at all sizes (16px–64px)
4. Test color changes
5. Check that the SVG raw code and React/Vue snippets look correct

---

## Naming Conventions

See [naming-conventions.md](naming-conventions.md) for the full naming standard. Quick reference:

- Use **kebab-case**: `arrow-right.svg`, `credit-card.svg`
- Use **descriptive names**: `shopping-cart.svg`, not `cart1.svg`
- Use **consistent stems**: if `chevron-up` exists, add `chevron-down`, not `arrow-caret-down`
- Avoid abbreviations: `calendar.svg`, not `cal.svg`
- Brands use the official name: `github.svg`, `linkedin.svg`

---

## Pull Request Process

1. **One PR per icon set** — group related icons (e.g., all chevron variants) in one PR
2. **Descriptive title**: `Add outline/solid camera-off icon`
3. **Include a preview** — attach a screenshot or link to the preview site showing the new icon(s)
4. **Update the changelog** — add an entry in the appropriate `changelog/YYYY-MM.md` file
5. **Pass all checks** — ensure `optimize.js` and `generate-index.js` run without errors

### PR Template

```markdown
## New Icons

- [ ] `camera-off` (outline, solid)
- [ ] Follows design specifications
- [ ] Optimized with `tools/optimize.js`
- [ ] `icons.json` updated via `tools/generate-index.js`
- [ ] Verified in preview site
- [ ] Changelog updated

### Preview

[screenshot or description]
```

---

## Code Contributions

Improvements to tools, preview site, or documentation are also welcome!

- **Tools**: Follow existing code style. Add CLI flags for new features.
- **Preview Site**: Keep it dependency-free (vanilla HTML/CSS/JS).
- **Documentation**: Use clear, concise English. Include code examples.

### Development

```bash
# Optimize all SVGs
node tools/optimize.js --verbose

# Regenerate icons.json and index.js
node tools/generate-index.js --verbose

# Preview: open in browser
open preview-site/index.html
```

---

## License

By contributing, you agree that your contributions will be released under [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) (icons) and [MIT License](../LICENSE) (code). This means your icons will be free for anyone to use without restriction.

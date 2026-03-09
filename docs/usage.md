# Usage Guide

IconVault icons can be used in any web project. Below you'll find integration examples for the most popular frameworks and tools.

---

## Table of Contents

- [Static HTML](#static-html)
- [React](#react)
- [Vue](#vue)
- [Tailwind CSS](#tailwind-css)
- [Sizing & Color](#sizing--color)
- [Accessibility](#accessibility)
- [Best Practices](#best-practices)

---

## Static HTML

### Inline SVG (Recommended)

Copy the SVG code directly into your HTML. This gives you full CSS control over size and color.

```html
<!-- Outline icon — uses stroke -->
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

### Using `<img>` Tag

```html
<img src="/icons/outline/home.svg" alt="Home" width="24" height="24" />
```

> **Note:** When using `<img>`, you cannot change the icon color with CSS. Use inline SVG or CSS `mask-image` for color control.

### CSS `mask-image` Technique

```css
.icon {
    display: inline-block;
    width: 24px;
    height: 24px;
    background-color: currentColor;
    mask-image: url("/icons/outline/home.svg");
    mask-size: contain;
    mask-repeat: no-repeat;
    -webkit-mask-image: url("/icons/outline/home.svg");
    -webkit-mask-size: contain;
    -webkit-mask-repeat: no-repeat;
}
```

```html
<span class="icon" style="color: #6366f1;"></span>
```

---

## React

### Direct SVG Component

```jsx
export function IconHome(props) {
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
            <path d="M3 9.5L12 2l9 7.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.5z" />
            <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
    );
}
```

### Usage

```jsx
import { IconHome } from "./icons/IconHome";

function App() {
    return (
        <nav>
            <IconHome width={24} height={24} className="text-indigo-500" />
        </nav>
    );
}
```

### Dynamic Icon Loader

```jsx
import { useState, useEffect } from "react";

function Icon({
    name,
    style = "outline",
    size = 24,
    color = "currentColor",
    ...props
}) {
    const [svg, setSvg] = useState("");

    useEffect(() => {
        fetch(`/icons/${style}/${name}.svg`)
            .then((r) => r.text())
            .then(setSvg);
    }, [name, style]);

    return (
        <span
            dangerouslySetInnerHTML={{ __html: svg }}
            style={{ width: size, height: size, color, display: "inline-flex" }}
            {...props}
        />
    );
}

// Usage
<Icon name="heart" style="solid" size={32} color="#ef4444" />;
```

---

## Vue

### Single File Component

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
        <path d="M3 9.5L12 2l9 7.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.5z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
</template>

<script setup>
defineProps({
    size: { type: Number, default: 24 },
});
</script>
```

### Dynamic Icon Component

```vue
<template>
    <span
        v-html="svgContent"
        :style="{
            width: size + 'px',
            height: size + 'px',
            color,
            display: 'inline-flex',
        }"
    />
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
    name: { type: String, required: true },
    style: { type: String, default: "outline" },
    size: { type: Number, default: 24 },
    color: { type: String, default: "currentColor" },
});

const svgContent = ref("");

watch(
    () => [props.name, props.style],
    async () => {
        const res = await fetch(`/icons/${props.style}/${props.name}.svg`);
        svgContent.value = await res.text();
    },
    { immediate: true },
);
</script>
```

---

## Tailwind CSS

Icons using `currentColor` automatically respond to Tailwind's text color utilities:

```html
<!-- Color via text utility -->
<svg class="w-6 h-6 text-indigo-500" ...>...</svg>

<!-- Size via width/height utilities -->
<svg class="w-8 h-8 text-gray-700" ...>...</svg>

<!-- Hover effects -->
<button class="group">
    <svg
        class="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors"
        ...
    >
        ...
    </svg>
</button>

<!-- Dark mode -->
<svg class="w-6 h-6 text-gray-800 dark:text-gray-200" ...>...</svg>
```

### Custom Tailwind Plugin (Optional)

```js
// tailwind.config.js
module.exports = {
    theme: {
        extend: {
            // Add custom icon sizes if needed
        },
    },
};
```

---

## Sizing & Color

### Size Control

All icons use `viewBox` so they scale cleanly to any size:

```html
<!-- Set via attributes -->
<svg width="16" height="16" ...>...</svg>
<svg width="48" height="48" ...>...</svg>

<!-- Set via CSS -->
<svg style="width: 2rem; height: 2rem;" ...>...</svg>
```

### Color Control

Icons use `currentColor`, so they inherit the parent's text color:

```html
<!-- Inherits parent color -->
<div style="color: #6366f1;">
    <svg ...>...</svg>
</div>

<!-- Direct color override -->
<svg style="color: #ef4444;" ...>...</svg>
```

### Recommended Sizes

| Context       | Size    | Use Case                    |
| ------------- | ------- | --------------------------- |
| Inline text   | 16px    | Within paragraphs, labels   |
| UI elements   | 20px    | Buttons, form fields        |
| Standard UI   | 24px    | Navigation, toolbars        |
| Feature icons | 32px    | Cards, section headers      |
| Hero/display  | 48-64px | Landing pages, empty states |

---

## Accessibility

Always provide accessible labels for icons:

```html
<!-- Decorative icon (hidden from screen readers) -->
<svg aria-hidden="true" ...>...</svg>

<!-- Meaningful icon (announce to screen readers) -->
<svg role="img" aria-label="Home">...</svg>

<!-- Icon button -->
<button aria-label="Close dialog">
    <svg aria-hidden="true" ...>...</svg>
</button>
```

---

## Best Practices

1. **Use inline SVG** for maximum control over color, size, and animations
2. **Prefer `currentColor`** — don't hardcode colors in SVG files
3. **Keep icons consistent** — use the same size and stroke width across your UI
4. **Outline for UI, Solid for emphasis** — outline icons work well for navigation; solid for active/selected states
5. **Mini (20px) for compact UI** — use mini icons in tight spaces like table rows or dense toolbars
6. **Always add `aria-hidden="true"`** to decorative icons
7. **Add `aria-label`** to icon-only buttons and links

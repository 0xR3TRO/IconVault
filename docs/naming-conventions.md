# Naming Conventions

Consistent naming makes icons easy to find, use, and maintain. This document defines the standards for icon file names, categories, and tags.

---

## File Naming

### Format

```
{name}.svg
```

All icon files use **kebab-case** (lowercase, words separated by hyphens).

### Rules

| Rule                  | Good                | Bad                 |
| --------------------- | ------------------- | ------------------- |
| Lowercase only        | `arrow-right.svg`   | `Arrow-Right.svg`   |
| Hyphens as separators | `credit-card.svg`   | `credit_card.svg`   |
| Descriptive names     | `shopping-cart.svg` | `cart1.svg`         |
| No abbreviations      | `calendar.svg`      | `cal.svg`           |
| No size in name       | `home.svg`          | `home-24.svg`       |
| No style in name      | `heart.svg`         | `heart-outline.svg` |
| No version numbers    | `search.svg`        | `search-v2.svg`     |

### Naming Patterns

**Simple objects:**

```
bell.svg, lock.svg, star.svg, heart.svg
```

**Compound objects:**

```
credit-card.svg, shopping-cart.svg, map-pin.svg
```

**Actions/states:**

```
arrow-up.svg, chevron-down.svg, external-link.svg
```

**Variant suffixes** (when needed):

```
alert-circle.svg, help-circle.svg, message-circle.svg
```

### Brand Icons

Brand icons use the **official lowercase name**:

```
github.svg, twitter.svg, linkedin.svg, youtube.svg
```

---

## Directory Structure

Icons are organized by **style** (visual treatment), not by category:

```
icons/
├── outline/     # Stroke-based, 24×24, stroke-width: 2
├── solid/       # Filled shapes, 24×24
├── mini/        # Filled, compact, 20×20
├── brands/      # Brand/logo icons, 24×24
└── custom/      # Special-purpose icons, 24×24
```

The **same icon name** is used across style directories:

```
icons/outline/heart.svg
icons/solid/heart.svg
icons/mini/heart.svg
```

---

## Categories

Categories describe the **domain** or **function** of an icon. Each icon belongs to one or more categories.

| Category        | Description                         | Examples                       |
| --------------- | ----------------------------------- | ------------------------------ |
| `ui`            | General user interface elements     | check, plus, minus, menu, grid |
| `arrows`        | Directional arrows and chevrons     | arrow-up, chevron-right        |
| `navigation`    | Navigation and wayfinding           | home, menu, globe, map-pin     |
| `media`         | Images, video, audio, content       | image, camera, heart, star     |
| `social`        | Social media and networking         | (used for brands/ icons)       |
| `communication` | Messaging, email, notifications     | mail, bell, message-circle     |
| `commerce`      | Shopping, payments, finance         | shopping-cart, credit-card     |
| `files`         | Documents, folders, data management | file, folder, clipboard, copy  |
| `devices`       | Hardware and device types           | monitor, smartphone, tablet    |
| `security`      | Authentication, privacy, protection | lock, unlock, shield, eye      |
| `system`        | System functions and utilities      | settings, clock, trash, code   |
| `weather`       | Weather and environmental           | sun, moon, cloud               |
| `data`          | Data display and visualization      | grid, filter, layers           |

### Assignment Rules

1. Every icon gets **at least one** category
2. Most icons get **two** categories (primary + secondary)
3. Maximum **three** categories per icon
4. The `ui` category is a catch-all for general interface icons

---

## Tags

Tags are **search keywords** that help users find icons. They go beyond the icon name.

### Tag Guidelines

1. **Include the icon name** split into words: `credit-card` → `credit`, `card`
2. **Add synonyms**: `trash` → `delete`, `remove`, `bin`, `garbage`
3. **Add related concepts**: `lock` → `secure`, `password`, `private`
4. **Add use-case terms**: `bell` → `notification`, `alert`, `ring`
5. **5–8 tags per icon** is ideal
6. Tags are **lowercase**, single words (no hyphens)

### Examples

| Icon            | Tags                                             |
| --------------- | ------------------------------------------------ |
| `home`          | home, house, main, start, dashboard              |
| `search`        | search, find, magnifier, lookup, discover, query |
| `shopping-cart` | shopping, cart, basket, buy, ecommerce, checkout |
| `github`        | github, git, repository, code, developer         |

---

## Consistency Rules

1. **If `chevron-up` exists, add `chevron-down`, `chevron-left`, `chevron-right`** — complete the set
2. **If an outline version exists, consider a solid version** — icons should ideally be available in at least outline + solid
3. **Use the same base name across styles** — `heart.svg` in both `outline/` and `solid/`
4. **New categories or naming patterns** should be discussed in an issue before implementation

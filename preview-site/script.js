/* ===================================================
   IconVault Preview — script.js
   Modular structure: Theme, Data, Filters, Grid, Modal, Copy
   =================================================== */

(function () {
    "use strict";

    // ─── Config ───────────────────────────────────────
    const DATA_URL = "../icons.json";
    const DEFAULT_SIZE = 24;
    const DEFAULT_COLOR_LIGHT = "#1a1a2e";
    const DEFAULT_COLOR_DARK = "#e2e4ea";

    // ─── DOM refs ─────────────────────────────────────
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => [...document.querySelectorAll(sel)];

    const dom = {
        body: document.documentElement,
        iconCount: $("#icon-count"),
        searchInput: $("#search-input"),
        searchClear: $("#search-clear"),
        styleFilters: $("#style-filters"),
        categoryFilters: $("#category-filters"),
        sizeSelector: $("#size-selector"),
        colorPicker: $("#color-picker"),
        colorReset: $("#color-reset"),
        grid: $("#icon-grid"),
        emptyState: $("#empty-state"),
        btnClearFilters: $("#btn-clear-filters"),
        resultsCount: $("#results-count"),
        modalOverlay: $("#modal-overlay"),
        modal: $("#modal"),
        modalClose: $("#modal-close"),
        modalPreview: $("#modal-preview"),
        modalTitle: $("#modal-title"),
        modalMeta: $("#modal-meta"),
        modalSizes: $("#modal-sizes"),
        codeBlock: $("#code-block"),
        btnCopy: $("#btn-copy"),
        toast: $("#toast"),
        btnTheme: $("#btn-theme"),
    };

    // ─── State ────────────────────────────────────────
    const state = {
        icons: [],
        flatIcons: [], // flattened: one entry per icon+style combo
        filteredIcons: [],
        activeStyle: "all",
        activeCategory: "all",
        previewSize: DEFAULT_SIZE,
        previewColor: DEFAULT_COLOR_LIGHT,
        searchQuery: "",
        activeTab: "svg",
        currentIcon: null,
        svgCache: {},
    };

    // ─── Theme module ─────────────────────────────────
    const Theme = {
        init() {
            const saved = localStorage.getItem("iconvault-theme");
            if (saved) {
                dom.body.setAttribute("data-theme", saved);
            } else if (
                window.matchMedia("(prefers-color-scheme: dark)").matches
            ) {
                dom.body.setAttribute("data-theme", "dark");
            }
            this.syncColor();
            dom.btnTheme.addEventListener("click", () => this.toggle());
        },
        toggle() {
            const isDark = dom.body.getAttribute("data-theme") === "dark";
            const next = isDark ? "light" : "dark";
            dom.body.setAttribute("data-theme", next);
            localStorage.setItem("iconvault-theme", next);
            this.syncColor();
        },
        syncColor() {
            const isDark = dom.body.getAttribute("data-theme") === "dark";
            const def = isDark ? DEFAULT_COLOR_DARK : DEFAULT_COLOR_LIGHT;
            state.previewColor = def;
            dom.colorPicker.value = def;
        },
        isDark() {
            return dom.body.getAttribute("data-theme") === "dark";
        },
    };

    // ─── Data module ──────────────────────────────────
    const Data = {
        async load() {
            try {
                const res = await fetch(DATA_URL);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                state.icons = data.icons || [];
                this.flatten();
                this.buildCategoryFilters(data.categories || []);
                dom.iconCount.textContent = `${state.icons.length} icons`;
            } catch (err) {
                console.error("Failed to load icons.json:", err);
                dom.resultsCount.textContent = "Error loading icon data.";
            }
        },
        flatten() {
            state.flatIcons = [];
            for (const icon of state.icons) {
                for (const style of icon.style) {
                    state.flatIcons.push({
                        name: icon.name,
                        style,
                        categories: icon.categories,
                        tags: icon.tags,
                        path: icon.paths[style],
                    });
                }
            }
        },
        buildCategoryFilters(categories) {
            const frag = document.createDocumentFragment();
            for (const cat of categories) {
                const btn = document.createElement("button");
                btn.className = "chip";
                btn.dataset.category = cat;
                btn.textContent = cat;
                frag.appendChild(btn);
            }
            dom.categoryFilters.appendChild(frag);
        },
    };

    // ─── SVG loader ───────────────────────────────────
    const SvgLoader = {
        async get(path) {
            if (state.svgCache[path]) return state.svgCache[path];
            try {
                const res = await fetch("../" + path);
                if (!res.ok) return "";
                const text = await res.text();
                state.svgCache[path] = text;
                return text;
            } catch {
                return "";
            }
        },
    };

    // ─── Filter module ────────────────────────────────
    const Filters = {
        init() {
            // Style chips
            dom.styleFilters.addEventListener("click", (e) => {
                const chip = e.target.closest(".chip");
                if (!chip) return;
                state.activeStyle = chip.dataset.style;
                this.updateChips(dom.styleFilters, chip);
                Grid.render();
            });

            // Category chips
            dom.categoryFilters.addEventListener("click", (e) => {
                const chip = e.target.closest(".chip");
                if (!chip) return;
                state.activeCategory = chip.dataset.category;
                this.updateChips(dom.categoryFilters, chip);
                Grid.render();
            });

            // Size chips
            dom.sizeSelector.addEventListener("click", (e) => {
                const chip = e.target.closest(".chip");
                if (!chip) return;
                state.previewSize = parseInt(chip.dataset.size, 10);
                this.updateChips(dom.sizeSelector, chip);
                Grid.updateSizes();
            });

            // Color picker
            dom.colorPicker.addEventListener("input", (e) => {
                state.previewColor = e.target.value;
                Grid.updateColors();
            });
            dom.colorReset.addEventListener("click", () => {
                Theme.syncColor();
                Grid.updateColors();
            });

            // Search
            let debounce;
            dom.searchInput.addEventListener("input", () => {
                clearTimeout(debounce);
                debounce = setTimeout(() => {
                    state.searchQuery = dom.searchInput.value
                        .trim()
                        .toLowerCase();
                    dom.searchClear.classList.toggle(
                        "hidden",
                        !state.searchQuery,
                    );
                    Grid.render();
                }, 200);
            });
            dom.searchClear.addEventListener("click", () => {
                dom.searchInput.value = "";
                state.searchQuery = "";
                dom.searchClear.classList.add("hidden");
                Grid.render();
            });

            // Clear all
            dom.btnClearFilters.addEventListener("click", () => {
                this.resetAll();
            });
        },
        updateChips(container, active) {
            for (const c of container.querySelectorAll(".chip"))
                c.classList.remove("active");
            active.classList.add("active");
        },
        resetAll() {
            state.activeStyle = "all";
            state.activeCategory = "all";
            state.searchQuery = "";
            dom.searchInput.value = "";
            dom.searchClear.classList.add("hidden");
            this.updateChips(
                dom.styleFilters,
                dom.styleFilters.querySelector('[data-style="all"]'),
            );
            this.updateChips(
                dom.categoryFilters,
                dom.categoryFilters.querySelector('[data-category="all"]'),
            );
            Grid.render();
        },
    };

    // ─── Grid module ──────────────────────────────────
    const Grid = {
        render() {
            const filtered = this.filter();
            state.filteredIcons = filtered;
            dom.resultsCount.textContent = `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`;
            dom.emptyState.classList.toggle("hidden", filtered.length > 0);
            dom.grid.classList.toggle("hidden", filtered.length === 0);

            const frag = document.createDocumentFragment();
            for (const icon of filtered) {
                frag.appendChild(this.createCard(icon));
            }
            dom.grid.innerHTML = "";
            dom.grid.appendChild(frag);

            // Lazy-load SVGs
            this.loadVisibleSvgs();
        },
        filter() {
            return state.flatIcons.filter((icon) => {
                if (
                    state.activeStyle !== "all" &&
                    icon.style !== state.activeStyle
                )
                    return false;
                if (
                    state.activeCategory !== "all" &&
                    !icon.categories.includes(state.activeCategory)
                )
                    return false;
                if (state.searchQuery) {
                    const q = state.searchQuery;
                    const haystack =
                        icon.name +
                        " " +
                        icon.tags.join(" ") +
                        " " +
                        icon.categories.join(" ");
                    if (!haystack.includes(q)) return false;
                }
                return true;
            });
        },
        createCard(icon) {
            const card = document.createElement("div");
            card.className = "icon-card";
            card.dataset.path = icon.path;
            card.dataset.name = icon.name;
            card.dataset.style = icon.style;

            card.innerHTML = `
        <div class="icon-card-svg" style="width:${state.previewSize}px;height:${state.previewSize}px;color:${state.previewColor};display:flex;align-items:center;justify-content:center;"></div>
        <span class="icon-card-name">${icon.name}</span>
        <span class="icon-card-style">${icon.style}</span>
      `;
            card.addEventListener("click", () => Modal.open(icon));
            return card;
        },
        async loadVisibleSvgs() {
            const cards = $$(".icon-card");
            const batchSize = 20;
            for (let i = 0; i < cards.length; i += batchSize) {
                const batch = cards.slice(i, i + batchSize);
                await Promise.all(
                    batch.map(async (card) => {
                        const path = card.dataset.path;
                        const svgText = await SvgLoader.get(path);
                        const container = card.querySelector(".icon-card-svg");
                        if (container && svgText) {
                            container.innerHTML = svgText;
                            const svg = container.querySelector("svg");
                            if (svg) {
                                svg.setAttribute("width", state.previewSize);
                                svg.setAttribute("height", state.previewSize);
                                svg.style.color = state.previewColor;
                            }
                        }
                    }),
                );
            }
        },
        updateSizes() {
            for (const card of $$(".icon-card")) {
                const container = card.querySelector(".icon-card-svg");
                if (container) {
                    container.style.width = state.previewSize + "px";
                    container.style.height = state.previewSize + "px";
                    const svg = container.querySelector("svg");
                    if (svg) {
                        svg.setAttribute("width", state.previewSize);
                        svg.setAttribute("height", state.previewSize);
                    }
                }
            }
        },
        updateColors() {
            for (const card of $$(".icon-card")) {
                const container = card.querySelector(".icon-card-svg");
                if (container) {
                    container.style.color = state.previewColor;
                    const svg = container.querySelector("svg");
                    if (svg) svg.style.color = state.previewColor;
                }
            }
        },
    };

    // ─── Modal module ─────────────────────────────────
    const Modal = {
        init() {
            dom.modalClose.addEventListener("click", () => this.close());
            dom.modalOverlay.addEventListener("click", (e) => {
                if (e.target === dom.modalOverlay) this.close();
            });
            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape") this.close();
            });

            // Code tabs
            for (const tab of $$(".code-tab")) {
                tab.addEventListener("click", () => {
                    state.activeTab = tab.dataset.tab;
                    for (const t of $$(".code-tab"))
                        t.classList.remove("active");
                    tab.classList.add("active");
                    this.renderCode();
                });
            }

            // Copy
            dom.btnCopy.addEventListener("click", () => Copy.exec());
        },
        async open(icon) {
            state.currentIcon = icon;
            state.activeTab = "svg";
            for (const t of $$(".code-tab"))
                t.classList.toggle("active", t.dataset.tab === "svg");

            const svgText = await SvgLoader.get(icon.path);

            // Preview
            dom.modalPreview.innerHTML = svgText;
            const previewSvg = dom.modalPreview.querySelector("svg");
            if (previewSvg) {
                previewSvg.style.width = "64px";
                previewSvg.style.height = "64px";
                previewSvg.style.color = state.previewColor;
            }

            // Title & meta
            dom.modalTitle.textContent = icon.name;
            dom.modalMeta.innerHTML =
                `<span class="tag">${icon.style}</span>` +
                icon.categories
                    .map((c) => `<span class="tag">${c}</span>`)
                    .join("") +
                (state.icons.find((i) => i.name === icon.name)?.tags || [])
                    .map((t) => `<span class="tag">${t}</span>`)
                    .join("");

            // Size previews
            const sizes = [16, 24, 32, 48, 64];
            const sizeEls = dom.modalSizes.querySelectorAll(".size-preview");
            sizeEls.forEach((el, i) => {
                const s = sizes[i];
                el.innerHTML = "";
                const clone = new DOMParser().parseFromString(
                    svgText,
                    "image/svg+xml",
                ).documentElement;
                clone.setAttribute("width", s);
                clone.setAttribute("height", s);
                clone.style.color = state.previewColor;
                el.appendChild(clone);
                const label = document.createElement("span");
                label.textContent = s + "px";
                el.appendChild(label);
            });

            this.renderCode();
            dom.modalOverlay.classList.remove("hidden");
            document.body.style.overflow = "hidden";
        },
        close() {
            dom.modalOverlay.classList.add("hidden");
            document.body.style.overflow = "";
            state.currentIcon = null;
        },
        renderCode() {
            if (!state.currentIcon) return;
            const svgRaw = state.svgCache[state.currentIcon.path] || "";
            let code = "";
            if (state.activeTab === "svg") {
                code = svgRaw.trim();
            } else if (state.activeTab === "react") {
                code = this.toReact(svgRaw, state.currentIcon.name);
            } else if (state.activeTab === "vue") {
                code = this.toVue(svgRaw, state.currentIcon.name);
            }
            dom.codeBlock.textContent = code;
        },
        toReact(svg, name) {
            const pascal = name
                .split("-")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join("");
            const jsxSvg = svg
                .replace(/stroke-width/g, "strokeWidth")
                .replace(/stroke-linecap/g, "strokeLinecap")
                .replace(/stroke-linejoin/g, "strokeLinejoin")
                .replace(/fill-rule/g, "fillRule")
                .replace(/clip-rule/g, "clipRule")
                .replace(/xmlns="[^"]*"/g, "")
                .replace(/<svg/, "<svg {...props}")
                .trim();
            return `export function Icon${pascal}(props) {\n  return (\n    ${jsxSvg}\n  );\n}`;
        },
        toVue(svg, name) {
            return `<template>\n  ${svg.trim()}\n</template>\n\n<script setup>\n// ${name} icon\n</script>`;
        },
    };

    // ─── Copy module ──────────────────────────────────
    const Copy = {
        exec() {
            const text = dom.codeBlock.textContent;
            if (!text) return;
            navigator.clipboard
                .writeText(text)
                .then(() => {
                    this.showToast("Copied to clipboard!");
                })
                .catch(() => {
                    // Fallback
                    this.fallbackCopy(text);
                });
        },
        fallbackCopy(text) {
            const ta = document.createElement("textarea");
            ta.value = text;
            ta.style.cssText = "position:fixed;left:-9999px";
            document.body.appendChild(ta);
            ta.select();
            try {
                document.execCommand("copy");
                this.showToast("Copied to clipboard!");
            } catch {
                this.showToast("Failed to copy.");
            }
            document.body.removeChild(ta);
        },
        showToast(msg) {
            dom.toast.textContent = msg;
            dom.toast.classList.remove("hidden");
            clearTimeout(this._timer);
            this._timer = setTimeout(
                () => dom.toast.classList.add("hidden"),
                2000,
            );
        },
    };

    // ─── Init ─────────────────────────────────────────
    async function init() {
        Theme.init();
        await Data.load();
        Filters.init();
        Modal.init();
        Grid.render();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();

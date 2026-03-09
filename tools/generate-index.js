#!/usr/bin/env node

/**
 * IconVault — generate-index.js
 * Scans /icons directory and generates metadata + index files.
 *
 * Outputs:
 *  - icons.json    — full metadata (name, path, style, categories, tags)
 *  - index.js      — ES module export for bundlers
 *
 * Usage:
 *   node tools/generate-index.js                  # generate all
 *   node tools/generate-index.js --out ./dist     # custom output dir
 *   node tools/generate-index.js --verbose         # detailed logging
 *   node tools/generate-index.js --format json     # only icons.json
 *   node tools/generate-index.js --format esm      # only index.js
 */

const fs = require("fs");
const path = require("path");

// ─── CLI args ───────────────────────────────────────
const args = process.argv.slice(2);
const flags = {
    out: null,
    verbose: args.includes("--verbose"),
    help: args.includes("--help") || args.includes("-h"),
    format: "all", // all | json | esm
};

const outIdx = args.indexOf("--out");
if (outIdx !== -1 && args[outIdx + 1]) {
    flags.out = path.resolve(args[outIdx + 1]);
}

const fmtIdx = args.indexOf("--format");
if (fmtIdx !== -1 && args[fmtIdx + 1]) {
    flags.format = args[fmtIdx + 1];
}

if (flags.help) {
    console.log(`
IconVault Index Generator

Usage:
  node tools/generate-index.js [options]

Options:
  --out <dir>       Output directory (default: project root)
  --format <type>   Output format: all, json, esm (default: all)
  --verbose         Show detailed processing info
  --help, -h        Show this help message

Examples:
  node tools/generate-index.js
  node tools/generate-index.js --out ./dist
  node tools/generate-index.js --format json --verbose
`);
    process.exit(0);
}

// ─── Config ─────────────────────────────────────────
const ROOT = path.resolve(__dirname, "..");
const ICONS_DIR = path.join(ROOT, "icons");
const OUT_DIR = flags.out || ROOT;

const VALID_STYLES = ["outline", "solid", "mini", "brands", "custom"];

// Category + tag inference based on icon name
const CATEGORY_RULES = [
    { pattern: /arrow|chevron/, categories: ["arrows", "navigation"] },
    {
        pattern: /home|menu|globe|map|external|link|search/,
        categories: ["navigation"],
    },
    { pattern: /bell|mail|message|phone|share/, categories: ["communication"] },
    {
        pattern: /facebook|github|instagram|linkedin|twitter|youtube/,
        categories: ["social"],
    },
    { pattern: /lock|unlock|shield|eye/, categories: ["security"] },
    { pattern: /heart|star|bookmark|image|camera/, categories: ["media"] },
    { pattern: /file|folder|clipboard|copy/, categories: ["files"] },
    {
        pattern: /monitor|smartphone|tablet|battery|wifi/,
        categories: ["devices"],
    },
    { pattern: /dollar|credit|shopping/, categories: ["commerce"] },
    { pattern: /sun|moon|cloud/, categories: ["weather"] },
    { pattern: /grid|filter|layers|chart/, categories: ["data"] },
    {
        pattern:
            /settings|clock|calendar|trash|download|upload|edit|code|info|alert|help|zap|user/,
        categories: ["system"],
    },
];

const TAG_RULES = [
    {
        pattern: /arrow-down/,
        tags: ["down", "arrow", "direction", "move", "south"],
    },
    {
        pattern: /arrow-up/,
        tags: ["up", "arrow", "direction", "move", "north"],
    },
    {
        pattern: /arrow-left/,
        tags: ["left", "arrow", "direction", "move", "back", "west"],
    },
    {
        pattern: /arrow-right/,
        tags: ["right", "arrow", "direction", "move", "forward", "east"],
    },
    { pattern: /chevron/, tags: ["chevron", "arrow", "caret"] },
    { pattern: /home/, tags: ["home", "house", "main", "start", "dashboard"] },
    {
        pattern: /search/,
        tags: ["search", "find", "magnifier", "lookup", "discover"],
    },
    { pattern: /bell/, tags: ["bell", "notification", "alert", "ring"] },
    { pattern: /heart/, tags: ["heart", "love", "like", "favorite"] },
    { pattern: /star/, tags: ["star", "rating", "favorite", "bookmark"] },
    {
        pattern: /user/,
        tags: ["user", "person", "account", "profile", "avatar"],
    },
    { pattern: /lock/, tags: ["lock", "secure", "password", "private"] },
    {
        pattern: /mail/,
        tags: ["mail", "email", "envelope", "message", "inbox"],
    },
    {
        pattern: /settings/,
        tags: ["settings", "gear", "cog", "preferences", "config"],
    },
];

// ─── Helpers ────────────────────────────────────────
function log(msg) {
    if (flags.verbose) console.log(`  ${msg}`);
}

function toPascalCase(str) {
    return str
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join("");
}

function inferCategories(name) {
    const cats = new Set(["ui"]);
    for (const rule of CATEGORY_RULES) {
        if (rule.pattern.test(name)) {
            for (const c of rule.categories) cats.add(c);
        }
    }
    return [...cats];
}

function inferTags(name) {
    const tags = new Set(name.split("-"));
    for (const rule of TAG_RULES) {
        if (rule.pattern.test(name)) {
            for (const t of rule.tags) tags.add(t);
        }
    }
    return [...tags];
}

// ─── Scanner ────────────────────────────────────────
function scanIcons() {
    const iconMap = new Map(); // name -> { name, style[], categories, tags, paths }

    for (const style of VALID_STYLES) {
        const styleDir = path.join(ICONS_DIR, style);
        if (!fs.existsSync(styleDir)) {
            log(`Skipping missing directory: ${style}/`);
            continue;
        }

        const files = fs
            .readdirSync(styleDir)
            .filter((f) => f.endsWith(".svg"))
            .sort();
        log(`${style}/ — ${files.length} icons`);

        for (const file of files) {
            const name = file.replace(".svg", "");
            const relPath = `icons/${style}/${file}`;

            if (iconMap.has(name)) {
                const existing = iconMap.get(name);
                existing.style.push(style);
                existing.paths[style] = relPath;
            } else {
                iconMap.set(name, {
                    name,
                    style: [style],
                    categories: inferCategories(name),
                    tags: inferTags(name),
                    paths: { [style]: relPath },
                });
            }
        }
    }

    return [...iconMap.values()].sort((a, b) => a.name.localeCompare(b.name));
}

// ─── Generators ─────────────────────────────────────
function generateJson(icons) {
    const allCategories = [
        ...new Set(icons.flatMap((i) => i.categories)),
    ].sort();

    const data = {
        name: "IconVault",
        version: "1.0.0",
        license: "CC0-1.0",
        totalIcons: icons.length,
        styles: VALID_STYLES,
        categories: allCategories,
        icons,
    };

    const outPath = path.join(OUT_DIR, "icons.json");
    fs.writeFileSync(outPath, JSON.stringify(data, null, 2) + "\n", "utf-8");
    console.log(`  ✓ Generated ${outPath}`);
}

function generateEsm(icons) {
    const lines = [
        "// Auto-generated by tools/generate-index.js",
        "// Do not edit manually.",
        "",
        "export const icons = [",
    ];

    for (const icon of icons) {
        lines.push(`  {`);
        lines.push(`    name: '${icon.name}',`);
        lines.push(
            `    style: [${icon.style.map((s) => `'${s}'`).join(", ")}],`,
        );
        lines.push(
            `    categories: [${icon.categories.map((c) => `'${c}'`).join(", ")}],`,
        );
        lines.push(`    tags: [${icon.tags.map((t) => `'${t}'`).join(", ")}],`);
        lines.push(`    paths: {`);
        for (const [s, p] of Object.entries(icon.paths)) {
            lines.push(`      ${s}: '${p}',`);
        }
        lines.push(`    },`);
        lines.push(`  },`);
    }

    lines.push("];");
    lines.push("");
    lines.push(
        `export const styles = [${VALID_STYLES.map((s) => `'${s}'`).join(", ")}];`,
    );
    lines.push("");

    const allCategories = [
        ...new Set(icons.flatMap((i) => i.categories)),
    ].sort();
    lines.push(
        `export const categories = [${allCategories.map((c) => `'${c}'`).join(", ")}];`,
    );
    lines.push("");

    // Named exports per icon for tree-shaking
    lines.push("// Named exports for tree-shaking");
    for (const icon of icons) {
        const varName = "icon" + toPascalCase(icon.name);
        lines.push(
            `export const ${varName} = icons.find(i => i.name === '${icon.name}');`,
        );
    }
    lines.push("");

    const outPath = path.join(OUT_DIR, "index.js");
    fs.writeFileSync(outPath, lines.join("\n"), "utf-8");
    console.log(`  ✓ Generated ${outPath}`);
}

// ─── Main ───────────────────────────────────────────
function main() {
    console.log("IconVault Index Generator");
    console.log("─".repeat(40));

    const icons = scanIcons();
    console.log(`\nScanned ${icons.length} unique icons\n`);

    if (!fs.existsSync(OUT_DIR)) {
        fs.mkdirSync(OUT_DIR, { recursive: true });
    }

    if (flags.format === "all" || flags.format === "json") {
        generateJson(icons);
    }
    if (flags.format === "all" || flags.format === "esm") {
        generateEsm(icons);
    }

    console.log("\nDone.");
}

main();

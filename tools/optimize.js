#!/usr/bin/env node

/**
 * IconVault — optimize.js
 * Automated SVG optimization tool.
 *
 * Features:
 *  - Removes unnecessary attributes (id, class, data-*, xml:space, etc.)
 *  - Normalizes viewBox
 *  - Sets fill="none" + stroke="currentColor" for outline/mini icons
 *  - Sets fill="currentColor" for solid/brands icons
 *  - Removes XML declarations, comments, and metadata
 *  - Strips empty groups and unnecessary wrappers
 *
 * Usage:
 *   node tools/optimize.js                  # optimize all icons
 *   node tools/optimize.js --style outline  # only outline icons
 *   node tools/optimize.js --dry-run        # preview changes without writing
 *   node tools/optimize.js --verbose        # detailed logging
 */

const fs = require("fs");
const path = require("path");

// ─── CLI args ───────────────────────────────────────
const args = process.argv.slice(2);
const flags = {
    style: null,
    dryRun: args.includes("--dry-run"),
    verbose: args.includes("--verbose"),
    help: args.includes("--help") || args.includes("-h"),
};

const styleIdx = args.indexOf("--style");
if (styleIdx !== -1 && args[styleIdx + 1]) {
    flags.style = args[styleIdx + 1];
}

if (flags.help) {
    console.log(`
IconVault SVG Optimizer

Usage:
  node tools/optimize.js [options]

Options:
  --style <name>   Only optimize icons in a specific style folder
                   (outline, solid, mini, brands, custom)
  --dry-run        Preview changes without writing files
  --verbose        Show detailed processing info
  --help, -h       Show this help message

Examples:
  node tools/optimize.js
  node tools/optimize.js --style outline
  node tools/optimize.js --dry-run --verbose
`);
    process.exit(0);
}

// ─── Config ─────────────────────────────────────────
const ICONS_DIR = path.resolve(__dirname, "..", "icons");
const STYLES_WITH_STROKE = ["outline", "mini", "custom"];
const STYLES_WITH_FILL = ["solid", "brands"];

const REMOVE_ATTRS = [
    "id",
    "class",
    "data-name",
    "xml:space",
    "style",
    "enable-background",
    "version",
    "x",
    "y",
];

// ─── Helpers ────────────────────────────────────────
function log(msg) {
    if (flags.verbose) console.log(`  ${msg}`);
}

function getAllSvgFiles(dir) {
    const results = [];
    if (!fs.existsSync(dir)) return results;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results.push(...getAllSvgFiles(fullPath));
        } else if (entry.name.endsWith(".svg")) {
            results.push(fullPath);
        }
    }
    return results;
}

function getStyleFromPath(filePath) {
    const rel = path.relative(ICONS_DIR, filePath);
    return rel.split(path.sep)[0];
}

// ─── Optimization ───────────────────────────────────
function optimizeSvg(content, style) {
    let svg = content;

    // Remove XML declaration
    svg = svg.replace(/<\?xml[^?]*\?>\s*/gi, "");

    // Remove comments
    svg = svg.replace(/<!--[\s\S]*?-->/g, "");

    // Remove DOCTYPE
    svg = svg.replace(/<!DOCTYPE[^>]*>/gi, "");

    // Remove metadata, title, desc elements
    svg = svg.replace(/<metadata[\s\S]*?<\/metadata>/gi, "");
    svg = svg.replace(/<title[\s\S]*?<\/title>/gi, "");
    svg = svg.replace(/<desc[\s\S]*?<\/desc>/gi, "");

    // Remove unwanted attributes from <svg> tag
    for (const attr of REMOVE_ATTRS) {
        const re = new RegExp(`\\s+${attr}="[^"]*"`, "gi");
        svg = svg.replace(re, "");
    }

    // Remove empty groups: <g> ... </g> where g has no attributes
    svg = svg.replace(/<g>\s*([\s\S]*?)\s*<\/g>/g, "$1");

    // Normalize viewBox for known styles
    if (style === "mini") {
        if (!svg.includes("viewBox")) {
            svg = svg.replace(/<svg/, '<svg viewBox="0 0 20 20"');
        }
    } else if (!svg.includes("viewBox")) {
        svg = svg.replace(/<svg/, '<svg viewBox="0 0 24 24"');
    }

    // Ensure correct fill/stroke per style
    if (STYLES_WITH_STROKE.includes(style)) {
        // Ensure fill="none" on <svg>
        if (!svg.match(/<svg[^>]*fill="none"/)) {
            svg = svg.replace(/<svg([^>]*)fill="[^"]*"/, '<svg$1fill="none"');
            if (!svg.match(/<svg[^>]*fill=/)) {
                svg = svg.replace(/<svg/, '<svg fill="none"');
            }
        }
        // Ensure stroke="currentColor" on <svg>
        if (!svg.match(/<svg[^>]*stroke="currentColor"/)) {
            svg = svg.replace(
                /<svg([^>]*)stroke="[^"]*"/,
                '<svg$1stroke="currentColor"',
            );
            if (!svg.match(/<svg[^>]*stroke=/)) {
                svg = svg.replace(/<svg/, '<svg stroke="currentColor"');
            }
        }
    } else if (STYLES_WITH_FILL.includes(style)) {
        // Ensure fill="currentColor" on <svg>
        if (!svg.match(/<svg[^>]*fill="currentColor"/)) {
            svg = svg.replace(
                /<svg([^>]*)fill="[^"]*"/,
                '<svg$1fill="currentColor"',
            );
            if (!svg.match(/<svg[^>]*fill=/)) {
                svg = svg.replace(/<svg/, '<svg fill="currentColor"');
            }
        }
    }

    // Remove width/height from <svg> (let viewBox handle sizing)
    svg = svg.replace(/<svg([^>]*)\s+width="[^"]*"/g, "<svg$1");
    svg = svg.replace(/<svg([^>]*)\s+height="[^"]*"/g, "<svg$1");

    // Clean up multiple spaces
    svg = svg.replace(/\s{2,}/g, " ").trim();

    // Ensure xmlns is present
    if (!svg.includes("xmlns=")) {
        svg = svg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    return svg;
}

// ─── Main ───────────────────────────────────────────
function main() {
    console.log("IconVault SVG Optimizer");
    console.log("─".repeat(40));

    let files = getAllSvgFiles(ICONS_DIR);

    if (flags.style) {
        files = files.filter((f) => getStyleFromPath(f) === flags.style);
        console.log(`Style filter: ${flags.style}`);
    }

    console.log(`Found ${files.length} SVG files\n`);

    let optimized = 0;
    let unchanged = 0;

    for (const file of files) {
        const style = getStyleFromPath(file);
        const original = fs.readFileSync(file, "utf-8");
        const result = optimizeSvg(original, style);

        if (result !== original) {
            optimized++;
            log(`✓ Optimized: ${path.relative(ICONS_DIR, file)}`);
            if (!flags.dryRun) {
                fs.writeFileSync(file, result, "utf-8");
            }
        } else {
            unchanged++;
            log(`– Unchanged: ${path.relative(ICONS_DIR, file)}`);
        }
    }

    console.log(`\nResults:`);
    console.log(`  Optimized: ${optimized}`);
    console.log(`  Unchanged: ${unchanged}`);
    if (flags.dryRun) console.log(`  (dry-run mode — no files were modified)`);
    console.log("Done.");
}

main();

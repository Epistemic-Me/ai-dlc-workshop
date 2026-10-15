#!/usr/bin/env node
// PR docs gate. Checks that a PR has its planning docs in docs/prs/.
//
// Usage:
//   node scripts/pr-docs-check.mjs --ticket BUG-01
//   node scripts/pr-docs-check.mjs --branch feature/pr-BUG-01-merge-lines --base origin/main
//
// Blocking: RESEARCH.md, TEST-STRATEGY.md, IMPLEMENTATION-PLAN.md exist and are filled.
// Advisory: IMPLEMENTATION.md, REVIEW.md.
// Exempt (with --base): docs-only changes, dependency bumps, and changes of at most
// PR_DOCS_MAX_SMALL_LINES changed lines outside docs (default 20).
// Exit codes: 0 pass or exempt, 1 fail, 2 usage error.

import { execFileSync } from "node:child_process";
import { appendFileSync, existsSync, readdirSync, readFileSync, realpathSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

export const BLOCKING = ["RESEARCH.md", "TEST-STRATEGY.md", "IMPLEMENTATION-PLAN.md"];
export const ADVISORY = ["IMPLEMENTATION.md", "REVIEW.md"];
export const MIN_BYTES = 200;
const LIFECYCLE = ["planning", "implementing", "_archive"];
const DEP_FILES = new Set(["package.json", "package-lock.json"]);

export function ticketFromBranch(branch) {
  const match = /(?:^|\/)pr-([A-Za-z]+-\d+|\d+)(?:-|$)/.exec(branch ?? "");
  return match ? match[1].toUpperCase() : null;
}

export function findPrFolder(root, ticket) {
  const needle = `-PR-${ticket}-`.toLowerCase();
  for (const stage of LIFECYCLE) {
    const dir = join(root, "docs/prs", stage);
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir).sort()) {
      const full = join(dir, name);
      if (statSync(full).isDirectory() && `${name.toLowerCase()}-`.includes(needle)) return full;
    }
  }
  return null;
}

// A doc is filled when it is long enough and has no template placeholders left.
export function checkDoc(folder, name) {
  const path = join(folder, name);
  if (!existsSync(path)) return { name, ok: false, detail: "missing" };
  const text = readFileSync(path, "utf8");
  if (Buffer.byteLength(text) < MIN_BYTES) return { name, ok: false, detail: `too short (${Buffer.byteLength(text)} bytes)` };
  if (/<TICKET>|<short-name>|<YYYY-MM-DD>/.test(text)) return { name, ok: false, detail: "template placeholders left" };
  return { name, ok: true, detail: "filled" };
}

// changes: [{ file, added, deleted }] from `git diff --numstat`.
export function exemption(changes, maxSmallLines = 20) {
  if (changes.length === 0) return null;
  const isDoc = (f) => f.endsWith(".md") || f.startsWith("docs/");
  if (changes.every((c) => isDoc(c.file))) return "docs-only change";
  if (changes.every((c) => DEP_FILES.has(c.file))) return "dependency bump";
  const codeLines = changes.filter((c) => !isDoc(c.file)).reduce((n, c) => n + c.added + c.deleted, 0);
  if (codeLines <= maxSmallLines) return `small change (${codeLines} lines, limit ${maxSmallLines})`;
  return null;
}

export function evaluate({ root, ticket, changes = [], maxSmallLines = 20 }) {
  const exempt = exemption(changes, maxSmallLines);
  if (exempt) return { status: "EXEMPT", reason: exempt, rows: [], advisory: [] };
  if (!ticket) {
    return {
      status: "FAIL",
      rows: [{ name: "Ticket ID", ok: false, detail: "none found; name the branch feature/pr-<TICKET>-<short-name>" }],
      advisory: [],
    };
  }
  const folder = findPrFolder(root, ticket);
  if (!folder) {
    return {
      status: "FAIL",
      rows: [{ name: "PR docs folder", ok: false, detail: `no docs/prs/*/*-PR-${ticket}-* folder` }],
      advisory: [],
    };
  }
  const rows = [{ name: "PR docs folder", ok: true, detail: folder.slice(root.length + 1) }, ...BLOCKING.map((n) => checkDoc(folder, n))];
  const advisory = ADVISORY.map((n) => checkDoc(folder, n));
  return { status: rows.every((r) => r.ok) ? "PASS" : "FAIL", rows, advisory };
}

export function summary(result, ticket) {
  const lines = [`## PR docs gate: ${result.status}`, ""];
  if (ticket) lines.push(`Ticket: ${ticket}`, "");
  if (result.status === "EXEMPT") {
    lines.push(`Exempt: ${result.reason}. No PR docs required.`);
    return lines.join("\n") + "\n";
  }
  lines.push("| Check | Result | Detail |", "|---|---|---|");
  for (const r of result.rows) lines.push(`| ${r.name} | ${r.ok ? "PASS" : "FAIL"} | ${r.detail} |`);
  if (result.advisory.length) {
    lines.push("", "Advisory (does not block):", "", "| Check | Result | Detail |", "|---|---|---|");
    for (const r of result.advisory) lines.push(`| ${r.name} | ${r.ok ? "PASS" : "MISSING"} | ${r.detail} |`);
  }
  return lines.join("\n") + "\n";
}

function changedFiles(base) {
  const out = execFileSync("git", ["diff", "--numstat", `${base}...HEAD`], { encoding: "utf8" });
  return out
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [added, deleted, file] = line.split("\t");
      return { file, added: Number(added) || 0, deleted: Number(deleted) || 0 };
    });
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i]?.replace(/^--/, "");
    if (!["ticket", "branch", "base"].includes(key) || argv[i + 1] === undefined) return null;
    args[key] = argv[i + 1];
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args) {
    console.error("Usage: pr-docs-check.mjs [--ticket <ID>] [--branch <name>] [--base <git ref>]");
    process.exit(2);
  }
  const ticket = (args.ticket ?? ticketFromBranch(args.branch))?.toUpperCase() ?? null;
  const changes = args.base ? changedFiles(args.base) : [];
  const maxSmallLines = Number(process.env.PR_DOCS_MAX_SMALL_LINES ?? 20);
  const result = evaluate({ root: process.cwd(), ticket, changes, maxSmallLines });
  const text = summary(result, ticket);
  process.stdout.write(text);
  writeFileSync(process.env.PR_DOCS_SUMMARY_FILE ?? join(tmpdir(), "pr-docs-summary.md"), text);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, text);
  process.exit(result.status === "FAIL" ? 1 : 0);
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main();

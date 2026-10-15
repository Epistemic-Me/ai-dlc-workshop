import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { evaluate, exemption, summary, ticketFromBranch } from "./pr-docs-check.mjs";

const filled = "# Doc\n\n" + "This section is filled in with real content for the ticket.\n".repeat(5);

function repoWith(folder, files) {
  const root = mkdtempSync(join(tmpdir(), "gate-"));
  const dir = join(root, "docs/prs", folder);
  mkdirSync(dir, { recursive: true });
  for (const [name, text] of Object.entries(files)) writeFileSync(join(dir, name), text);
  return root;
}

describe("ticketFromBranch", () => {
  it.each([
    ["feature/pr-BUG-01-merge-lines", "BUG-01"],
    ["feature/pr-legacy-06-orders-route", "LEGACY-06"],
    ["feature/pr-036-save-cart", "036"],
    ["main", null],
    [undefined, null],
  ])("%s -> %s", (branch, ticket) => {
    expect(ticketFromBranch(branch)).toBe(ticket);
  });
});

describe("exemption", () => {
  it("exempts docs-only changes", () => {
    expect(exemption([{ file: "docs/x.md", added: 300, deleted: 0 }])).toBe("docs-only change");
  });

  it("exempts dependency bumps", () => {
    expect(exemption([{ file: "package-lock.json", added: 900, deleted: 800 }])).toBe("dependency bump");
  });

  it("exempts small code changes and not large ones", () => {
    expect(exemption([{ file: "src/a.ts", added: 10, deleted: 5 }])).toMatch(/^small change/);
    expect(exemption([{ file: "src/a.ts", added: 30, deleted: 5 }])).toBeNull();
    expect(exemption([{ file: "src/a.ts", added: 30, deleted: 5 }], 50)).toMatch(/^small change/);
  });
});

describe("evaluate", () => {
  const big = [{ file: "src/a.ts", added: 100, deleted: 0 }];

  it("passes when the three planning docs are filled", () => {
    const root = repoWith("planning/2026-10-15-PR-BUG-01-merge-lines", {
      "RESEARCH.md": filled,
      "TEST-STRATEGY.md": filled,
      "IMPLEMENTATION-PLAN.md": filled,
    });
    const result = evaluate({ root, ticket: "BUG-01", changes: big });
    expect(result.status).toBe("PASS");
    expect(result.advisory.map((r) => r.ok)).toEqual([false, false]);
  });

  it("fails on a missing doc or a template left unfilled", () => {
    const root = repoWith("implementing/2026-10-15-PR-BUG-01-merge-lines", {
      "RESEARCH.md": filled + "<TICKET>",
      "TEST-STRATEGY.md": filled,
    });
    const result = evaluate({ root, ticket: "BUG-01", changes: big });
    expect(result.status).toBe("FAIL");
    expect(result.rows.filter((r) => !r.ok).map((r) => [r.name, r.detail])).toEqual([
      ["RESEARCH.md", "template placeholders left"],
      ["IMPLEMENTATION-PLAN.md", "missing"],
    ]);
  });

  it("does not match a longer ticket number", () => {
    const root = repoWith("planning/2026-10-15-PR-BUG-010-other", { "RESEARCH.md": filled });
    expect(evaluate({ root, ticket: "BUG-01", changes: big }).rows[0].name).toBe("PR docs folder");
    expect(evaluate({ root, ticket: "BUG-01", changes: big }).status).toBe("FAIL");
  });

  it("fails with no ticket and no exemption", () => {
    const root = repoWith("planning/x", {});
    expect(evaluate({ root, ticket: null, changes: big }).status).toBe("FAIL");
  });

  it("prints a pass and fail table", () => {
    const root = repoWith("planning/x", {});
    const text = summary(evaluate({ root, ticket: "FEAT-02", changes: big }), "FEAT-02");
    expect(text).toContain("## PR docs gate: FAIL");
    expect(text).toContain("| PR docs folder | FAIL |");
  });
});

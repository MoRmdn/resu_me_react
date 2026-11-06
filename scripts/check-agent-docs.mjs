// AGENTS.md is the one project guide for every coding agent. This fails if a
// tool-specific instruction file starts carrying its own copy of the rules.
//
//   CLAUDE.md must be exactly `@AGENTS.md` (Claude Code's import syntax).
//   Any other tool file, if it exists, must be a short pointer to AGENTS.md.

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const read = (file) => readFileSync(join(root, file), "utf8");
const problems = [];

if (!existsSync(join(root, "AGENTS.md"))) {
  problems.push("AGENTS.md is missing. It is the project guide for every agent.");
}

if (!existsSync(join(root, "CLAUDE.md"))) {
  problems.push("CLAUDE.md is missing. It must contain only `@AGENTS.md`.");
} else if (read("CLAUDE.md").trim() !== "@AGENTS.md") {
  problems.push(
    "CLAUDE.md must contain only `@AGENTS.md`. Move whatever was added to it into AGENTS.md.",
  );
}

const MAX_POINTER_LINES = 10;
const pointers = [
  "GEMINI.md",
  "KIMI.md",
  ".cursorrules",
  ".windsurfrules",
  ".github/copilot-instructions.md",
];

for (const file of pointers) {
  if (!existsSync(join(root, file))) continue;
  const text = read(file);
  const lines = text.split("\n").filter((line) => line.trim() !== "").length;
  if (!text.includes("AGENTS.md") || lines > MAX_POINTER_LINES) {
    problems.push(
      `${file} must be a short pointer to AGENTS.md (at most ${MAX_POINTER_LINES} lines). Move its rules into AGENTS.md.`,
    );
  }
}

if (problems.length > 0) {
  console.error("Agent instructions are out of sync:\n");
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log("Agent instructions OK: AGENTS.md is the single source.");

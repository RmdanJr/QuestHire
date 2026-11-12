#!/usr/bin/env node
/**
 * Submission guard (Kiroween rules):
 *  - /.kiro must exist at the repo root and must NOT be gitignored.
 *  - A LICENSE file must exist.
 *  - The local fixture folder (.local/, holds the personal resume) must stay ignored.
 *
 * Ignore rules are evaluated with the `ignore` package, so this script does not
 * need to spawn git (and works where git is not installed).
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import ignore from "ignore";

/**
 * @param {{ hasKiroDir: boolean, hasLicense: boolean, gitignoreText: string }} facts
 * @returns {string[]} human-readable problems; empty when everything is fine
 */
export function findProblems({ hasKiroDir, hasLicense, gitignoreText }) {
  const problems = [];
  const matcher = ignore().add(gitignoreText);

  if (!hasKiroDir) {
    problems.push("Missing /.kiro directory at the repo root (required for submission).");
  }
  if (!hasLicense) {
    problems.push("Missing LICENSE file (an open source license must be detectable).");
  }
  if (matcher.ignores(".kiro/steering/product.md") || matcher.ignores(".kiro/hooks/x.json")) {
    problems.push("/.kiro is gitignored. Remove it from .gitignore (could disqualify the submission).");
  }
  if (!matcher.ignores(".local/fixtures/resume.pdf")) {
    problems.push(".local/ is not gitignored. Personal resume fixtures could be committed.");
  }
  return problems;
}

function main() {
  const root = process.cwd();
  const gitignorePath = join(root, ".gitignore");
  const problems = findProblems({
    hasKiroDir: existsSync(join(root, ".kiro")),
    hasLicense: existsSync(join(root, "LICENSE")),
    gitignoreText: existsSync(gitignorePath) ? readFileSync(gitignorePath, "utf8") : "",
  });

  if (problems.length > 0) {
    console.error("Repo guard failed:");
    for (const p of problems) console.error(" - " + p);
    process.exit(1);
  }
  console.log("Repo guard OK: .kiro tracked, LICENSE present, local fixtures ignored.");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}

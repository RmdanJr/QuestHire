#!/usr/bin/env node
/**
 * Submission guard (Kiroween rules):
 *  - /.kiro must exist at the repo root and must NOT be gitignored.
 *  - A LICENSE file must exist.
 *  - The resume fixture folder must stay ignored.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const problems = [];

if (!existsSync(join(root, ".kiro"))) {
  problems.push("Missing /.kiro directory at the repo root (required for submission).");
}
if (!existsSync(join(root, "LICENSE"))) {
  problems.push("Missing LICENSE file (an open source license must be detectable).");
}

function isIgnored(path) {
  try {
    execFileSync("git", ["check-ignore", "-q", path], { cwd: root, stdio: "ignore" });
    return true; // exit code 0 means the path is ignored
  } catch {
    return false;
  }
}

if (existsSync(join(root, ".git"))) {
  if (isIgnored(".kiro/steering/placeholder.md") || isIgnored(".kiro")) {
    problems.push("/.kiro is gitignored. Remove it from .gitignore (could disqualify the submission).");
  }
  if (!isIgnored(".local/fixtures/resume.pdf")) {
    problems.push(".local/ is not gitignored. Personal resume fixtures could be committed.");
  }
}

const gitignore = existsSync(join(root, ".gitignore"))
  ? readFileSync(join(root, ".gitignore"), "utf8")
  : "";
const activeLines = gitignore
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith("#"));
if (activeLines.some((l) => /^\/?\.kiro\/?\*{0,2}$/.test(l))) {
  problems.push(".gitignore contains an active .kiro rule.");
}

if (problems.length > 0) {
  console.error("Repo guard failed:");
  for (const p of problems) console.error(" - " + p);
  process.exit(1);
}
console.log("Repo guard OK: .kiro tracked, LICENSE present, local fixtures ignored.");

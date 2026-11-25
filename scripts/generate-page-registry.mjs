import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const planPath = fileURLToPath(new URL("../APP-PLAN.md", import.meta.url));
const outPath = fileURLToPath(new URL("../src/config/pages.json", import.meta.url));

const lines = readFileSync(planPath, "utf8").split(/\r?\n/);
const pages = [];
let moduleName = "";

const rowPattern = /^\|\s*(\d+)\s*\|\s*(.+?)\s*\|\s*`([^`]+)`\s*\|\s*([A-Z]+)\s*\|\s*(.*?)\s*\|$/;
const modulePattern = /^### 7\.\d+\s+(.+)$/;
const referenceMap = { E: "strong", P: "partial", N: "none" };

for (const line of lines) {
  const moduleMatch = line.match(modulePattern);
  if (moduleMatch) {
    moduleName = moduleMatch[1].trim();
    continue;
  }

  const rowMatch = line.match(rowPattern);
  if (!rowMatch) continue;

  const [, number, title, route, template, reference] = rowMatch;
  pages.push({
    number: Number(number),
    title,
    route,
    template,
    module: moduleName,
    reference: referenceMap[reference[0]] ?? "none",
  });
}

const expected = 222;
if (pages.length !== expected) {
  throw new Error(`Expected ${expected} pages, parsed ${pages.length}`);
}

const routes = new Set(pages.map((page) => page.route));
if (routes.size !== pages.length) {
  throw new Error("Duplicate routes found in APP-PLAN.md");
}

const numbers = pages.map((page) => page.number);
for (let index = 0; index < expected; index += 1) {
  if (numbers[index] !== index + 1) {
    throw new Error(`Page numbering gap at ${index + 1}: got ${numbers[index]}`);
  }
}

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, `${JSON.stringify({ generatedFrom: "APP-PLAN.md", pages }, null, 2)}\n`);
console.log(`Wrote ${pages.length} pages across ${new Set(pages.map((page) => page.module)).size} modules.`);

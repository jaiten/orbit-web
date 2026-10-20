// Runs the shared quick-add cases from the Orbit repo against the TypeScript port.
import cases from "./quick-add.cases.json" with { type: "json" };
import { parse } from "../src/lib/quick-add";

const now = new Date(cases.now);
let failed = 0;
for (const c of cases.cases as { input: string; defaultDate?: string; expect: Record<string, unknown> }[]) {
  const got = parse(c.input, c.defaultDate ?? null, now) as unknown as Record<string, unknown>;
  const bad = Object.entries(c.expect).filter(([k, v]) => got[k] !== v);
  if (bad.length) {
    failed++;
    console.error(`✗ "${c.input}"`, bad.map(([k, v]) => `${k}: expected ${JSON.stringify(v)}, got ${JSON.stringify(got[k])}`).join("; "));
  }
}
console.log(`${cases.cases.length - failed}/${cases.cases.length} quick-add cases pass`);
process.exit(failed ? 1 : 0);

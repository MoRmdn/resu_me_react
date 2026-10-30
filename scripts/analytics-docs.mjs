/**
 * Generates docs/ANALYTICS-EVENTS.md from lib/analytics/catalog.ts and checks the
 * catalog against GA's limits, so the two cannot drift apart.
 *
 *   npm run analytics:docs              rewrite the file
 *   npm run analytics:docs -- --check   fail if it is stale (CI runs this)
 *
 * Either mode fails on a broken rule, listing every problem.
 */
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import ts from "typescript";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUTPUT = path.join(ROOT, "docs/ANALYTICS-EVENTS.md");

/** The limits of a standard GA4 property. */
const LIMITS = {
  eventName: 40,
  paramName: 40,
  paramValue: 100,
  paramsPerEvent: 25,
  eventDimensions: 50,
  userDimensions: 25,
  metrics: 50,
  userPropertyName: 24,
};

const MIN_DESCRIPTION = 25;

/** Added to every event by track(), so they count against the per-event limit. */
const AUTOMATIC_PARAMS = ["event_description", "section_id"];

/** GA refuses these, or already uses them for its own automatic events. */
const RESERVED_EVENTS = new Set([
  "ad_activeview", "ad_click", "ad_exposure", "ad_query", "ad_reward", "adunit_exposure",
  "app_clear_data", "app_exception", "app_install", "app_remove", "app_store_refund",
  "app_store_subscription_cancel", "app_store_subscription_convert",
  "app_store_subscription_renew", "app_update", "app_upgrade", "click", "dynamic_link_app_open",
  "dynamic_link_app_update", "dynamic_link_first_open", "error", "file_download", "first_open",
  "first_visit", "form_start", "form_submit", "in_app_purchase", "notification_dismiss",
  "notification_foreground", "notification_open", "notification_receive", "notification_send",
  "os_update", "page_view", "screen_view", "scroll", "session_start", "user_engagement",
  "video_complete", "video_progress", "video_start", "view_search_results",
]);
const RESERVED_PREFIX = /^(_|ga_|google_|firebase_)/;
const SNAKE_CASE = /^[a-z][a-z0-9_]*$/;

/** Loads a TypeScript module with no dependencies of its own at runtime. */
async function loadModule(file, directory) {
  const source = await readFile(path.join(ROOT, file), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  });
  const target = path.join(directory, `${path.basename(file, ".ts")}.mjs`);
  await writeFile(target, outputText);
  return import(target);
}

function validate({ EVENTS, PARAMS, USER_PROPERTIES }, SENTENCES) {
  const problems = [];
  const used = new Set(AUTOMATIC_PARAMS);

  for (const [name, spec] of Object.entries(EVENTS)) {
    if (name.length > LIMITS.eventName) problems.push(`${name}: event name is over 40 characters`);
    if (!SNAKE_CASE.test(name)) problems.push(`${name}: event name is not snake_case`);
    if (RESERVED_EVENTS.has(name) || RESERVED_PREFIX.test(name)) {
      problems.push(`${name}: event name is reserved by GA`);
    }
    if (spec.description.length < MIN_DESCRIPTION) {
      problems.push(`${name}: description is too short to be useful`);
    }

    const params = [...spec.params, ...(spec.optional ?? [])];
    params.forEach((param) => used.add(param));

    const total = new Set([...params, ...AUTOMATIC_PARAMS]).size;
    if (total > LIMITS.paramsPerEvent) problems.push(`${name}: sends ${total} params, limit is 25`);

    const sentence = SENTENCES[name];
    if (!sentence) problems.push(`${name}: has no sentence in sentences.ts`);
    for (const [, param] of sentence?.matchAll(/\{(\w+)\}/g) ?? []) {
      if (!params.includes(param) && !AUTOMATIC_PARAMS.includes(param)) {
        problems.push(`${name}: its sentence uses {${param}}, which the event does not send`);
      }
    }
  }

  for (const name of Object.keys(SENTENCES)) {
    if (!EVENTS[name]) problems.push(`${name}: has a sentence but is not in the catalog`);
  }

  for (const [name, spec] of Object.entries(PARAMS)) {
    if (name.length > LIMITS.paramName) problems.push(`${name}: param name is over 40 characters`);
    if (!SNAKE_CASE.test(name)) problems.push(`${name}: param name is not snake_case`);
    if (RESERVED_PREFIX.test(name)) problems.push(`${name}: param name uses a reserved prefix`);
    if (spec.description.length < MIN_DESCRIPTION) {
      problems.push(`${name}: description is too short to be useful`);
    }
    if (!used.has(name)) problems.push(`${name}: param is declared but no event sends it`);
  }

  const specs = Object.values(PARAMS);
  const dimensions = specs.filter((spec) => !spec.builtIn && !spec.metric).length;
  const metrics = specs.filter((spec) => spec.metric).length;
  const userDimensions = Object.keys(USER_PROPERTIES).length;

  if (dimensions > LIMITS.eventDimensions) {
    problems.push(`${dimensions} event-scoped custom dimensions, limit is 50`);
  }
  if (metrics > LIMITS.metrics) problems.push(`${metrics} custom metrics, limit is 50`);
  if (userDimensions > LIMITS.userDimensions) {
    problems.push(`${userDimensions} user-scoped custom dimensions, limit is 25`);
  }
  for (const name of Object.keys(USER_PROPERTIES)) {
    if (name.length > LIMITS.userPropertyName) {
      problems.push(`${name}: user property name is over 24 characters`);
    }
  }

  return problems;
}

const cell = (text) => String(text).replaceAll("|", "\\|").replaceAll("\n", " ");

function table(headers, rows) {
  return [
    `| ${headers.join(" | ")} |`,
    `|${headers.map(() => "---").join("|")}|`,
    ...rows.map((row) => `| ${row.map(cell).join(" | ")} |`),
  ].join("\n");
}

function render({ EVENTS, PARAMS, USER_PROPERTIES }, SENTENCES) {
  const events = Object.entries(EVENTS);
  const groups = [...new Set(events.map(([, spec]) => spec.group))];
  const params = Object.entries(PARAMS);
  const code = (name) => `\`${name}\``;

  const eventSections = groups.map((group) => {
    const entries = events
      .filter(([, spec]) => spec.group === group)
      .map(([name, spec]) => {
        const optional = spec.optional ?? [];
        return [
          `### \`${name}\`${spec.keyEvent ? " (key event)" : ""}`,
          "",
          spec.description,
          "",
          `- **Fires on:** ${spec.trigger}`,
          `- **Sentence:** ${SENTENCES[name]}`,
          `- **Params:** ${[...spec.params].map(code).join(", ")}`,
          ...(optional.length ? [`- **Optional:** ${optional.map(code).join(", ")}`] : []),
        ].join("\n");
      });
    return [`## ${group}`, "", ...entries.flatMap((entry) => [entry, ""])].join("\n").trimEnd();
  });

  return `# Analytics events

Generated from \`lib/analytics/catalog.ts\` by \`npm run analytics:docs\`. **Do not
edit by hand.** CI fails if this file is stale. The rules are in
[ANALYTICS.md](ANALYTICS.md).

Every event also carries \`event_description\` and \`section_id\`.

${eventSections.join("\n\n")}

## Parameters

${table(
  ["Parameter", "Type", "Values", "Description"],
  params.map(([name, spec]) => [
    code(name),
    spec.type,
    spec.values?.join(", ") ?? "",
    spec.description,
  ]),
)}

## Register these in GA

Admin → Data display → Custom definitions. Custom parameters do not appear in
reports until they are registered, and registering is not retroactive.

### Custom dimensions, scope Event

${table(
  ["Dimension name", "Event parameter", "Description"],
  params
    .filter(([, spec]) => !spec.builtIn && !spec.metric)
    .map(([name, spec]) => [spec.label, code(name), spec.description]),
)}

### Custom dimensions, scope User

${table(
  ["Dimension name", "User property", "Description"],
  Object.entries(USER_PROPERTIES).map(([name, spec]) => [
    spec.label,
    code(name),
    spec.description,
  ]),
)}

### Custom metrics, scope Event, unit Seconds

${table(
  ["Metric name", "Event parameter", "Description"],
  params
    .filter(([, spec]) => spec.metric)
    .map(([name, spec]) => [spec.label, code(name), spec.description]),
)}

### Key events

${events
  .filter(([, spec]) => spec.keyEvent)
  .map(([name]) => `- ${code(name)}`)
  .join("\n")}
`;
}

const directory = await mkdtemp(path.join(tmpdir(), "analytics-docs-"));

try {
  const catalog = await loadModule("lib/analytics/catalog.ts", directory);
  const { SENTENCES } = await loadModule("lib/analytics/sentences.ts", directory);

  const problems = validate(catalog, SENTENCES);
  if (problems.length > 0) {
    console.error(`Analytics catalog has ${problems.length} problem(s):`);
    problems.forEach((problem) => console.error(`  - ${problem}`));
    process.exitCode = 1;
  } else {
    const output = render(catalog, SENTENCES);

    if (process.argv.includes("--check")) {
      const current = await readFile(OUTPUT, "utf8").catch(() => "");
      if (current !== output) {
        console.error("docs/ANALYTICS-EVENTS.md is stale. Run: npm run analytics:docs");
        process.exitCode = 1;
      } else {
        console.log("Analytics catalog is valid and its docs are current.");
      }
    } else {
      await writeFile(OUTPUT, output);
      const events = Object.keys(catalog.EVENTS).length;
      console.log(`Wrote docs/ANALYTICS-EVENTS.md: ${events} events.`);
    }
  }
} finally {
  await rm(directory, { recursive: true, force: true });
}

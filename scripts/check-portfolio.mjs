/** Integration checks against the actual static export, including both locales. */
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
const reviews = JSON.parse(await readFile("content/reviews.json", "utf8"));
const decode = (text) =>
  text
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
for (const locale of ["en", "ar"]) {
  const prefix = locale === "ar" ? "ar/" : "";
  const html = await readFile(`out/${prefix}index.html`, "utf8");
  assert.match(
    html,
    new RegExp(`<html[^>]*lang="${locale}"[^>]*dir="${locale === "ar" ? "rtl" : "ltr"}"`),
  );
  assert.ok(html.includes(`href="https://mormdn.com/${prefix}"`), "Self canonical is present");
  assert.match(html, /hrefLang="en"/i);
  assert.match(html, /hrefLang="ar"/i);
  const wall = html.slice(
    html.indexOf('<section id="reviews"'),
    html.indexOf('<section id="contact"'),
  );
  const cards = [...wall.matchAll(/<article class="review-card"[\s\S]*?<\/article>/g)].map(
    (m) => m[0],
  );
  assert.equal(cards.length, reviews.length, "Canonical reviews appear once, with no clones");
  const initial = wall.match(/<ul class="review-list">([\s\S]*?)<\/ul>/)?.[1];
  assert.equal(
    (initial?.match(/class="review-slot"/g) ?? []).length,
    6,
    "Six reviews precede the disclosure",
  );
  for (const review of reviews) {
    const card = cards.find((card) => card.includes(`data-review="${review.id}"`));
    assert.ok(card, `Review ${review.id} is server-rendered`);
    const quotes = [...card.matchAll(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/g)].map((m) =>
      decode(m[1]),
    );
    assert.ok(quotes.includes(review.quote), `Original wording preserved: ${review.id}`);
  }
  for (const element of html.matchAll(/<(?:a|button|summary)\b[^>]*>/g)) {
    assert.match(element[0], /data-track=/, `Tracked control: ${element[0].slice(0, 80)}`);
  }
  for (const [, params] of html.matchAll(/data-track-params="([^"]*)"/g)) {
    const data = JSON.parse(decode(params));
    assert.equal(
      "review_id" in data || "author" in data || "quote" in data,
      false,
      "No review PII in event attributes",
    );
  }
  for (const [, href] of html.matchAll(/href="(\/(?!\/)[^"#?]*)[^" ]*"/g)) {
    const pathname = decode(href);
    const file = pathname.endsWith("/") ? `${pathname}index.html` : pathname;
    assert.ok((await stat(join("out", file))).isFile(), `Local destination exists: ${pathname}`);
  }
  const privacy = await readFile(`out/${prefix}privacy/index.html`, "utf8");
  assert.match(privacy, /content="noindex, follow"/);
  assert.match(privacy, new RegExp(`lang="${locale}"`));
  assert.ok(!html.includes("Apps live on both stores"));
}
const english = await readFile("out/index.html", "utf8");
assert.ok(english.indexOf('id="social-proof"') < english.indexOf('id="about"'));
assert.ok(english.indexOf('class="testimonial-list"') < english.indexOf('id="ayco"'));
assert.match(english, /The problem/);
assert.match(english, /My responsibility/);
assert.match(english, /Key decisions/);
assert.match(english, /The result/);
const llms = await readFile("out/llms.txt", "utf8");
assert.match(llms, /Offline-ready visits/);
assert.match(llms, /Private client · no public listing/);
console.log(
  `Verified both locales, all ${reviews.length} verbatim reviews, tracked controls, static links and project stories.`,
);

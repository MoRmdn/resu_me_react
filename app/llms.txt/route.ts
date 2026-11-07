import { about, contactCopy, hero, llmsCopy, projectsCopy } from "@/content/copy";
import { clientCountries, unplacedClients } from "@/content/clients";
import { experiences } from "@/content/experience";
import { projects } from "@/content/projects";
import { reviewPlatforms, reviewTotal } from "@/content/reviews";
import { channels, contact, education, site, socials } from "@/content/site";
import { skillGroups } from "@/content/skills";

// `output: "export"` refuses to build a route handler that has not
// declared itself static, so llms.txt needs this explicitly.
export const dynamic = "force-static";

/**
 * /llms.txt, in the shape llmstxt.org proposes: an H1, a one-line summary in a
 * blockquote, then sections of Markdown links.
 *
 * Nothing here is written by hand. Every fact is read from content/, the same
 * source the page renders, so a CV change reaches this file on the next build
 * instead of leaving a stale copy behind.
 *
 * No major search or AI provider has committed to reading this file. It is
 * cheap and harmless, not a ranking lever. The file repeats the homepage, so
 * firebase.json sends it `X-Robots-Tag: noindex`, as it does the RSC payloads.
 */
export function GET() {
  const lines: string[] = [];
  const add = (...parts: string[]) => lines.push(...parts);

  add(`# ${site.name}`, "", `> ${site.description}`, "");
  add(
    `${site.title} · ${site.subtitle} · ${site.location} (${site.timezone}) · ${contactCopy.availability}.`,
    "",
    hero.intro,
    "",
    about.lede,
    "",
    ...about.body.flatMap((paragraph) => [paragraph, ""]),
  );

  add(`## ${llmsCopy.contactHeading}`, "", contactCopy.blurb, "");
  add(
    `- [${llmsCopy.emailLabel}](${contact.emailUrl}): ${contact.email}`,
    `- [${llmsCopy.phoneLabel}](${contact.phoneUrl}): ${contact.phoneDisplay}`,
    ...channels
      .filter((c) => c.url.startsWith("http"))
      .map((c) => `- [${c.label}](${c.url}): ${c.note}`),
    "",
  );

  add(`## ${llmsCopy.experienceHeading}`, "");
  for (const e of experiences) {
    add(
      `### ${e.position}, ${e.company}`,
      "",
      `${e.startDate} – ${e.endDate} · ${e.location}${e.engagement ? ` · ${e.engagement}` : ""}`,
      "",
      e.description,
      "",
      ...e.achievements.map((a) => `- ${a}`),
      "",
    );
  }

  add(`## ${llmsCopy.projectsHeading}`, "");
  for (const p of projects) {
    const listings = [
      p.links.website && `[Website](${p.links.website})`,
      p.links.appStore && `[App Store](${p.links.appStore})`,
      p.links.playStore && `[Google Play](${p.links.playStore})`,
      p.links.github && `[Source](${p.links.github})`,
    ].filter(Boolean);
    add(
      `### ${p.title}`,
      "",
      `${p.category} · ${p.country} · ${p.technologies.join(", ")}`,
      "",
      p.longDescription,
      projectsCopy.availability[p.availability],
      ...(p.story
        ? [
            p.story.problem,
            p.story.responsibility,
            ...p.story.decisions.map((d) => `- ${d}`),
            p.story.result,
          ]
        : []),
      "",
      `${llmsCopy.outcomeLabel}: ${p.achievement}`,
      ...(p.bundleId ? [`${llmsCopy.applicationIdLabel}: ${p.bundleId}`] : []),
      ...(listings.length ? [listings.join(" · ")] : p.linkStatus ? [p.linkStatus] : []),
      "",
      ...(p.highlights ?? []).map((h) => `- ${h}`),
      ...(p.highlights?.length ? [""] : []),
    );
  }

  add(`## ${llmsCopy.skillsHeading}`, "");
  add(...skillGroups.map((g) => `- ${g.label}: ${g.items.join(", ")}`), "");

  const placed = clientCountries.flatMap((c) => Object.values(c.clients));
  const unplaced = Object.values(unplacedClients);
  const clientTotal = [...placed, ...unplaced].reduce((sum, n) => sum + (n ?? 0), 0);
  add(
    `## ${llmsCopy.reviewsHeading}`,
    "",
    llmsCopy.reviewsSummary(reviewTotal, reviewPlatforms.length),
    "",
    llmsCopy.clientsSummary(
      clientTotal,
      clientCountries.length,
      clientCountries.map((c) => c.name).join(", "),
    ),
    "",
    ...reviewPlatforms.map((p) => `- [${p.label}](${p.url}): ${p.count} ${p.countLabel}`),
    "",
  );

  add(`## ${llmsCopy.educationHeading}`, "", ...education.map((e) => `- ${e}`), "");

  add(
    `## ${llmsCopy.optionalHeading}`,
    "",
    `- [${llmsCopy.profileLabel}](${site.url}/): ${llmsCopy.profileNote}`,
    `- [${llmsCopy.cvLabel}](${site.url}${contact.resumeUrl}): ${llmsCopy.cvNote}`,
    ...socials.map((s) => `- [${s.label}](${s.url}): ${s.handle}`),
    `- [${llmsCopy.privacyLabel}](${site.url}/privacy/): ${llmsCopy.privacyNote}`,
  );

  return new Response(`${lines.join("\n").trimEnd()}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

/**
 * A project title split into the names someone would search for. Titles are
 * display strings: "MisMar | مسمار" is bilingual (the part after the pipe is a
 * translation), "AYCO — Maintenance Reports" carries a subtitle. The bare name
 * leads; the full title and any translation are aliases.
 *
 * Here rather than in content/projects.ts because client components need it, and
 * importing from that file would pull every project into their bundle.
 */
export function projectNames(title: string) {
  const [primary, ...translations] = title.split("|").map((part) => part.trim());
  const name = primary.split(" — ")[0].trim();
  const alternateName = [...(name !== primary ? [primary] : []), ...translations];
  return { name, alternateName };
}

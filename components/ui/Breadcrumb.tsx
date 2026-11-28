import { ui } from "@/content/copy-i18n";
import type { Locale } from "@/content/locale";
import { trackAttrs } from "@/lib/analytics/attrs";

export type Crumb = {
  label: string;
  /** Omitted on the current page. */
  href?: string;
  /** Sent as link_target: home, projects, services. */
  target: string;
};

/**
 * Where this page sits: Home / Projects / AYCO. The last item is the current
 * page and is not a link. Plain anchors: a full page load starts a fresh count
 * of sections and scroll depth.
 */
export function Breadcrumb({ locale, items }: { locale: Locale; items: Crumb[] }) {
  return (
    <nav aria-label={ui[locale].breadcrumb} className="text-caption text-bone-52">
      <ol className="flex flex-wrap items-center gap-x-2">
        {items.map((item, i) => (
          <li key={item.target} className="flex items-center gap-2">
            {i > 0 && (
              <span aria-hidden className="text-bone-38">
                /
              </span>
            )}
            {item.href ? (
              <a
                href={item.href}
                className="inline-flex min-h-11 items-center transition-colors duration-fast ease-fast hover:text-bone"
                {...trackAttrs("nav_link_click", {
                  link_target: item.target,
                  link_text: item.label,
                  nav_location: "breadcrumb",
                })}
              >
                {item.label}
              </a>
            ) : (
              <span aria-current="page" className="inline-flex min-h-11 items-center text-bone-70">
                <bdi>{item.label}</bdi>
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

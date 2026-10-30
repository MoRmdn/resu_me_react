import { ProjectImage } from "./ProjectImage";
import { IconTile } from "./IconTile";
import type { swipeAttrs } from "@/lib/analytics/attrs";
import { cn } from "@/lib/cn";
import type { ProjectMedia } from "@/content/types";

/**
 * Plates 02–04 — the media column of a project card. DESIGN-SYSTEM §5.2.
 *
 * One rule governs all of them: no supplied asset ever touches the page
 * background directly. Containment only — no blend modes, no background
 * removal. Every plate provides its own ink ground and hairline.
 */
export function ProjectPlate({
  media,
  title,
  className,
}: {
  media: ProjectMedia;
  title: string;
  className?: string;
}) {
  const ground = cn(
    "relative overflow-hidden bg-ink-800",
    "min-h-[320px] lg:min-h-[520px]",
    className,
  );

  // Plate 05 — no capture at all. The icon carries the card rather than
  // stretching a logo into a space it was never drawn for.
  if (media.plate === "icon" || !media.asset) {
    return (
      <div className={cn(ground, "flex items-center justify-center")}>
        {media.icon && <IconTile icon={media.icon} title={title} size={128} />}
      </div>
    );
  }

  const { file, width, height, alt, bezel } = media.asset;

  // Plate 02 — device. Seated whole, top-anchored, with clearance below so it
  // reads as placed rather than cropped. The bezel radius scales with the
  // render width; a source that already has its own frame gets neither border
  // nor radius, because a bezel drawn around a bezel looks like a mistake.
  if (media.plate === "device") {
    return (
      <div className={ground}>
        <ProjectImage
          file={file}
          widths={[240, 480]}
          sizes="(max-width: 900px) 200px, 240px"
          alt={alt}
          width={width}
          height={height}
          className={cn(
            "absolute top-9 left-1/2 block w-[200px] -translate-x-1/2 lg:w-[238px]",
            bezel && "rounded-[24px] border border-line-strong",
          )}
        />
      </div>
    );
  }

  // Plate 03 — field. The asset brings its own brand ground, so it goes
  // full-bleed and the plate contributes only the hairline and the clip.
  if (media.plate === "field") {
    return (
      <div className={ground}>
        <ProjectImage
          file={file}
          widths={[240, 480]}
          sizes="(max-width: 900px) 100vw, 320px"
          alt={alt}
          width={width}
          height={height}
          className="absolute inset-0 size-full object-cover object-center"
        />
      </div>
    );
  }

  // Plate 04 — promo. Shown whole and never cropped: its composition IS the
  // asset, and cropping discards the part that was designed. The ink
  // letterboxes at the sides are correct, not a gap to be closed.
  return (
    <div className={ground}>
      <ProjectImage
        file={file}
        widths={[280, 560]}
        sizes="(max-width: 900px) 220px, 280px"
        alt={alt}
        width={width}
        height={height}
        className="absolute inset-0 size-full object-contain p-4"
      />
    </div>
  );
}

/**
 * Three store-listing screens, seated whole on a stepped baseline: the offsets
 * are the layer metaphor, and a hover squares the set up. Below `sm` three
 * across would be thumbnails, so the set becomes a scroller of its own, which
 * is why it takes keyboard focus.
 */
export function ScreenStrip({
  screens,
  label,
  swipe,
  className,
}: {
  screens: NonNullable<ProjectMedia["screens"]>;
  label: string;
  /** From `swipeAttrs`, so the first sideways scroll is reported. */
  swipe?: ReturnType<typeof swipeAttrs>;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center bg-ink-800", className)}>
      <div
        role="region"
        aria-label={label}
        tabIndex={0}
        className="w-full overflow-x-auto sm:overflow-visible"
        {...swipe}
      >
        <ul className="flex snap-x snap-mandatory gap-3 p-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-8 sm:pt-8 sm:pb-14">
          {screens.map((screen) => (
            <li
              key={screen.file}
              className="screen-strip__item w-[62vw] max-w-[260px] shrink-0 snap-center sm:w-auto sm:max-w-none"
            >
              <ProjectImage
                file={screen.file}
                widths={[280, 560]}
                sizes="(min-width: 680px) 210px, 62vw"
                alt={screen.alt}
                width={screen.width}
                height={screen.height}
                className="block h-auto w-full rounded-md border border-line-strong"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * Arcit-AI's two 1:1 posts. A different aspect from the tall store promos, so
 * they get their own two-up strip instead of being forced into that grid —
 * applying the uniform-set rule honestly rather than bending it.
 */
export function SocialStrip({
  social,
}: {
  social: NonNullable<ProjectMedia["social"]>;
}) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {social.map((post) => (
        <li
          key={post.file}
          className="relative aspect-square overflow-hidden rounded-lg border border-line bg-ink-800"
        >
          <ProjectImage
            file={post.file}
            widths={[300, 600]}
            sizes="(max-width: 640px) 100vw, 300px"
            alt={post.alt}
            width={post.width}
            height={post.height}
            className="absolute inset-0 size-full object-contain"
          />
        </li>
      ))}
    </ul>
  );
}

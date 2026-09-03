import manifest from "@/content/media-manifest.json";

const DIR = "/images/projects";

/**
 * The widths that actually exist for a slug, published by `npm run images`.
 * Falls back to the requested set only if a slug is somehow missing from the
 * manifest, which would mean the generator has not been run.
 */
function availableWidths(file: string, preferred: number[]): number[] {
  const real = (manifest as Record<string, number[]>)[file];
  return real?.length ? real : preferred;
}

/**
 * A <picture> over the variants `npm run images` generates. Static export has
 * no image-optimisation server, so the srcset is built from the known widths
 * rather than by next/image.
 */
export function ProjectImage({
  file,
  widths,
  sizes,
  alt,
  width,
  height,
  className,
  style,
}: {
  file: string;
  widths: number[];
  sizes: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const real = availableWidths(file, widths);
  const set = (ext: string) =>
    real.map((w) => `${DIR}/${file}/${file}-${w}.${ext} ${w}w`).join(", ");

  return (
    <picture>
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
      <img
        src={`${DIR}/${file}/${file}-${real[0]}.webp`}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className={className}
        style={style}
      />
    </picture>
  );
}

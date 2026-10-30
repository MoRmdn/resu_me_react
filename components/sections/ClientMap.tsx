import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { ClientMapExplorer } from "@/components/sections/ClientMapExplorer";
import { clientMapCopy } from "@/content/copy";
import { clientCountries, clientsIn, type ClientFilter } from "@/content/clients";
import { reviewPlatforms } from "@/content/reviews";
import worldMap from "@/content/world-map.json";

const FILTERS: ClientFilter[] = ["all", ...reviewPlatforms.map((p) => p.id)];

/** Copper at 16–38%: Tier 3 material, and log so Saudi Arabia cannot wash out the rest. */
function fillWeight(clients: number, most: number) {
  if (!clients) return 0;
  return 0.16 + 0.22 * (Math.log(clients) / Math.log(Math.max(most, 2)));
}

function weights(country: (typeof clientCountries)[number]) {
  return Object.fromEntries(
    FILTERS.map((filter) => {
      const most = Math.max(...clientCountries.map((c) => clientsIn(c, filter)));
      return [`--w-${filter}`, fillWeight(clientsIn(country, filter), most).toFixed(3)];
    }),
  );
}

/**
 * Where the clients are, on a world map. Fiverr's "World Domination" panel, for
 * all five sites at once.
 *
 * The geometry is rendered here, on the server, so it stays out of the client
 * bundle; ClientMapExplorer only holds the filter and the hover. Everything the
 * map says is also in the ranked list it renders, which is the part screen
 * readers and crawlers get.
 *
 * The intro is CSS keyed off Reveal's `data-visible`, staggered by `--i` from
 * the nearest country outward. The finished map is the base style, so with no
 * JS or reduced motion it is simply already there.
 */
export function ClientMap() {
  const shapes = worldMap.countries.flatMap((shape) => {
    const country = clientCountries.find((c) => c.id === shape.id);
    return country ? [{ ...shape, country }] : [];
  });

  const platformsOf = (country: (typeof clientCountries)[number]) =>
    Object.keys(country.clients).join(" ");

  return (
    <Reveal className="mt-24 md:mt-32">
      <ClientMapExplorer
        height={worldMap.height}
        width={worldMap.width}
        platforms={reviewPlatforms.map(({ id, label }) => ({ id, label }))}
        positions={Object.fromEntries(shapes.map((s) => [s.id, [s.x, s.y]]))}
      >
        <Image
          src="/images/world-land.svg"
          alt=""
          width={worldMap.width}
          height={worldMap.height}
          loading="lazy"
          unoptimized
          className="absolute inset-0 size-full"
        />
        <svg
          viewBox={`0 0 ${worldMap.width} ${worldMap.height}`}
          role="img"
          aria-label={clientMapCopy.mapLabel}
          className="absolute inset-0 size-full"
        >
          {shapes.map(({ id, path, order, country }) => (
            <path
              key={id}
              className="map-country"
              d={path}
              data-map-target={id}
              data-platforms={platformsOf(country)}
              style={{ "--i": order, ...weights(country) } as React.CSSProperties}
            />
          ))}

          {shapes.map(
            ({ id, arc, order, country }) =>
              arc && (
                <path
                  key={id}
                  className="map-arc"
                  d={arc}
                  pathLength={1}
                  data-map-target={id}
                  data-platforms={platformsOf(country)}
                  style={{ "--i": order } as React.CSSProperties}
                />
              ),
          )}

          {shapes.map(({ id, x, y, order, country }) => (
            <g key={id} data-platforms={platformsOf(country)} className="map-marker">
              <circle
                className="map-dot"
                cx={x}
                cy={y}
                r={2.2}
                data-map-target={id}
                style={{ "--i": order } as React.CSSProperties}
              />
              {/* Kuwait is a pixel wide. This is what the pointer actually hits. */}
              <circle className="map-hit" cx={x} cy={y} r={8} data-map-target={id} />
            </g>
          ))}

          <g className="map-pin">
            <circle className="map-pin__ring" cx={worldMap.home.x} cy={worldMap.home.y} r={6} />
            <circle className="map-pin__dot" cx={worldMap.home.x} cy={worldMap.home.y} r={3} />
          </g>
        </svg>
      </ClientMapExplorer>
    </Reveal>
  );
}

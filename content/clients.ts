/**
 * Where clients are, across the five marketplaces.
 *
 * Counted per client account, once per platform, so someone who hired on two
 * sites counts twice. Khamsat covers the programming services only, like the
 * reviews. Upwork is taken from each job's "About the client" panel; its two
 * private jobs use the country of the project they belong to. The one client
 * Upwork lists under Gaza is counted as Palestine.
 *
 * `unplaced` is clients the platform will not show a country for: a suspended
 * Khamsat account, a closed Freelancer one and three hidden Mostaql profiles.
 * They count towards the total and stay off the map. Never guess one.
 *
 * Changing a country or adding one needs `npm run map`, which draws it.
 */
import data from "./clients.json";
import type { PlatformId } from "./reviews";

export type ClientCountry = {
  id: string;
  /** ISO 3166 numeric, the key into the map data. */
  iso: string;
  name: string;
  /** Where its line lands: the capital, so France does not land in Guiana. */
  lon: number;
  lat: number;
  clients: Partial<Record<PlatformId, number>>;
};

export const clientCountries = data.countries as ClientCountry[];
export const unplacedClients = data.unplaced as Partial<Record<PlatformId, number>>;

/** UN members plus the two observer states. */
export const WORLD_COUNTRIES = 195;

export type ClientFilter = PlatformId | "all";

export function clientsIn(country: ClientCountry, filter: ClientFilter) {
  if (filter !== "all") return country.clients[filter] ?? 0;
  return Object.values(country.clients).reduce((sum, n) => sum + (n ?? 0), 0);
}

export function dominationOf(countries: number) {
  return Math.round((countries / WORLD_COUNTRIES) * 100);
}

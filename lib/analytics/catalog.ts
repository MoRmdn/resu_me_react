/**
 * The analytics catalog: every event and every parameter the site may send.
 *
 * This file is the single source of truth. `track()` and `trackAttrs()` take
 * their types from it, so an event or parameter that is not declared here does
 * not compile, and `npm run analytics:docs` generates
 * docs/ANALYTICS-EVENTS.md from it. Read docs/ANALYTICS.md before editing.
 *
 * Nothing in this file reaches the client bundle: runtime code imports only its
 * types. The readable sentence each event sends lives in sentences.ts for that
 * reason, since those few strings do have to ship.
 */

type ParamSpec = {
  /** Display name for the custom definition in GA. */
  label: string;
  /** What the value means, in full. Copied into the GA custom definition. */
  description: string;
  type: "string" | "number";
  /** The closed list of values, when there is one. */
  values?: readonly string[];
  /** Summed in reports, so it is registered as a custom metric. */
  metric?: true;
  /** GA ships a built-in dimension for this name. Do not register it. */
  builtIn?: true;
};

export const PARAMS = {
  // Sent with every event.
  event_description: {
    label: "Event description",
    description:
      "A readable sentence saying what the visitor did, such as 'Opened details for Lpermis Pro'. Added to every event automatically.",
    type: "string",
  },
  section_id: {
    label: "Section",
    description:
      "The band of the page the event happened in: hero, about, experience, projects, skills, reviews, contact, navigation, footer or privacy.",
    type: "string",
  },

  // Links and navigation.
  link_target: {
    label: "Link target",
    description: "The in-page section or page a navigation link goes to, such as projects.",
    type: "string",
  },
  link_text: {
    label: "Link text",
    description: "The visible label of the link or button that was clicked.",
    type: "string",
    builtIn: true,
  },
  link_url: {
    label: "Link URL",
    description: "The full address of the external page the visitor was sent to.",
    type: "string",
    builtIn: true,
  },
  nav_location: {
    label: "Navigation location",
    description: "Which navigation surface held the link that was clicked.",
    type: "string",
    values: ["header", "mobile_menu", "footer", "skip_link", "privacy_page", "consent_notice"],
  },
  menu_action: {
    label: "Menu action",
    description: "Whether the mobile menu was opened or closed.",
    type: "string",
    values: ["open", "close"],
  },
  cta_id: {
    label: "CTA",
    description: "Which call-to-action button was clicked.",
    type: "string",
    values: ["hero_see_work", "nav_hire_me"],
  },
  landing_hash: {
    label: "Landing anchor",
    description:
      "The in-page anchor the visitor arrived on from outside, such as lpermis, without the hash.",
    type: "string",
  },

  // Attention.
  dwell_seconds: {
    label: "Dwell seconds",
    description:
      "Seconds the visitor stayed stopped on a project, section or experience in one stop. Idle time and hidden tabs are excluded.",
    type: "number",
    metric: true,
  },
  scroll_percent: {
    label: "Scroll percent",
    description: "The scroll depth milestone reached: 25, 50, 75 or 100 percent of the page.",
    type: "number",
  },
  visit_seconds: {
    label: "Visit seconds",
    description:
      "Seconds of active attention across the whole page load, excluding idle time and hidden tabs.",
    type: "number",
    metric: true,
  },
  max_scroll_percent: {
    label: "Max scroll percent",
    description: "The deepest point of the page reached during the page load, as a percentage.",
    type: "number",
  },
  sections_seen: {
    label: "Sections seen",
    description: "How many different page sections the visitor stopped on during the page load.",
    type: "number",
  },
  projects_seen: {
    label: "Projects seen",
    description: "How many different projects were on screen during the page load.",
    type: "number",
  },
  top_project: {
    label: "Top project",
    description: "The project that held the most dwell time during the page load, if any did.",
    type: "string",
  },
  click_count: {
    label: "Click count",
    description: "How many clicks the visitor made during the page load.",
    type: "number",
  },

  // Projects.
  project_slug: {
    label: "Project slug",
    description: "The stable identifier of the project, such as lpermis-pro.",
    type: "string",
  },
  project_title: {
    label: "Project",
    description: "The display name of the project, without its translation or subtitle.",
    type: "string",
  },
  project_placement: {
    label: "Project placement",
    description: "Where the project sits on the page: a full featured panel or a gallery tile.",
    type: "string",
    values: ["featured", "gallery"],
  },
  project_category: {
    label: "Project category",
    description: "The project's market category, such as Healthcare.",
    type: "string",
  },
  project_country: {
    label: "Project country",
    description: "The country the project was built for.",
    type: "string",
  },
  toggle_action: {
    label: "Toggle action",
    description: "Whether a project or experience panel was opened or closed.",
    type: "string",
    values: ["open", "close"],
  },
  toggle_method: {
    label: "Toggle method",
    description: "The control the visitor used to open or close a panel or the mobile menu.",
    type: "string",
    values: [
      "tile",
      "close_button",
      "escape",
      "list_row",
      "timeline_bar",
      "arrow_keys",
      "menu_button",
      "backdrop",
    ],
  },
  link_type: {
    label: "Project link type",
    description: "Which listing of the project was opened.",
    type: "string",
    values: ["website", "source", "app_store", "play_store"],
  },

  // Experience.
  experience_slug: {
    label: "Experience slug",
    description: "The stable identifier of the role, such as mismar.",
    type: "string",
  },
  experience_company: {
    label: "Experience company",
    description: "The company of the role, without its translation.",
    type: "string",
  },

  // Reviews.
  review_ref: {
    label: "Review reference",
    description:
      "An opaque hash of the review's id. The id contains the reviewer's first name, so it is never sent itself.",
    type: "string",
  },
  platform_id: {
    label: "Review platform",
    description: "The marketplace the review or review score came from, such as upwork.",
    type: "string",
  },
  platform_label: {
    label: "Review platform name",
    description: "The display name of the marketplace, such as Upwork.",
    type: "string",
  },
  review_count: {
    label: "Review count",
    description: "How many reviews the platform's score summarises.",
    type: "number",
  },
  pause_state: {
    label: "Review wall state",
    description: "The state the review wall was switched to.",
    type: "string",
    values: ["paused", "playing"],
  },
  language_state: {
    label: "Review language",
    description: "The language the review wall was switched to on a phone.",
    type: "string",
    values: ["original", "translation"],
  },
  map_filter: {
    label: "Client map filter",
    description: "The platform the client map is filtered to, or all.",
    type: "string",
  },
  country_id: {
    label: "Client country code",
    description: "The code of the client country that was looked at.",
    type: "string",
  },
  country_name: {
    label: "Client country",
    description: "The name of the client country that was looked at.",
    type: "string",
  },
  view_trigger: {
    label: "Country view trigger",
    description: "How the country was looked at: by resting on it, or by clicking its row.",
    type: "string",
    values: ["hover", "click"],
  },

  // Conversions.
  channel_id: {
    label: "Contact channel",
    description: "The contact channel the visitor chose, such as whatsapp.",
    type: "string",
  },
  channel_label: {
    label: "Contact channel name",
    description: "The display name of the contact channel, such as WhatsApp.",
    type: "string",
  },
  channel_placement: {
    label: "Contact placement",
    description: "Where the contact link was clicked: the hero or the Contact section's grid.",
    type: "string",
    values: ["hero", "contact_grid"],
  },
  social_label: {
    label: "Social profile",
    description: "The social profile that was opened, such as LinkedIn.",
    type: "string",
  },
  file_name: {
    label: "File name",
    description: "The name of the file that was downloaded.",
    type: "string",
    builtIn: true,
  },

  // Safety net.
  element_tag: {
    label: "Element tag",
    description: "The HTML tag of the element that was clicked, such as img or p.",
    type: "string",
  },
  element_text: {
    label: "Element text",
    description:
      "The first words of the element that was clicked. Always empty inside a review card, so reviewer names are never sent.",
    type: "string",
  },
  char_count: {
    label: "Copied characters",
    description: "How many characters were copied. The copied text itself is never sent.",
    type: "number",
  },

  // Health.
  metric_name: {
    label: "Web vital",
    description: "The Core Web Vital that was measured: LCP, INP, CLS, FCP or TTFB.",
    type: "string",
  },
  metric_value: {
    label: "Web vital value",
    description: "The measured value, in milliseconds. CLS is multiplied by 1000.",
    type: "number",
  },
  metric_rating: {
    label: "Web vital rating",
    description: "Google's rating of the measured value.",
    type: "string",
    values: ["good", "needs-improvement", "poor"],
  },
  error_message: {
    label: "Error message",
    description: "The message of the JavaScript error, cut to 100 characters.",
    type: "string",
  },
  error_source: {
    label: "Error source",
    description: "The script and line the JavaScript error came from.",
    type: "string",
  },

  // Consent.
  consent_decision: {
    label: "Consent decision",
    description: "What the visitor chose. A decline is the last event that load sends.",
    type: "string",
    values: ["accepted", "declined"],
  },
  consent_source: {
    label: "Consent source",
    description: "Where the choice was made: the regional notice or the privacy page.",
    type: "string",
    values: ["notice", "privacy_page"],
  },
} as const satisfies Record<string, ParamSpec>;

export type ParamName = keyof typeof PARAMS;

type EventSpec = {
  group: string;
  /** What the event means and why it exists, in full. */
  description: string;
  /** The exact moment it fires. */
  trigger: string;
  params: readonly ParamName[];
  optional?: readonly ParamName[];
  /** Mark as a key event in GA: this is what the site is for. */
  keyEvent?: true;
};

const PROJECT = [
  "project_slug",
  "project_title",
  "project_placement",
  "project_category",
  "project_country",
] as const;

const EXPERIENCE = ["experience_slug", "experience_company"] as const;

export const EVENTS = {
  nav_link_click: {
    group: "Navigation",
    description: "Shows which parts of the page visitors jump to deliberately.",
    trigger:
      "A click on a link in the header, mobile menu, footer, skip link, privacy page or consent notice.",
    params: ["link_target", "link_text", "nav_location"],
  },
  nav_menu_toggle: {
    group: "Navigation",
    description: "Shows how often phone visitors use the menu, and how they leave it.",
    trigger: "The mobile menu opening or closing.",
    params: ["menu_action", "toggle_method"],
  },
  cta_click: {
    group: "Navigation",
    description: "Shows which call to action moves visitors towards the work or towards hiring.",
    trigger: "A click on the hero's See the work button or the nav's Hire me button.",
    params: ["cta_id", "link_text"],
  },
  deep_link_landing: {
    group: "Navigation",
    description: "Shows which project or section outside links send visitors straight to.",
    trigger: "A page load whose address carries an in-page anchor.",
    params: ["landing_hash"],
  },

  section_view: {
    group: "Attention",
    description: "Counts how many visitors reach each section and actually pause on it.",
    trigger: "A section holding the middle of the screen for one second, once per page load.",
    params: ["section_id"],
  },
  section_dwell: {
    group: "Attention",
    description: "Measures how long each section holds attention.",
    trigger: "A stop of two seconds or more on a section ending, or the tab being hidden.",
    params: ["section_id", "dwell_seconds"],
  },
  scroll_depth: {
    group: "Attention",
    description: "Shows how far down the page visitors get. GA's own event only reports 90%.",
    trigger: "The visitor first passing 25, 50, 75 and 100 percent of the page.",
    params: ["scroll_percent"],
  },
  visit_summary: {
    group: "Attention",
    description: "One line describing the whole page load, for comparing engaged and quick visits.",
    trigger: "The page being closed or navigated away from.",
    params: ["visit_seconds", "max_scroll_percent", "sections_seen", "projects_seen", "click_count"],
    optional: ["top_project"],
  },

  project_impression: {
    group: "Projects",
    description: "Counts how many visitors saw each project. The base for its interest rate.",
    trigger: "A project staying at least half visible for one second, once per page load.",
    params: PROJECT,
  },
  project_dwell: {
    group: "Projects",
    description: "The main interest signal: how long visitors stay stopped on each project.",
    trigger:
      "A stop of two seconds or more on a project panel or open detail plane ending, or the tab being hidden.",
    params: [...PROJECT, "dwell_seconds"],
  },
  project_hover: {
    group: "Projects",
    description:
      "Interest in closed gallery tiles, which share the screen too closely for dwell time to separate them.",
    trigger: "A mouse resting on a closed gallery tile for one second, once per project.",
    params: PROJECT,
  },
  project_toggle: {
    group: "Projects",
    description: "A deliberate request for more detail about a gallery project.",
    trigger: "A gallery tile's detail plane opening or closing.",
    params: [...PROJECT, "toggle_action", "toggle_method"],
  },
  project_link_click: {
    group: "Projects",
    description: "The strongest project signal: the visitor left to see the real thing.",
    trigger: "A click on a project's website, source, App Store or Play Store link.",
    params: [...PROJECT, "link_type", "link_text", "link_url"],
  },
  project_screens_swipe: {
    group: "Projects",
    description: "Shows phone visitors exploring a project's screenshots.",
    trigger: "A project's screenshot strip being swiped sideways, once per project.",
    params: PROJECT,
  },

  experience_toggle: {
    group: "Experience",
    description: "Shows which roles visitors want to read about.",
    trigger: "A role opening or closing from its row, its timeline bar or the arrow keys.",
    params: [...EXPERIENCE, "toggle_action", "toggle_method"],
  },
  experience_dwell: {
    group: "Experience",
    description: "Measures how long each open role holds attention.",
    trigger: "A stop of two seconds or more on an open role ending, or the tab being hidden.",
    params: [...EXPERIENCE, "dwell_seconds"],
  },

  about_link_click: {
    group: "About",
    description: "Shows interest in the live course linked from the About section.",
    trigger: "A click on the link under Built with it.",
    params: ["link_text", "link_url"],
  },

  review_platform_click: {
    group: "Reviews",
    description: "Shows visitors checking a score at its source, which is a sign of serious intent.",
    trigger: "A click on a marketplace's score cell.",
    params: ["platform_id", "platform_label", "review_count"],
  },
  review_hover: {
    group: "Reviews",
    description: "Shows reviews being read. The wall pauses under the pointer, so this is a real stop.",
    trigger: "A mouse resting on a review card for 1.5 seconds, once per review.",
    params: ["review_ref", "platform_id"],
  },
  review_wall_pause_toggle: {
    group: "Reviews",
    description: "Shows visitors stopping the moving wall to read it.",
    trigger: "A click on the review wall's pause or play button.",
    params: ["pause_state"],
  },
  review_language_toggle: {
    group: "Reviews",
    description: "Shows how many phone visitors want the original Arabic reviews.",
    trigger: "A click on the review wall's language button.",
    params: ["language_state"],
  },
  client_map_filter: {
    group: "Reviews",
    description: "Shows which marketplace visitors want to see client countries for.",
    trigger: "A click on a platform filter above the client map.",
    params: ["map_filter"],
  },
  client_map_country_view: {
    group: "Reviews",
    description: "Shows which client countries visitors look for, often their own.",
    trigger:
      "A pointer or keyboard focus resting on a country for 0.6 seconds once per country, or any click on its row.",
    params: ["country_id", "country_name", "map_filter", "view_trigger"],
  },

  contact_channel_click: {
    group: "Conversions",
    description: "A visitor reaching out. This is the main goal of the site.",
    trigger: "A click on a contact channel in the Contact grid, or on WhatsApp in the hero.",
    params: ["channel_id", "channel_label", "channel_placement"],
    keyEvent: true,
  },
  contact_email_copy: {
    group: "Conversions",
    description: "A visitor taking the email address by hand, which counts as reaching out.",
    trigger: "A click on the Copy address button.",
    params: ["channel_id"],
    keyEvent: true,
  },
  resume_download: {
    group: "Conversions",
    description: "A recruiter or client taking the CV away. A strong hiring signal.",
    trigger: "A click on Download CV.",
    params: ["file_name"],
    keyEvent: true,
  },
  social_profile_click: {
    group: "Conversions",
    description: "A visitor checking a public profile before reaching out.",
    trigger: "A click on the GitHub, LinkedIn or X link in the Contact section.",
    params: ["social_label", "link_url"],
  },

  ui_click: {
    group: "Safety net",
    description:
      "A control with no named event. Every one of these is a gap to fix: give the control an event.",
    trigger: "A click on a link or button with no data-track attribute.",
    params: ["element_tag", "element_text"],
  },
  content_click: {
    group: "Safety net",
    description: "A click on something that is not a control, which shows what visitors expect to work.",
    trigger: "A click anywhere that is not a link or button.",
    params: ["element_tag", "element_text"],
    optional: PROJECT,
  },
  text_copy: {
    group: "Safety net",
    description: "A visitor copying text, such as an application id. Only the length is sent.",
    trigger: "The browser's copy event on selected page text.",
    params: ["char_count"],
    optional: PROJECT,
  },

  web_vital: {
    group: "Health",
    description: "Real visitors' page speed, which tells us if the site or a change got slower.",
    trigger: "The browser reporting a final Core Web Vital, usually as the page is hidden.",
    params: ["metric_name", "metric_value", "metric_rating"],
  },
  client_error: {
    group: "Health",
    description: "A JavaScript error a real visitor hit, so breakage is seen and not guessed at.",
    trigger: "An uncaught error from this site's own scripts, at most five per page load.",
    params: ["error_message", "error_source"],
  },
  consent_choice: {
    group: "Health",
    description: "Shows how visitors answer the notice, which explains gaps in European data.",
    trigger: "A click on Accept or Decline, on the notice or the privacy page.",
    params: ["consent_decision", "consent_source"],
  },
} as const satisfies Record<string, EventSpec>;

export type EventName = keyof typeof EVENTS;

/**
 * Visitor-level facts, set once per load. Deliberately coarse: each one splits
 * visitors into a handful of groups, so none of them can identify a person.
 */
export const USER_PROPERTIES = {
  input_type: {
    label: "Input type",
    description: "Whether the main pointer is a finger or a mouse: touch or mouse.",
  },
  reduced_motion: {
    label: "Reduced motion",
    description: "Whether the visitor asks for reduced motion: reduce or no_preference.",
  },
  color_scheme: {
    label: "Colour scheme",
    description: "The visitor's system colour scheme: dark or light.",
  },
  connection_type: {
    label: "Connection type",
    description: "The browser's estimate of connection speed: 4g, 3g, 2g, slow-2g or unknown.",
  },
} as const satisfies Record<string, { label: string; description: string }>;

export type UserProperty = keyof typeof USER_PROPERTIES;

type ParamValue<P extends ParamName> = (typeof PARAMS)[P] extends {
  values: readonly (infer V)[];
}
  ? V
  : (typeof PARAMS)[P]["type"] extends "number"
    ? number
    : string;

type Required<E extends EventName> = (typeof EVENTS)[E]["params"][number];
type Optional<E extends EventName> = (typeof EVENTS)[E] extends {
  optional: readonly (infer O extends ParamName)[];
}
  ? O
  : never;

/** The parameters event `E` must carry. An undeclared one does not compile. */
export type EventParams<E extends EventName> = { [P in Required<E>]: ParamValue<P> } & {
  [P in Optional<E>]?: ParamValue<P>;
};

export type ProjectPlacement = ParamValue<"project_placement">;
export type ProjectParams = EventParams<"project_impression">;
export type ExperienceParams = EventParams<"experience_dwell"> extends infer T
  ? Omit<T, "dwell_seconds">
  : never;
export type NavLocation = ParamValue<"nav_location">;

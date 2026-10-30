import type { EventName } from "./catalog";

/**
 * The readable sentence sent as `event_description` on every event. `{param}`
 * is filled from the event's own parameters.
 *
 * Apart from the catalog because these strings ship in the client bundle and the
 * catalog's long descriptions do not need to. Keep each one under 100 characters
 * once filled in: GA cuts a parameter value there.
 */
export const SENTENCES: Record<EventName, string> = {
  nav_link_click: "Clicked {link_text} in the {nav_location}",
  nav_menu_toggle: "Mobile menu: {menu_action} via {toggle_method}",
  cta_click: "Clicked the {link_text} button",
  deep_link_landing: "Arrived directly on #{landing_hash}",

  section_view: "Stopped on the {section_id} section",
  section_dwell: "Spent {dwell_seconds}s on the {section_id} section",
  scroll_depth: "Scrolled {scroll_percent}% of the page",
  visit_summary: "Visit: {visit_seconds}s active, {max_scroll_percent}% scrolled, {click_count} clicks",

  project_impression: "Saw project {project_title}",
  project_dwell: "Spent {dwell_seconds}s on project {project_title}",
  project_hover: "Rested on gallery tile {project_title}",
  project_toggle: "{toggle_action} details for {project_title} via {toggle_method}",
  project_link_click: "Opened {link_type} for {project_title}",
  project_screens_swipe: "Swiped the screenshots of {project_title}",

  experience_toggle: "{toggle_action} role at {experience_company} via {toggle_method}",
  experience_dwell: "Spent {dwell_seconds}s on the role at {experience_company}",

  about_link_click: "Opened {link_text} from the About section",

  review_platform_click: "Opened {platform_label} reviews ({review_count})",
  review_hover: "Read a {platform_id} review",
  review_wall_pause_toggle: "Review wall switched to {pause_state}",
  review_language_toggle: "Review wall switched to {language_state}",
  client_map_filter: "Filtered the client map to {map_filter}",
  client_map_country_view: "Looked at {country_name} on the client map",

  contact_channel_click: "Reached out via {channel_label} from the {channel_placement}",
  contact_email_copy: "Copied the email address",
  resume_download: "Downloaded the CV ({file_name})",
  social_profile_click: "Opened the {social_label} profile",

  ui_click: "Clicked an untagged control: {element_text}",
  content_click: "Clicked non-interactive {element_tag}: {element_text}",
  text_copy: "Copied {char_count} characters of page text",

  web_vital: "{metric_name} was {metric_value} ({metric_rating})",
  client_error: "Script error: {error_message}",
  consent_choice: "{consent_decision} analytics on the {consent_source}",
};

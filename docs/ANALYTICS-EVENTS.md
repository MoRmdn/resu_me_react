# Analytics events

Generated from `lib/analytics/catalog.ts` by `npm run analytics:docs`. **Do not
edit by hand.** CI fails if this file is stale. The rules are in
[ANALYTICS.md](ANALYTICS.md).

Every event also carries `event_description` and `section_id`.

## Navigation

### `nav_link_click`

Shows which parts of the page visitors jump to deliberately.

- **Fires on:** A click on a link in the header, mobile menu, footer, skip link, privacy page or consent notice.
- **Sentence:** Clicked {link_text} in the {nav_location}
- **Params:** `link_target`, `link_text`, `nav_location`

### `nav_menu_toggle`

Shows how often phone visitors use the menu, and how they leave it.

- **Fires on:** The mobile menu opening or closing.
- **Sentence:** Mobile menu: {menu_action} via {toggle_method}
- **Params:** `menu_action`, `toggle_method`

### `cta_click`

Shows which call to action moves visitors towards the work or towards hiring.

- **Fires on:** A click on the hero's See the work button or the nav's Hire me button.
- **Sentence:** Clicked the {link_text} button
- **Params:** `cta_id`, `link_text`

### `deep_link_landing`

Shows which project or section outside links send visitors straight to.

- **Fires on:** A page load whose address carries an in-page anchor.
- **Sentence:** Arrived directly on #{landing_hash}
- **Params:** `landing_hash`

## Attention

### `section_view`

Counts how many visitors reach each section and actually pause on it.

- **Fires on:** A section holding the middle of the screen for one second, once per page load.
- **Sentence:** Stopped on the {section_id} section
- **Params:** `section_id`

### `section_dwell`

Measures how long each section holds attention.

- **Fires on:** A stop of two seconds or more on a section ending, or the tab being hidden.
- **Sentence:** Spent {dwell_seconds}s on the {section_id} section
- **Params:** `section_id`, `dwell_seconds`

### `scroll_depth`

Shows how far down the page visitors get. GA's own event only reports 90%.

- **Fires on:** The visitor first passing 25, 50, 75 and 100 percent of the page.
- **Sentence:** Scrolled {scroll_percent}% of the page
- **Params:** `scroll_percent`

### `visit_summary`

One line describing the whole page load, for comparing engaged and quick visits.

- **Fires on:** The page being closed or navigated away from.
- **Sentence:** Visit: {visit_seconds}s active, {max_scroll_percent}% scrolled, {click_count} clicks
- **Params:** `visit_seconds`, `max_scroll_percent`, `sections_seen`, `projects_seen`, `click_count`
- **Optional:** `top_project`

## Projects

### `project_impression`

Counts how many visitors saw each project. The base for its interest rate.

- **Fires on:** A project staying at least half visible for one second, once per page load.
- **Sentence:** Saw project {project_title}
- **Params:** `project_slug`, `project_title`, `project_placement`, `project_category`, `project_country`

### `project_dwell`

The main interest signal: how long visitors stay stopped on each project.

- **Fires on:** A stop of two seconds or more on a project panel or open detail plane ending, or the tab being hidden.
- **Sentence:** Spent {dwell_seconds}s on project {project_title}
- **Params:** `project_slug`, `project_title`, `project_placement`, `project_category`, `project_country`, `dwell_seconds`

### `project_hover`

Interest in closed gallery tiles, which share the screen too closely for dwell time to separate them.

- **Fires on:** A mouse resting on a closed gallery tile for one second, once per project.
- **Sentence:** Rested on gallery tile {project_title}
- **Params:** `project_slug`, `project_title`, `project_placement`, `project_category`, `project_country`

### `project_toggle`

A deliberate request for more detail about a gallery project.

- **Fires on:** A gallery tile's detail plane opening or closing.
- **Sentence:** {toggle_action} details for {project_title} via {toggle_method}
- **Params:** `project_slug`, `project_title`, `project_placement`, `project_category`, `project_country`, `toggle_action`, `toggle_method`

### `project_link_click`

The strongest project signal: the visitor left to see the real thing.

- **Fires on:** A click on a project's website, source, App Store or Play Store link.
- **Sentence:** Opened {link_type} for {project_title}
- **Params:** `project_slug`, `project_title`, `project_placement`, `project_category`, `project_country`, `link_type`, `link_text`, `link_url`

### `project_screens_swipe`

Shows phone visitors exploring a project's screenshots.

- **Fires on:** A project's screenshot strip being swiped sideways, once per project.
- **Sentence:** Swiped the screenshots of {project_title}
- **Params:** `project_slug`, `project_title`, `project_placement`, `project_category`, `project_country`

## Experience

### `experience_toggle`

Shows which roles visitors want to read about.

- **Fires on:** A role opening or closing from its row, its timeline bar or the arrow keys.
- **Sentence:** {toggle_action} role at {experience_company} via {toggle_method}
- **Params:** `experience_slug`, `experience_company`, `toggle_action`, `toggle_method`

### `experience_dwell`

Measures how long each open role holds attention.

- **Fires on:** A stop of two seconds or more on an open role ending, or the tab being hidden.
- **Sentence:** Spent {dwell_seconds}s on the role at {experience_company}
- **Params:** `experience_slug`, `experience_company`, `dwell_seconds`

## About

### `about_link_click`

Shows interest in the live course linked from the About section.

- **Fires on:** A click on the link under Built with it.
- **Sentence:** Opened {link_text} from the About section
- **Params:** `link_text`, `link_url`

## Reviews

### `review_platform_click`

Shows visitors checking a score at its source, which is a sign of serious intent.

- **Fires on:** A click on a marketplace's score cell.
- **Sentence:** Opened {platform_label} reviews ({review_count})
- **Params:** `platform_id`, `platform_label`, `review_count`

### `review_hover`

Shows reviews being read. The wall pauses under the pointer, so this is a real stop.

- **Fires on:** A mouse resting on a review card for 1.5 seconds, once per review.
- **Sentence:** Read a {platform_id} review
- **Params:** `review_ref`, `platform_id`

### `review_wall_pause_toggle`

Shows visitors stopping the moving wall to read it.

- **Fires on:** A click on the review wall's pause or play button.
- **Sentence:** Review wall switched to {pause_state}
- **Params:** `pause_state`

### `review_language_toggle`

Shows how many phone visitors want the original Arabic reviews.

- **Fires on:** A click on the review wall's language button.
- **Sentence:** Review wall switched to {language_state}
- **Params:** `language_state`

### `client_map_filter`

Shows which marketplace visitors want to see client countries for.

- **Fires on:** A click on a platform filter above the client map.
- **Sentence:** Filtered the client map to {map_filter}
- **Params:** `map_filter`

### `client_map_country_view`

Shows which client countries visitors look for, often their own.

- **Fires on:** A pointer or keyboard focus resting on a country for 0.6 seconds once per country, or any click on its row.
- **Sentence:** Looked at {country_name} on the client map
- **Params:** `country_id`, `country_name`, `map_filter`, `view_trigger`

## Conversions

### `contact_channel_click` (key event)

A visitor reaching out. This is the main goal of the site.

- **Fires on:** A click on a contact channel in the Contact grid, or on WhatsApp in the hero.
- **Sentence:** Reached out via {channel_label} from the {channel_placement}
- **Params:** `channel_id`, `channel_label`, `channel_placement`

### `contact_email_copy` (key event)

A visitor taking the email address by hand, which counts as reaching out.

- **Fires on:** A click on the Copy address button.
- **Sentence:** Copied the email address
- **Params:** `channel_id`

### `resume_download` (key event)

A recruiter or client taking the CV away. A strong hiring signal.

- **Fires on:** A click on Download CV.
- **Sentence:** Downloaded the CV ({file_name})
- **Params:** `file_name`

### `social_profile_click`

A visitor checking a public profile before reaching out.

- **Fires on:** A click on the GitHub, LinkedIn or X link in the Contact section.
- **Sentence:** Opened the {social_label} profile
- **Params:** `social_label`, `link_url`

## Safety net

### `ui_click`

A control with no named event. Every one of these is a gap to fix: give the control an event.

- **Fires on:** A click on a link or button with no data-track attribute.
- **Sentence:** Clicked an untagged control: {element_text}
- **Params:** `element_tag`, `element_text`

### `content_click`

A click on something that is not a control, which shows what visitors expect to work.

- **Fires on:** A click anywhere that is not a link or button.
- **Sentence:** Clicked non-interactive {element_tag}: {element_text}
- **Params:** `element_tag`, `element_text`
- **Optional:** `project_slug`, `project_title`, `project_placement`, `project_category`, `project_country`

### `text_copy`

A visitor copying text, such as an application id. Only the length is sent.

- **Fires on:** The browser's copy event on selected page text.
- **Sentence:** Copied {char_count} characters of page text
- **Params:** `char_count`
- **Optional:** `project_slug`, `project_title`, `project_placement`, `project_category`, `project_country`

## Health

### `web_vital`

Real visitors' page speed, which tells us if the site or a change got slower.

- **Fires on:** The browser reporting a final Core Web Vital, usually as the page is hidden.
- **Sentence:** {metric_name} was {metric_value} ({metric_rating})
- **Params:** `metric_name`, `metric_value`, `metric_rating`

### `client_error`

A JavaScript error a real visitor hit, so breakage is seen and not guessed at.

- **Fires on:** An uncaught error from this site's own scripts, at most five per page load.
- **Sentence:** Script error: {error_message}
- **Params:** `error_message`, `error_source`

### `consent_choice`

Shows how visitors answer the notice, which explains gaps in European data.

- **Fires on:** A click on Accept or Decline, on the notice or the privacy page.
- **Sentence:** {consent_decision} analytics on the {consent_source}
- **Params:** `consent_decision`, `consent_source`

## Parameters

| Parameter | Type | Values | Description |
|---|---|---|---|
| `event_description` | string |  | A readable sentence saying what the visitor did, such as 'Opened details for Lpermis Pro'. Added to every event automatically. |
| `section_id` | string |  | The band of the page the event happened in: hero, about, experience, projects, skills, reviews, contact, navigation, footer or privacy. |
| `link_target` | string |  | The in-page section or page a navigation link goes to, such as projects. |
| `link_text` | string |  | The visible label of the link or button that was clicked. |
| `link_url` | string |  | The full address of the external page the visitor was sent to. |
| `nav_location` | string | header, mobile_menu, footer, skip_link, privacy_page, consent_notice | Which navigation surface held the link that was clicked. |
| `menu_action` | string | open, close | Whether the mobile menu was opened or closed. |
| `cta_id` | string | hero_see_work, nav_hire_me | Which call-to-action button was clicked. |
| `landing_hash` | string |  | The in-page anchor the visitor arrived on from outside, such as lpermis, without the hash. |
| `dwell_seconds` | number |  | Seconds the visitor stayed stopped on a project, section or experience in one stop. Idle time and hidden tabs are excluded. |
| `scroll_percent` | number |  | The scroll depth milestone reached: 25, 50, 75 or 100 percent of the page. |
| `visit_seconds` | number |  | Seconds of active attention across the whole page load, excluding idle time and hidden tabs. |
| `max_scroll_percent` | number |  | The deepest point of the page reached during the page load, as a percentage. |
| `sections_seen` | number |  | How many different page sections the visitor stopped on during the page load. |
| `projects_seen` | number |  | How many different projects were on screen during the page load. |
| `top_project` | string |  | The project that held the most dwell time during the page load, if any did. |
| `click_count` | number |  | How many clicks the visitor made during the page load. |
| `project_slug` | string |  | The stable identifier of the project, such as lpermis-pro. |
| `project_title` | string |  | The display name of the project, without its translation or subtitle. |
| `project_placement` | string | featured, gallery | Where the project sits on the page: a full featured panel or a gallery tile. |
| `project_category` | string |  | The project's market category, such as Healthcare. |
| `project_country` | string |  | The country the project was built for. |
| `toggle_action` | string | open, close | Whether a project or experience panel was opened or closed. |
| `toggle_method` | string | tile, close_button, escape, list_row, timeline_bar, arrow_keys, menu_button, backdrop | The control the visitor used to open or close a panel or the mobile menu. |
| `link_type` | string | website, source, app_store, play_store | Which listing of the project was opened. |
| `experience_slug` | string |  | The stable identifier of the role, such as mismar. |
| `experience_company` | string |  | The company of the role, without its translation. |
| `review_ref` | string |  | An opaque hash of the review's id. The id contains the reviewer's first name, so it is never sent itself. |
| `platform_id` | string |  | The marketplace the review or review score came from, such as upwork. |
| `platform_label` | string |  | The display name of the marketplace, such as Upwork. |
| `review_count` | number |  | How many reviews the platform's score summarises. |
| `pause_state` | string | paused, playing | The state the review wall was switched to. |
| `language_state` | string | original, translation | The language the review wall was switched to on a phone. |
| `map_filter` | string |  | The platform the client map is filtered to, or all. |
| `country_id` | string |  | The code of the client country that was looked at. |
| `country_name` | string |  | The name of the client country that was looked at. |
| `view_trigger` | string | hover, click | How the country was looked at: by resting on it, or by clicking its row. |
| `channel_id` | string |  | The contact channel the visitor chose, such as whatsapp. |
| `channel_label` | string |  | The display name of the contact channel, such as WhatsApp. |
| `channel_placement` | string | hero, contact_grid | Where the contact link was clicked: the hero or the Contact section's grid. |
| `social_label` | string |  | The social profile that was opened, such as LinkedIn. |
| `file_name` | string |  | The name of the file that was downloaded. |
| `element_tag` | string |  | The HTML tag of the element that was clicked, such as img or p. |
| `element_text` | string |  | The first words of the element that was clicked. Always empty inside a review card, so reviewer names are never sent. |
| `char_count` | number |  | How many characters were copied. The copied text itself is never sent. |
| `metric_name` | string |  | The Core Web Vital that was measured: LCP, INP, CLS, FCP or TTFB. |
| `metric_value` | number |  | The measured value, in milliseconds. CLS is multiplied by 1000. |
| `metric_rating` | string | good, needs-improvement, poor | Google's rating of the measured value. |
| `error_message` | string |  | The message of the JavaScript error, cut to 100 characters. |
| `error_source` | string |  | The script and line the JavaScript error came from. |
| `consent_decision` | string | accepted, declined | What the visitor chose. A decline is the last event that load sends. |
| `consent_source` | string | notice, privacy_page | Where the choice was made: the regional notice or the privacy page. |

## Register these in GA

Admin → Data display → Custom definitions. Custom parameters do not appear in
reports until they are registered, and registering is not retroactive.

### Custom dimensions, scope Event

| Dimension name | Event parameter | Description |
|---|---|---|
| Event description | `event_description` | A readable sentence saying what the visitor did, such as 'Opened details for Lpermis Pro'. Added to every event automatically. |
| Section | `section_id` | The band of the page the event happened in: hero, about, experience, projects, skills, reviews, contact, navigation, footer or privacy. |
| Link target | `link_target` | The in-page section or page a navigation link goes to, such as projects. |
| Navigation location | `nav_location` | Which navigation surface held the link that was clicked. |
| Menu action | `menu_action` | Whether the mobile menu was opened or closed. |
| CTA | `cta_id` | Which call-to-action button was clicked. |
| Landing anchor | `landing_hash` | The in-page anchor the visitor arrived on from outside, such as lpermis, without the hash. |
| Scroll percent | `scroll_percent` | The scroll depth milestone reached: 25, 50, 75 or 100 percent of the page. |
| Max scroll percent | `max_scroll_percent` | The deepest point of the page reached during the page load, as a percentage. |
| Sections seen | `sections_seen` | How many different page sections the visitor stopped on during the page load. |
| Projects seen | `projects_seen` | How many different projects were on screen during the page load. |
| Top project | `top_project` | The project that held the most dwell time during the page load, if any did. |
| Click count | `click_count` | How many clicks the visitor made during the page load. |
| Project slug | `project_slug` | The stable identifier of the project, such as lpermis-pro. |
| Project | `project_title` | The display name of the project, without its translation or subtitle. |
| Project placement | `project_placement` | Where the project sits on the page: a full featured panel or a gallery tile. |
| Project category | `project_category` | The project's market category, such as Healthcare. |
| Project country | `project_country` | The country the project was built for. |
| Toggle action | `toggle_action` | Whether a project or experience panel was opened or closed. |
| Toggle method | `toggle_method` | The control the visitor used to open or close a panel or the mobile menu. |
| Project link type | `link_type` | Which listing of the project was opened. |
| Experience slug | `experience_slug` | The stable identifier of the role, such as mismar. |
| Experience company | `experience_company` | The company of the role, without its translation. |
| Review reference | `review_ref` | An opaque hash of the review's id. The id contains the reviewer's first name, so it is never sent itself. |
| Review platform | `platform_id` | The marketplace the review or review score came from, such as upwork. |
| Review platform name | `platform_label` | The display name of the marketplace, such as Upwork. |
| Review count | `review_count` | How many reviews the platform's score summarises. |
| Review wall state | `pause_state` | The state the review wall was switched to. |
| Review language | `language_state` | The language the review wall was switched to on a phone. |
| Client map filter | `map_filter` | The platform the client map is filtered to, or all. |
| Client country code | `country_id` | The code of the client country that was looked at. |
| Client country | `country_name` | The name of the client country that was looked at. |
| Country view trigger | `view_trigger` | How the country was looked at: by resting on it, or by clicking its row. |
| Contact channel | `channel_id` | The contact channel the visitor chose, such as whatsapp. |
| Contact channel name | `channel_label` | The display name of the contact channel, such as WhatsApp. |
| Contact placement | `channel_placement` | Where the contact link was clicked: the hero or the Contact section's grid. |
| Social profile | `social_label` | The social profile that was opened, such as LinkedIn. |
| Element tag | `element_tag` | The HTML tag of the element that was clicked, such as img or p. |
| Element text | `element_text` | The first words of the element that was clicked. Always empty inside a review card, so reviewer names are never sent. |
| Copied characters | `char_count` | How many characters were copied. The copied text itself is never sent. |
| Web vital | `metric_name` | The Core Web Vital that was measured: LCP, INP, CLS, FCP or TTFB. |
| Web vital value | `metric_value` | The measured value, in milliseconds. CLS is multiplied by 1000. |
| Web vital rating | `metric_rating` | Google's rating of the measured value. |
| Error message | `error_message` | The message of the JavaScript error, cut to 100 characters. |
| Error source | `error_source` | The script and line the JavaScript error came from. |
| Consent decision | `consent_decision` | What the visitor chose. A decline is the last event that load sends. |
| Consent source | `consent_source` | Where the choice was made: the regional notice or the privacy page. |

### Custom dimensions, scope User

| Dimension name | User property | Description |
|---|---|---|
| Input type | `input_type` | Whether the main pointer is a finger or a mouse: touch or mouse. |
| Reduced motion | `reduced_motion` | Whether the visitor asks for reduced motion: reduce or no_preference. |
| Colour scheme | `color_scheme` | The visitor's system colour scheme: dark or light. |
| Connection type | `connection_type` | The browser's estimate of connection speed: 4g, 3g, 2g, slow-2g or unknown. |

### Custom metrics, scope Event, unit Seconds

| Metric name | Event parameter | Description |
|---|---|---|
| Dwell seconds | `dwell_seconds` | Seconds the visitor stayed stopped on a project, section or experience in one stop. Idle time and hidden tabs are excluded. |
| Visit seconds | `visit_seconds` | Seconds of active attention across the whole page load, excluding idle time and hidden tabs. |

### Key events

- `contact_channel_click`
- `contact_email_copy`
- `resume_download`

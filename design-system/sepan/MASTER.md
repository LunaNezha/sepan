# Sepan care interface

The patient experience takes priority over reporting. One prominent prescription action,
a short explanation, and a plain-language status replace the analytics-heavy landing view.
The pharmacy workspace keeps the existing reports and adds a working request queue.

## Direction

Calm, high-contrast surfaces with deep evergreen actions, soft neutral backgrounds, generous
spacing, and restrained outlines. Patient tasks use progressive disclosure. Pharmacy tasks
use a searchable queue and a detail panel. Avoid pulsing urgency, countdowns, decorative
carousels, dense patient charts, and promises about availability or delivery timing.

The ui-ux-pro-max healthcare/accessibility guidance informed this direction. Its generic
landing-page and neumorphic suggestions were not appropriate for this task-focused product;
explicit boundaries and accessible controls take precedence. 21st.dev MCP metadata for
Kevin Girelli's accessible Stepper and Ephraim Duncan's File Upload informed the component
patterns. Components are implemented locally for Ionic without adding another UI framework.

## Foundations

- Semantic tokens: `src/theme/care.css`, with independently defined light and dark values.
- Local IranYekan for both Persian and English, including Ionic controls and overlays. No remote font dependency.
- Body text around 16px; supporting labels at least 12px. Headings use balanced wrapping.
- Cards: 16–20px corners; subdued borders; very light shadows. Actions: solid primary,
  outlined secondary, quiet tertiary; no color-only status indicators.
- Main controls are at least 48px high; compact workspace/filter actions are at least 44px.
- Logical spacing and document `lang`/`dir` support Persian RTL and English LTR. Only
  directional arrows mirror. IDs and phone numbers keep LTR direction.
- Mobile tabs and the desktop split pane share a 1024px breakpoint. Safe areas are respected.
- Browser zoom remains enabled. Focus rings, linked validation summaries, labels, status
  announcements, and motion preferences are part of the component contract.

Measured foreground/background token contrast: normal text and status labels exceed 4.5:1;
secondary text has a minimum of 5.47:1 in light mode and 7.30:1 in dark mode. The primary
button has 7.18:1 (light) and 9.34:1 (dark). Input borders on their surfaces exceed 3:1.
These measurements and browser checks are not a claim of full WCAG conformance certification.

## Routes and data

- `/`: patient overview and upload entry point.
- `/prescriptions/new`: file → receiving/contact details → review → preview receipt.
- `/prescription-tracking`: request search, selection, and progress timeline.
- `/pharmacy`: staff filters, oldest-first queue, file access, and status actions.
- `/pharmacy/analytics`: request summaries, daily volume, current statuses, and fulfillment from the shared preview session.
- `/help`: readable expandable guidance, including urgent-help and privacy explanations.

`PrescriptionProvider` holds sample records, new requests, and files in memory. Changes in the
staff view update the patient view during the same session. No document, address, or contact
information is saved to browser storage or sent to a server. Files have downloadable local
object URLs, revoked when their components unmount. Refresh clears entered requests.

The visible preview notice and confirmation copy are intentional. Do not replace them with
"submitted", "live delivery", or payment success claims until real services are connected.
The workspace switch is a preview navigation control, not an authorization boundary.

## Production integration still required

Use the existing services/query structure to add authenticated patient/staff APIs, private
file upload and server validation, an order/event subscription, verified pharmacy contacts,
fulfillment/availability confirmation, payment if applicable, and appropriate audit controls.
Do not use the preview's `patientVisible` flag or workspace switch for production access control.
The interface does not determine clinical urgency or offer medication recommendations.

## Verification

Run `npm run verify`. Serve the built app with `npm run preview -- --host 127.0.0.1 --port 5173`
and run `npm run test.e2e -- --browser chrome`. The care suite exercises submission, file
validation, staff-to-patient updates, search/filters, RTL/LTR layouts at 375/768/1024/1440px,
keyboard focus, enlarged text, dark mode, and reduced motion. Screenshots are generated in
`cypress/screenshots/care.cy.ts/` for visual review; they are excluded from the application.

Initial validation on October 26, 2026: lint, both TypeScript configurations, and the
production build passed with zero warnings. Chrome passed 25 browser checks (13 care
experience checks and 12 route/authentication checks). Screenshots were reviewed in
both directions, including a 375px phone view and 200% root text sizing in dark mode.
Native device and assistive-technology certification are not included in these checks.

## Typography and recovery refinement

IranYekan is a single locally hosted, weight-aware family for both languages. Tailwind
font utilities and Ionic's font variables use the same family, including native form
controls and Shadow DOM/overlay content. Global styles load before lazy application
pages, and the saved theme is applied before the initial render. The root, routed page,
loading, content, and overlay surfaces share the care palette; legacy dark background
utilities resolve to the care background/surface tokens.

Prescription search uses a full-width card with a labeled request number, status filter,
and reset action. The translated 404 screen offers home, prescription, and help links;
on small screens the recovery actions precede the decorative illustration. The preview
notice wraps without squeezing the content area at enlarged text sizes.

The visual refinement suite checks full-width search at 375/1440px, filtering/reset,
RTL/LTR recovery, 200% text, IranYekan loading and Ionic shadow/modal typography, and
page/scroll backgrounds during patient/pharmacy navigation in both themes.

Refinement verification on October 26, 2026: `npm run verify` passed (lint with zero
warnings, both TypeScript checks, production build); Chrome passed all 30 browser
checks. Source and emitted bundles contain no removed legacy background color.
`cap copy android` and `cap copy ios` passed; native archives were not built.

# Pharmacy activity reports

Uses the shared care palette, IranYekan, PageHeading, CareLink, and responsive card layout.
Four metrics summarize received, awaiting-review, in-progress, and completed requests.
The daily bar chart uses a single semantic color, integer ticks, localized dates and counts,
keyboard tooltips, and an expandable HTML data table. Status and fulfillment bars have
visible numeric labels; color is never the only source of information. Animation is disabled.

Seven- and thirty-day periods include the current local calendar day. All metrics and charts
use requests created in the selected period, from the same in-memory provider as the queue.
Statuses are current snapshots, not historical transition counts. Future-dated requests are
excluded, and empty periods show zero counts and an explanatory state. No revenue, patient
identity, payment, clinical priority, or unsupported historical trend is inferred.

The queue links provide the next action. Preview data and refresh behavior are explicit.
The former mock revenue, notification, avatar, calendar, and identifier charts are removed.

Validation: npm run verify; Chrome analytics checks cover keyboard period selection,
queue-to-report updates, empty ranges, accessible data tables, localized totals, RTL/LTR,
light/dark themes, enlarged text, and 375/768/812/1440px layouts.

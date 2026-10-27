<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="src/assets/images/logo.png">
    <img src="src/assets/images/logo-dark.png" alt="Sepan logo" width="88">
  </picture>

# Sepan

**Electronic Prescription Platform for Critical Illness Patients**

<p lang="fa" dir="rtl">سپان — سامانه پذیرش الکترونیک نسخه</p>

**Less time in pharmacy queues. More time for care.**

![Status: Interactive preview](https://img.shields.io/badge/status-interactive_preview-0F766E?style=flat-square)
![License: Pending](https://img.shields.io/badge/license-pending-lightgrey?style=flat-square)
![React](https://img.shields.io/badge/React-19-149ECA?style=flat-square&logo=react&logoColor=white)
![Ionic](https://img.shields.io/badge/Ionic-9-3880FF?style=flat-square&logo=ionic&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-0E7490?style=flat-square&logo=tailwindcss&logoColor=white)

[Features](#key-features) · [Screenshots](#screenshots) · [Getting started](#getting-started) · [Contributing](#contributing)

</div>

---

## Our mission

For people receiving critical care, including cancer treatment, collecting medication should not mean spending precious time in long pharmacy queues. Sepan aims to make that journey simpler: submit a prescription from home, follow its progress, and coordinate pickup or delivery through a clear, calm interface.

This repository contains the React and Ionic frontend for that experience, including a patient workspace and a pharmacy staff workspace. The design prioritizes readable information, fewer steps, touch-friendly controls, and Persian/English accessibility across mobile, tablet, and desktop.

> [!IMPORTANT]
> **Current status: interactive frontend preview.** Prescription files, contact details, and new requests stay in memory and clear when the page refreshes. Staff actions update the patient view within the same preview session; there is no live pharmacy, payment, or delivery integration. Use sample files and sample details only. The workspace switch demonstrates navigation and does not enforce staff authorization.

## Key features

- **Fast prescription upload:** Select or drop prescription photos and PDFs, with file validation and a three-step submission flow: documents, contact/fulfillment details, and review.
- **Clear status tracking:** Search requests and follow a status timeline. The preview updates immediately when staff change a request's status; real-time server events remain an integration task.
- **Simple pickup or delivery requests:** Choose a fulfillment method, provide contact details, and review the request before submitting it to the preview.
- **Efficient pharmacy workspace:** Search and filter the queue, inspect request details and attached files, and advance processing statuses.
- **Multi-language support:** Persian and English translations through i18next, with synchronized document language and RTL/LTR layouts.
- **Calm, accessible interactions:** High-contrast light/dark themes, labeled inputs, keyboard focus handling, status announcements, reduced-motion support, and generous touch targets.
- **Hybrid mobile/web foundation:** Responsive Ionic pages and configured Capacitor Android/iOS projects, sharing the same React application.

### Explore the workspaces

| View | Route | Purpose |
| --- | --- | --- |
| Patient dashboard | `/` | Start a prescription request and see progress |
| New prescription | `/prescriptions/new` | Attach documents, enter details, and review |
| Prescription tracking | `/prescription-tracking` | Search requests and follow status changes |
| Pharmacy queue | `/pharmacy` | Review and process requests |
| Pharmacy analytics | `/pharmacy/analytics` | Review request metrics, daily volume, status, and fulfillment |
| Patient help | `/help` | Find guidance for the request journey |

Authentication screens are also included as demonstrations. Production use requires backend authentication, role-based access, document storage, server-side validation, and pharmacy/delivery integrations. Analytics also requires a compatible API or test stubs; changing the API URL does not connect the in-memory prescription workflow.

## Screenshots

The slots below are placeholders for captures of the current experience. Add images under `docs/screenshots/` and replace each placeholder with a Markdown image using descriptive alternative text.

| Patient dashboard | Prescription submission | Pharmacy workspace |
| :---: | :---: | :---: |
| **Desktop / LTR** | **Mobile / RTL** | **Tablet / staff queue** |
| *Screenshot placeholder* | *Screenshot placeholder* | *Screenshot placeholder* |
| Quick upload and request progress | Document selection and review | Request details and processing actions |
| `patient-dashboard.png` | `prescription-mobile-rtl.png` | `pharmacy-workspace.png` |

<!-- After adding the files, replace the placeholders above with images such as:
![Patient dashboard showing the upload action and prescription progress](docs/screenshots/patient-dashboard.png)
![Persian prescription submission flow on mobile, shown right to left](docs/screenshots/prescription-mobile-rtl.png)
![Pharmacy staff queue with request details and status actions](docs/screenshots/pharmacy-workspace.png)
Use sample data only; exclude patient information from screenshots.
-->

## Tech stack

| Layer | Technology | Role |
| --- | --- | --- |
| Interface | React 19 + Ionic 9 | Components, mobile navigation, and application layouts |
| Language | TypeScript 6 | Shared models and compile-time checks |
| Development and build | Vite 8 | Development server, lazy loading, and production bundles |
| Styling | Tailwind CSS 4 + Ionic CSS | Responsive utilities, design tokens, and themes |
| Localization | i18next + react-i18next | English/Persian translations and language detection |
| Native platforms | Capacitor 8 | Android and iOS application shells |
| API and server state | Axios + TanStack Query | HTTP requests and query lifecycle management |
| Forms | React Hook Form + Zod | Form state and validation |
| Data visualization | Recharts | Pharmacy analytics charts |
| Quality | ESLint + Cypress | Static checks and browser interaction tests |

Exact versions are recorded in [package.json](package.json) and [package-lock.json](package-lock.json). See the [dependency migration report](docs/dependency-upgrade.md) for compatibility decisions and native toolchain details.

## Getting started

### Prerequisites

- **Node.js 22.13 or newer** and **npm 10 or newer**. The included `.nvmrc` selects Node 22.
- **Git** to clone the repository.
- A modern browser: Chrome/Edge 111+, Firefox 128+, or Safari/iOS 16.4+.
- For native development only: the Android SDK and Java 21, or macOS with Xcode 26.4+ and CocoaPods. Consult the migration report before building native targets.

### Installation

```bash
git clone https://github.com/LunaNezha/sepan-react-ionic.git
cd sepan-react-ionic

# If you use nvm:
nvm use

npm ci
cp .env.example .env.local
```

If Node 22 is not installed through nvm yet, run `nvm install` before `nvm use`. If you use a different Node version manager, select the required Node version and skip the nvm commands.

### Environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `VITE_API_URL` | `/api` | Base URL or path used by the Axios API client |

Example `.env.local`:

```dotenv
VITE_API_URL=/api
```

Set this to the URL of your compatible backend when integrating API-backed views. No backend server or production credentials are included. Restart the development server after changing environment values; production values are read when building.

Vite exposes `VITE_` variables to the browser bundle. Keep secrets and private credentials out of these variables. `.env.local` is ignored by Git.

### Run the development server

```bash
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`. The patient, pharmacy, and analytics preview workflows can be explored without a backend. Analytics uses the same in-memory requests as the pharmacy queue; it is not connected to live pharmacy data.

### Build for production

```bash
npm run build
```

The build runs TypeScript checks and creates the web application in `dist/`. To inspect that build locally:

```bash
npm run preview
```

Serve `dist/` from your production web host and configure an SPA fallback to `index.html` so direct visits to application routes work. `vite preview` is intended for local inspection. A successful frontend build does not complete the production integrations described above.

### Android and iOS

After installing the appropriate native toolchain:

```bash
npm run build
npx cap sync

# Open the platform you want to work on:
npx cap open android
npx cap open ios
```

Native builds and simulator/device checks run through Android Studio or Xcode. The Capacitor configuration still uses the starter application ID; choose your own identifier and configure signing before distribution.

## Quality checks

```bash
# Lint with zero warnings, check TypeScript, and build:
npm run verify

# Or run the static checks individually:
npm run lint
npm run typecheck
```

For browser tests, start the application in one terminal:

```bash
npm run dev
```

Then run Cypress in another terminal:

```bash
npm run test.e2e
```

The Cypress base URL defaults to `http://localhost:5173`. The suites cover prescription submission and validation, staff status updates, search/filter behavior, responsive RTL/LTR layouts, keyboard interactions, themes, reduced motion, and authentication routes. Analytics requests are stubbed during browser tests.

## Project structure

```text
src/
  bootstrap.tsx       Application entry point and provider composition
  App.tsx             Ionic initialization and global application setup
  assets/             Fonts, images, and animations used by the application
  components/         Shared controls, care components, and analytics widgets
  constants/          Routes, languages, storage keys, and theme constants
  hooks/              Reusable React hooks and query/form integrations
  layouts/            Application and authentication shells
  pages/              Patient, pharmacy, help, and authentication screens
  providers/          Request preview, query, theme, and toast state
  routes/             Routing and lazy-loaded page composition
  services/           HTTP client, API requests, and storage adapters
  theme/              Global styles, care design tokens, and font declarations
  types/              Shared models, enums, and generated translation types
  utils/              Framework-independent helpers and input masks
public/locales/       English and Persian translation resources
cypress/e2e/          Browser interaction and route tests
android/, ios/        Capacitor native projects
design-system/       Care interface design documentation
docs/                Migration notes and screenshot assets
```

Use **PascalCase** for component files and **camelCase** for hooks and utilities; hook names start with `use`. Keep API operations in `services`, reusable behavior in `hooks`, and route-level UI in `pages`. TypeScript and Vite path aliases should stay synchronized.

### Localization and design

Translations live in `public/locales/en/translations.json` and `public/locales/fa/translations.json`. Keep their keys aligned. After adding translation keys, regenerate the TypeScript resource interface:

```bash
npm run interface
```

Review interface changes in both languages and directions, in light/dark themes, and at mobile and desktop widths. The [Sepan care design system](design-system/sepan/MASTER.md) documents visual tokens, accessibility decisions, component inspiration, and integration boundaries.

## Contributing

Contributions that improve clarity, accessibility, localization, reliability, and pharmacy workflows are welcome.

1. Open an issue describing the problem or proposed improvement. For bugs, include reproduction steps, expected behavior, and browser/device details.
2. Fork the repository and create a focused branch, such as `git checkout -b feat/improve-prescription-review`.
3. Make the change using the directory and naming conventions above. Update documentation and translations when behavior or setup changes.
4. Run `npm run verify` and the relevant Cypress checks. For interface changes, check RTL/LTR behavior, keyboard use, and small screens.
5. Open a pull request explaining the change and validation results. Include before/after screenshots for visual changes.

Use synthetic documents and sample contact details in issues, fixtures, recordings, and screenshots. Never commit credentials or patient information.

## Acknowledgments

Sepan builds on the work of the [React](https://react.dev/), [Ionic](https://ionicframework.com/), [Capacitor](https://capacitorjs.com/), [Vite](https://vite.dev/), [Tailwind CSS](https://tailwindcss.com/), [TypeScript](https://www.typescriptlang.org/), and [i18next](https://www.i18next.com/) communities, alongside the other libraries listed in the package manifest.

The care interface draws design inspiration from **ui-ux-pro-max** and component patterns discovered through **[21st.dev](https://21st.dev/)**. Thank you to the maintainers and contributors who make these tools and resources available.

Third-party libraries, fonts, icons, and other assets retain their respective licenses.

## License

**License pending confirmation.** This repository currently does not contain a `LICENSE` file. The license badge will be updated when the maintainer adds the project's license.

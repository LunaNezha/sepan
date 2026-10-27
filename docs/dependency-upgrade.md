# Dependency migration — October 26, 2026

Stable npm releases and peer requirements were checked before changing the manifest.
The lockfile is regenerated without `--force` or `--legacy-peer-deps`.

| Library | Selected version | Migration |
| --- | --- | --- |
| React / React DOM | 19.3.1 | React 19 refs and controlled form inputs |
| Ionic React / router | 9.0.9 | React Router 6 elements and Ionic page/outlet ownership |
| React Router / DOM | 6.30.6 | Latest compatible 6.x; Ionic requires `>=6.4 <7` |
| Vite / React plugin | 8.3.5 / 6.1.2 | Native Tailwind plugin; ESM config; modern targets |
| Tailwind CSS | 4.3.3 | CSS imports, config loading, custom utilities, variant order |
| TypeScript | 6.0.3 | Latest supported by stable typescript-eslint (`<6.1`); bundler resolution |
| ESLint | 9.39.5 | Flat config; React plugin currently supports ESLint through 9 |
| typescript-eslint | 8.72.0 | Stable lint parser and rules |
| i18next / react-i18next | 26.5.11 / 17.1.9 | Correct `translations` namespace and document direction |
| React Query | 5.104.5 | Shared query client and typed API collection |
| React Hook Form | 7.91.0 | Typed registration and OTP control |
| Hook Form resolvers | 5.9.2 | Latest compatible 5.x; 6.0.0's optional Effect 4 peer conflicts with its typeschema/Effect 3 graph during npm resolution |
| Zod | 4.6.7 | Unified `error` option instead of removed `required_error` / `errorMap` |
| Recharts | 3.10.1 | Typed legend/tooltip callbacks and collection data |
| Capacitor core / Android / iOS / CLI | 8.5.3 | Native platform configuration migration |

Other retained dependencies also use their verified current stable releases. React
Router 7/8, TypeScript 7, ESLint 10, and resolvers 6 are deliberately excluded until
their consumers support those versions. `@types/node` tracks the supported Node 22
runtime, rather than a newer Node API surface. React Router 6 includes its own types,
so the obsolete React Router 5 `@types` packages are removed.

## Toolchain and browser support

Use Node 22.13+ (the `.nvmrc` selects Node 22) and npm 10+. Use `npm ci` after pulling
the changes. Tailwind 4 requires modern CSS, so browser targets are Chrome/Edge 111+,
Firefox 128+, and Safari/iOS 16.4+. The old JavaScript legacy plugin cannot polyfill
these CSS features and has been removed. The iOS deployment target is 16.4 to match.

## Routing and runtime changes

- The root owns one Ionic split pane, tabs container, and router outlet.
- Application routes use one `IonPage` with a header and one `IonContent`. The old
  nested content/outlet wrappers are removed. Authentication uses its own nested
  outlet and page boundaries. Unknown URLs now reach the not-found route.
- Lazy page content loads inside a stable page container. Small shell widgets and
  chart legend/tooltip components no longer introduce additional Suspense waterfalls.
- Page titles are owned by the router and follow the active location, so cached pages do not overwrite
  another page's title on a language change.
- Window size subscriptions share one native resize listener across consumers.
- OTP values now reach React Hook Form and can be pasted or entered sequentially.
- The HTTP client reads `VITE_API_URL` (default `/api`); see `.env.example`. Invalid
  collection responses become query errors instead of crashing the chart. No real
  backend integration or production credentials are included.

## Build size changes

Only the regular-rounded and solid-rounded icon styles used by the application are
loaded, rather than every Flaticon font family. The loading animation uses the
expression-free Lottie light player, loaded asynchronously with cleanup on unmount.
Legacy duplicate bundles are removed. Route and vendor chunks are cached independently.
Rolldown's strict execution order preserves Ionic's generated circular runtime imports
when splitting vendors. A shared storage adapter preserves encrypted values across
the CommonJS interop change in Vite 8.

## Native projects

The Android configuration tracks Capacitor 8's API 36, minimum API 24, Android Gradle
Plugin 8.13.0, Gradle 8.14.3, and Java 21 requirements. Manifest configuration changes
include navigation and density, preventing unnecessary WebView reloads on resize.
The iOS project uses a deployment target compatible with Tailwind's CSS baseline.
Capacitor 8.5's UIScene migration adds `SceneDelegate`, scene configuration, and the
Xcode target registration. Use Xcode 26.4+ for this Capacitor release.
Native archives require the matching Android SDK/JDK and Xcode toolchains; web checks
do not substitute for simulator/device verification.

## Verification

```bash
npm ci
npm run verify
```

For browser verification, serve the production build in one terminal:

```bash
npm run preview -- --host 127.0.0.1 --port 5173
```

Then run the route/interaction checks:

```bash
npm run test.e2e -- --browser chrome
```

The browser suite stubs prescription requests and checks main/auth routes, login
navigation/back behavior, not-found fallback, mobile tabs, theme persistence,
language/direction changes, and verification-code input.

## Recorded verification

- `npm run verify`: ESLint with zero warnings, both TypeScript configurations, and
  the production Vite build pass. The application CSS is approximately 364 kB
  (72 kB gzip), down from approximately 601 kB before migration. The largest
  JavaScript chunk is approximately 230 kB; no build-size warning is suppressed.
- Chrome production regression suite: 12 checks pass. Prescription data is stubbed;
  backend submissions and native device behavior are outside these checks.
- `npm ls --depth=0`: installed direct dependencies resolve without peer errors.
- `npx cap sync android` and `npx cap copy ios`: pass. Native archives were not built.
- `npm audit --omit=dev`: zero high/critical findings; three moderate dependency
  records remain for React Router and its Ionic/DOM consumers. The advisories cover
  open redirects through untrusted navigation destinations and SSR error hydration.
  This client-rendered app uses internal route constants and has no SSR hydration,
  but the dependency advisories remain until Ionic supports a patched router major.
  Do not apply `npm audit fix --force`: its proposed versions violate Ionic's peer
  requirement or downgrade Ionic. Recheck when Ionic updates its router support.

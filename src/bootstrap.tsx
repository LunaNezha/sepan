import "@theme/global.css";
import "@theme/care.css";
import AppLoading from "@pages/AppLoading";
import type { Theme } from "@appTypes/theme";
import i18n from "./i18n";
import { createRoot } from "react-dom/client";
import { lazy, Suspense } from "react";
import secureLocalStorage from "@services/secureStorage";
import { DARK, LIGHT } from "@constants/theme";
import { THEME } from "@constants/storageKeys";
import TanstackProvider from "@providers/TanstackProvider";
import { ThemeProvider } from "@providers/ThemeProvider";
import ToastProvider from "@providers/ToastProvider";
import { I18nextProvider } from "react-i18next";

const App = lazy(() => import("./App"));
const container = document.getElementById("root");
const root = createRoot(container!);
const initialTheme: Theme =
  secureLocalStorage.getItem(THEME) === DARK ? DARK : LIGHT;
// Apply the saved appearance before mounting lazy pages and their loading fallback.
document.documentElement.classList.toggle("dark", initialTheme === DARK);
document.body.classList.toggle("dark", initialTheme === DARK);

root.render(
  <Suspense fallback={<AppLoading />}>
    <I18nextProvider i18n={i18n}>
      <TanstackProvider>
        <ThemeProvider initialTheme={initialTheme}>
          <ToastProvider>
            <App />
          </ToastProvider>
        </ThemeProvider>
      </TanstackProvider>
    </I18nextProvider>
  </Suspense>,
);

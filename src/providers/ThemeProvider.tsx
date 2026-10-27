import React, {
  ReactNode,
  createContext,
  useLayoutEffect,
  useState,
} from "react";
import { THEME } from "@constants/storageKeys";
import { DARK, LIGHT } from "@constants/theme";
import secureLocalStorage from "@services/secureStorage";

import type { Theme } from "@appTypes/theme";

type ThemeContextProps = {
  theme: Theme;
  toggleTheme: () => void;
};

type ThemeProviderProps = {
  children: ReactNode;
  initialTheme: Theme;
};

export const ThemeContext = createContext<ThemeContextProps | undefined>(
  undefined,
);

const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme,
}) => {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  const toggleTheme = () => {
    setTheme((current) => {
      return current === LIGHT ? DARK : LIGHT;
    });
  };

  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", theme === DARK);
    document.body.classList.toggle("dark", theme === DARK);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute(
        "content",
        getComputedStyle(document.body).getPropertyValue("--care-bg").trim(),
      );
    secureLocalStorage.setItem(THEME, theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeProvider };

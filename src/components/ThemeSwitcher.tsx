import { IonButton } from "@ionic/react";
import React from "react";
import classNames from "clsx";
import { DARK, LIGHT } from "@constants/theme";
import { useTheme } from "@hooks/useTheme";

const themeButtons = [
  {
    name: DARK,
    icon: "fi fi-sr-moon",
  },
  {
    name: LIGHT,
    icon: "fi fi-sr-brightness",
  },
];

const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative flex h-8 rounded-full bg-white-50 p-1 dark:bg-big-stone-950">
      {themeButtons.map((item) => (
        <IonButton
          key={item.name}
          aria-label={`Switch theme (${item.name})`}
          className={classNames("btn theme-btn", {
            "hover:text-orange-300": theme === LIGHT,
            "hover:text-orange-400": theme === DARK,
          })}
          onClick={toggleTheme}
        >
          <i className={item.icon}></i>
        </IonButton>
      ))}
      <div
        className={classNames(
          "pointer-events-none absolute bottom-1 top-1 h-6 w-6 rounded-full bg-white-100 shadow-xl duration-300 ease-in dark:bg-ebony-950",
          {
            "right-1 ml-8": theme === DARK,
            "left-1 mr-8": theme == LIGHT,
          },
        )}
      ></div>
    </div>
  );
};

export default ThemeSwitcher;

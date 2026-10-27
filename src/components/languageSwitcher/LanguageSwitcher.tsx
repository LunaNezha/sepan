import React, { useEffect } from "react";
import LanguageSwitcherMobileView from "@components/languageSwitcher/LanguageSwitcherMobileView";
import LanguageSwitcherWebView from "@components/languageSwitcher/LanguageSwitcherWebView";
import { Directions } from "@appTypes/directions";
import { useTranslation } from "react-i18next";

const views = {
  mobile: LanguageSwitcherMobileView,
  web: LanguageSwitcherWebView,
};

type Props = {
  platform: {
    view: "mobile" | "web";
  };
};

const LanguageSwitcher: React.FC<Props> = ({ platform }) => {
  const { i18n } = useTranslation(["translations"]);
  const CurrentView = views[platform.view];

  const handleChangeDirection = (dir: Directions) => {
    document.body.dir = dir;
  };

  useEffect(() => {
    document.body.dir = i18n.dir();
  }, [i18n, i18n.language]);

  return <CurrentView changeDirection={handleChangeDirection} />;
};

export default LanguageSwitcher;

import { useTranslation } from "react-i18next";

const useGenders = () => {
  const { t } = useTranslation("translations");

  return [
    { id: 1, name: t("globals.man"), value: "man" },
    { id: 2, name: t("globals.woman"), value: "female" },
    { id: 3, name: t("globals.unknown"), value: "unknown" },
    { id: 9, name: t("globals.not_selected"), value: "notSet" },
  ];
};

export default useGenders;

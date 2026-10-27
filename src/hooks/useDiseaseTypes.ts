import { useTranslation } from "react-i18next";

const useDiseaseTypes = () => {
  const { t } = useTranslation("translations");

  return [
    { id: 1, name: t("globals.ms"), value: "MS" },
    { id: 2, name: t("globals.transplant"), value: "Transplant" },
    { id: 3, name: t("globals.thalassemia"), value: "Talasemi" },
    { id: 4, name: t("globals.chemotherapy"), value: "Chemotherapy" },
    { id: 0, name: t("globals.none"), value: "None" },
  ];
};

export default useDiseaseTypes;

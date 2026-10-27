import { Button } from "@components/Button";
import { EN, ENGLISH, FA, PERSIAN } from "@constants/languages";
import { Directions } from "@appTypes/directions";
import { IonAlert } from "@ionic/react";
import i18next from "i18next";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  changeDirection: (dir: Directions) => void;
};

const LanguageSwitcherMobileView: React.FC<Props> = ({ changeDirection }) => {
  const { t } = useTranslation("translations");
  const [isAlertOpen, setAlertOpen] = useState(false);

  return (
    <>
      <Button
        className="h-9 w-9 p-0"
        variant={"filled-default"}
        round={"full"}
        onClick={() => setAlertOpen(true)}
      >
        <i className="fi fi-rr-globe"></i>
      </Button>

      <IonAlert
        isOpen={isAlertOpen}
        header={t("choose_lang.header")}
        inputs={[
          {
            label: PERSIAN,
            type: "radio",
            value: FA,
            checked: true,
            handler: () => {
              changeDirection(Directions.RTL);
              i18next.changeLanguage(FA);
              setAlertOpen(false);
            },
          },
          {
            label: ENGLISH,
            type: "radio",
            value: EN,
            handler: () => {
              changeDirection(Directions.LTR);
              i18next.changeLanguage(EN);
              setAlertOpen(false);
            },
          },
        ]}
        buttons={[]}
        onDidDismiss={() => setAlertOpen(false)}
      ></IonAlert>
    </>
  );
};

export default LanguageSwitcherMobileView;

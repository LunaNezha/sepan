import { EN, ENGLISH, FA, PERSIAN } from "@constants/languages";
import { Directions } from "@appTypes/directions";
import { IonLabel, IonPopover } from "@ionic/react";
import React, { useRef, useState } from "react";
import IranFlag from "@assets/images/iran.png";
import UnitedStatesFlag from "@assets/images/united-states.png";
import { Button } from "@components/Button";
import i18next from "i18next";

type Props = {
  changeDirection: (dir: Directions) => void;
};

const LanguageSwitcherWebView: React.FC<Props> = ({ changeDirection }) => {
  const popover = useRef<HTMLIonPopoverElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const languages = [
    {
      name: PERSIAN,
      image: IranFlag,
      handler: () => {
        changeDirection(Directions.RTL);
        i18next.changeLanguage(FA);
        setPopoverOpen(false);
      },
    },
    {
      name: ENGLISH,
      image: UnitedStatesFlag,
      handler: () => {
        changeDirection(Directions.LTR);
        i18next.changeLanguage(EN);
        setPopoverOpen(false);
      },
    },
  ];

  const openPopover = (e: React.MouseEvent<HTMLButtonElement>) => {
    popover.current!.event = e;
    setPopoverOpen(true);
  };

  return (
    <>
      <Button
        className="h-9 w-9 p-0"
        variant={"filled-default"}
        round={"full"}
        onClick={openPopover}
      >
        <i className="fi fi-rr-globe"></i>
      </Button>

      <IonPopover
        ref={popover}
        isOpen={popoverOpen}
        onDidDismiss={() => setPopoverOpen(false)}
        triggerAction="click"
        side="bottom"
        alignment="center"
        className="partContent:w-36 partContent:border-0 partContent:bg-transparent"
      >
        <div className="flex flex-col gap-1 bg-white-50 p-3 dark:bg-big-stone-950">
          {languages.map((item, index) => (
            <a
              key={index}
              onClick={() => item.handler()}
              className="duration-400 flex cursor-pointer items-center gap-2  rounded-md px-3 py-2 ease-in-out hover:bg-white-50  dark:hover:bg-ebony-950"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-5 w-5 object-contain"
              />
              <IonLabel className="font-iranyekan-medium text-sm">
                {item.name}
              </IonLabel>
            </a>
          ))}
        </div>
      </IonPopover>
    </>
  );
};

export default LanguageSwitcherWebView;

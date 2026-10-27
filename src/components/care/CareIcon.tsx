import { IonIcon } from "@ionic/react";
import {
  addOutline,
  arrowForwardOutline,
  arrowBackOutline,
  checkmarkOutline,
  checkmarkCircleOutline,
  cloudUploadOutline,
  documentTextOutline,
  homeOutline,
  timeOutline,
  bagHandleOutline,
  carOutline,
  helpCircleOutline,
  gridOutline,
  listOutline,
  barChartOutline,
  medicalOutline,
  shieldCheckmarkOutline,
  closeOutline,
  searchOutline,
  sunnyOutline,
  moonOutline,
  globeOutline,
  chevronForwardOutline,
  locationOutline,
  callOutline,
  personOutline,
  leafOutline,
} from "ionicons/icons";

const icons = {
  add: addOutline,
  arrow: arrowForwardOutline,
  back: arrowBackOutline,
  check: checkmarkOutline,
  complete: checkmarkCircleOutline,
  upload: cloudUploadOutline,
  document: documentTextOutline,
  home: homeOutline,
  time: timeOutline,
  bag: bagHandleOutline,
  car: carOutline,
  help: helpCircleOutline,
  overview: gridOutline,
  list: listOutline,
  chart: barChartOutline,
  medical: medicalOutline,
  shield: shieldCheckmarkOutline,
  close: closeOutline,
  search: searchOutline,
  sun: sunnyOutline,
  moon: moonOutline,
  globe: globeOutline,
  chevron: chevronForwardOutline,
  location: locationOutline,
  phone: callOutline,
  person: personOutline,
  leaf: leafOutline,
};
export type CareIconName = keyof typeof icons;

export const CareIcon = ({
  name,
  className = "",
}: {
  name: CareIconName;
  className?: string;
}) => (
  <IonIcon
    icon={icons[name]}
    aria-hidden="true"
    data-directional={
      name === "arrow" || name === "back" || name === "chevron"
        ? "true"
        : undefined
    }
    className={`care-icon ${className}`}
  />
);

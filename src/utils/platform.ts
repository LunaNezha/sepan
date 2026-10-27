import { isPlatform } from "@ionic/react";

export const isWebView = () => {
  return isPlatform("desktop");
};

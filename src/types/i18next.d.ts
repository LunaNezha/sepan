import Resources from "@appTypes/resources";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translations";
    resources: Resources;
  }
}

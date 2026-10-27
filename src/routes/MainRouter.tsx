import { useTranslation } from "react-i18next";
import { PathNames } from "@constants/pathnames";
import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { lazy, Suspense, useEffect } from "react";
import { Route, useLocation } from "react-router-dom";
import MainLayout from "@layouts/MainLayout";
import Menu from "@components/Menu";
import AppLoading from "@pages/AppLoading";
import { usePageTitle } from "@hooks/usePageTitle";
import AuthRoutes from "@routes/AuthRoutes";
import { CareIcon, type CareIconName } from "@components/care/CareIcon";

const Home = lazy(() => import("@pages/Home"));
const PrescriptionTracking = lazy(() => import("@pages/PrescriptionTracking"));
const NewPrescription = lazy(() => import("@pages/NewPrescription"));
const Pharmacy = lazy(() => import("@pages/Pharmacy"));
const PharmacyAnalytics = lazy(() => import("@pages/PharmacyAnalytics"));
const Help = lazy(() => import("@pages/Help"));
const NotFound = lazy(() => import("@pages/NotFound"));

const AppRoutes = () => {
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation("translations");
  const pageTitles: Record<string, string> = {
    [PathNames.Home]: t("care.dashboard"),
    [PathNames.PrescriptionTracking]: t("care.tracking"),
    "/prescriptions/new": t("care.newRequest"),
    "/pharmacy": t("care.pharmacy"),
    "/pharmacy/analytics": t("care.analytics"),
    "/help": t("care.help"),
    "/pharmacy/help": t("care.help"),
    [PathNames.Auth.LoginFirstStep]: t("titles.login"),
    [PathNames.Auth.LoginSecondStep]: t("titles.login"),
    [PathNames.Auth.Register]: t("app_title"),
    [PathNames.Auth.VerifyCode]: t("app_title"),
    [PathNames.Auth.ChangePhoneNumber]: t("app_title"),
  };
  const brandTitle = `${t("app_title")} | ${t("app_complete_title")}`;
  const pageTitle = pageTitles[pathname] ?? t("titles.not_found");
  usePageTitle(
    pathname === PathNames.Home || pageTitle === t("app_title")
      ? brandTitle
      : `${pageTitle} | ${t("app_title")}`,
  );
  useEffect(() => {
    document.documentElement.lang = i18n.resolvedLanguage ?? "fa";
    document.documentElement.dir = i18n.dir();
    document.body.dir = i18n.dir();
  }, [i18n, i18n.resolvedLanguage]);
  const isAuthRoute = pathname.startsWith("/auth/");
  const staff = pathname.startsWith("/pharmacy");
  const tabs: { name: string; icon: CareIconName; to: string; tab: string }[] =
    staff
      ? [
          {
            name: t("care.pharmacy"),
            icon: "list",
            to: "/pharmacy",
            tab: "queue",
          },
          {
            name: t("care.analytics"),
            icon: "chart",
            to: "/pharmacy/analytics",
            tab: "analytics",
          },
          {
            name: t("care.help"),
            icon: "help",
            to: "/pharmacy/help",
            tab: "staff-help",
          },
          {
            name: t("care.patientSpace"),
            icon: "person",
            to: "/",
            tab: "patient",
          },
        ]
      : [
          { name: t("care.dashboard"), icon: "overview", to: "/", tab: "home" },
          {
            name: t("care.newRequest"),
            icon: "add",
            to: "/prescriptions/new",
            tab: "new",
          },
          {
            name: t("care.tracking"),
            icon: "document",
            to: "/prescription-tracking",
            tab: "tracking",
          },
          { name: t("care.help"), icon: "help", to: "/help", tab: "help" },
        ];
  const appRoutes = [
    { path: "/", Page: Home },
    { path: "/prescriptions/new", Page: NewPrescription },
    { path: "/prescription-tracking", Page: PrescriptionTracking },
    { path: "/pharmacy", Page: Pharmacy },
    { path: "/pharmacy/analytics", Page: PharmacyAnalytics },
    { path: "/help", Page: Help },
    { path: "/pharmacy/help", Page: Help },
    { path: "*", Page: NotFound },
  ];

  return (
    <IonSplitPane
      contentId="main"
      when={isAuthRoute ? false : "(min-width: 1024px)"}
      className="care-split-pane"
    >
      {!isAuthRoute && <Menu />}
      <div id="main" className="ion-page">
        <IonTabs>
          <IonRouterOutlet id="app-outlet">
            <Route path="/auth/*" element={<AuthRoutes />} />
            {appRoutes.map(({ path, Page }) => (
              <Route
                key={path}
                path={path}
                element={
                  <MainLayout>
                    <Suspense fallback={<AppLoading />}>
                      <Page />
                    </Suspense>
                  </MainLayout>
                }
              />
            ))}
          </IonRouterOutlet>
          <IonTabBar
            slot="bottom"
            className={`care-tab-bar ${isAuthRoute ? "care-tab-bar--hidden" : ""}`}
          >
            {tabs.map((item) => (
              <IonTabButton
                key={item.tab}
                tab={item.tab}
                href={item.to}
                className={pathname === item.to ? "is-current" : ""}
              >
                <CareIcon name={item.icon} />
                <IonLabel>{item.name}</IonLabel>
              </IonTabButton>
            ))}
          </IonTabBar>
        </IonTabs>
      </div>
    </IonSplitPane>
  );
};
const MainRouter = () => (
  <IonApp>
    <IonReactRouter basename={import.meta.env.BASE_URL}>
      <AppRoutes />
    </IonReactRouter>
  </IonApp>
);
export default MainRouter;

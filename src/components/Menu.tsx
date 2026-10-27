import { IonContent, IonMenu, IonMenuToggle } from "@ionic/react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CareIcon, type CareIconName } from "@components/care/CareIcon";
import { CareLink } from "@components/care/CareButton";
import LightLogo from "@assets/images/logo.png";
import DarkLogo from "@assets/images/logo-dark.png";
import { useTheme } from "@hooks/useTheme";

const Menu = () => {
  const { t } = useTranslation("translations");
  const { theme } = useTheme();
  const { pathname } = useLocation();
  const staff = pathname.startsWith("/pharmacy");
  const pages: { label: string; to: string; icon: CareIconName }[] = staff
    ? [
        { label: t("care.pharmacy"), to: "/pharmacy", icon: "list" },
        {
          label: t("care.analytics"),
          to: "/pharmacy/analytics",
          icon: "chart",
        },
        { label: t("care.help"), to: "/pharmacy/help", icon: "help" },
      ]
    : [
        { label: t("care.dashboard"), to: "/", icon: "overview" },
        { label: t("care.newRequest"), to: "/prescriptions/new", icon: "add" },
        {
          label: t("care.tracking"),
          to: "/prescription-tracking",
          icon: "document",
        },
        { label: t("care.help"), to: "/help", icon: "help" },
      ];
  return (
    <IonMenu
      id="menu"
      contentId="main"
      type="overlay"
      side="start"
      className="care-menu"
    >
      <IonContent className="care-menu-content">
        <div className="care-sidebar">
          <NavLink
            to={staff ? "/pharmacy" : "/"}
            className="care-brand"
            aria-label={t("app_title")}
          >
            <img src={theme === "dark" ? LightLogo : DarkLogo} alt="" />
            <div>
              <strong>{t("app_title")}</strong>
              <span>{t("care.brandNote")}</span>
            </div>
          </NavLink>
          <p className="care-nav-label">
            {t(staff ? "care.pharmacySpace" : "care.patientSpace")}
          </p>
          <nav
            aria-label={t(staff ? "care.pharmacySpace" : "care.patientSpace")}
            className="care-nav"
          >
            {pages.map((page) => (
              <IonMenuToggle key={page.to} autoHide={false}>
                <NavLink to={page.to} end>
                  <CareIcon name={page.icon} />
                  <span>{page.label}</span>
                </NavLink>
              </IonMenuToggle>
            ))}
          </nav>
          <div className="care-sidebar-help">
            <span className="care-small-icon">
              <CareIcon name="help" />
            </span>
            <h2>{t("care.needHelp")}</h2>
            <p>{t("care.helpDescription")}</p>
            <IonMenuToggle autoHide={false}>
              <CareLink
                to={staff ? "/pharmacy/help" : "/help"}
                variant="secondary"
              >
                {t("care.helpAction")}
              </CareLink>
            </IonMenuToggle>
          </div>
          <div className="care-sidebar-footer">
            <CareIcon name="leaf" />
            <span>{t("care.hello")}</span>
          </div>
        </div>
      </IonContent>
    </IonMenu>
  );
};
export default Menu;

import { IonButtons, IonHeader, IonMenuButton } from "@ionic/react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@hooks/useTheme";
import { CareIcon } from "@components/care/CareIcon";

const Header = () => {
  const { t, i18n } = useTranslation("translations");
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const staff = pathname.startsWith("/pharmacy");
  return (
    <IonHeader className="care-header">
      <button
        className="care-skip-link"
        onClick={(event) =>
          event.currentTarget
            .closest(".ion-page")
            ?.querySelector<HTMLElement>("main")
            ?.focus()
        }
      >
        {t("care.skip")}
      </button>
      <div className="care-header-inner">
        <div className="flex min-w-0 items-center gap-2">
          <IonButtons>
            <IonMenuButton
              aria-label={t("care.menu")}
              className="care-menu-button"
            />
          </IonButtons>
          <nav className="care-workspaces" aria-label={t("care.workspace")}>
            <NavLink
              to="/"
              end
              className={!staff ? "is-selected" : ""}
              aria-current={!staff ? "page" : undefined}
            >
              <span className="care-workspace-full">
                {t("care.patientSpace")}
              </span>
              <span className="care-workspace-short">
                {t("care.patientView")}
              </span>
            </NavLink>
            <NavLink to="/pharmacy" className={staff ? "is-selected" : ""}>
              <span className="care-workspace-full">
                {t("care.pharmacySpace")}
              </span>
              <span className="care-workspace-short">
                {t("care.pharmacyView")}
              </span>
            </NavLink>
          </nav>
        </div>
        <div className="care-header-actions">
          <label className="care-language">
            <CareIcon name="globe" />
            <span className="care-sr-only">{t("care.language")}</span>
            <select
              aria-label={t("care.language")}
              value={i18n.resolvedLanguage?.startsWith("fa") ? "fa" : "en"}
              onChange={(event) => void i18n.changeLanguage(event.target.value)}
            >
              <option value="fa">فارسی</option>
              <option value="en">English</option>
            </select>
          </label>
          <button
            type="button"
            className="care-icon-button"
            aria-label={t("care.theme")}
            onClick={toggleTheme}
            aria-pressed={theme === "dark"}
            data-testid="theme-toggle"
          >
            <CareIcon name={theme === "dark" ? "sun" : "moon"} />
          </button>
        </div>
      </div>
      <div className="care-preview-banner">
        <span>{t("care.preview")}</span>
        <p>{t("care.previewNote")}</p>
      </div>
    </IonHeader>
  );
};
export default Header;

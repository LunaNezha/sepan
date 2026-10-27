import { IonContent } from "@ionic/react";
import { useTranslation } from "react-i18next";
import { CareIcon } from "@components/care/CareIcon";
import { CareLink } from "@components/care/CareButton";

const NotFound = () => {
  const { t } = useTranslation("translations");

  return (
    <IonContent className="care-content">
      <main className="care-page care-not-found" data-care-main tabIndex={-1}>
        <section
          className="care-card care-not-found-card"
          aria-labelledby="not-found-title"
        >
          <div className="care-not-found-art" aria-hidden="true">
            <div className="care-not-found-orbit" />
            <div className="care-not-found-paper">
              <span className="care-not-found-cross">
                <CareIcon name="medical" />
              </span>
              <span className="care-not-found-line" />
              <span className="care-not-found-line" />
              <span className="care-not-found-line" />
              <span className="care-not-found-paper-code" dir="ltr">
                404
              </span>
            </div>
            <span className="care-not-found-search">
              <CareIcon name="search" />
            </span>
            <span className="care-not-found-leaf">
              <CareIcon name="leaf" />
            </span>
          </div>
          <div className="care-not-found-copy">
            <p className="care-eyebrow">{t("care.notFoundLabel")}</p>
            <h1 id="not-found-title">{t("care.notFoundTitle")}</h1>
            <p className="care-description">{t("care.notFoundDescription")}</p>
            <div className="care-not-found-actions">
              <CareLink to="/" icon="home">
                {t("buttons.back_home")}
              </CareLink>
              <CareLink
                to="/prescription-tracking"
                variant="secondary"
                icon="document"
              >
                {t("care.allPrescriptions")}
              </CareLink>
            </div>
            <p className="care-not-found-help">
              {t("care.notFoundHelp")}{" "}
              <CareLink to="/help" variant="quiet" icon="help">
                {t("care.help")}
              </CareLink>
            </p>
          </div>
        </section>
      </main>
    </IonContent>
  );
};

export default NotFound;

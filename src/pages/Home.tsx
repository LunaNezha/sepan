import { IonContent } from "@ionic/react";
import { useTranslation } from "react-i18next";
import { CareLink } from "@components/care/CareButton";
import { CareIcon, type CareIconName } from "@components/care/CareIcon";
import { PageHeading } from "@components/care/PageHeading";
import { StatusBadge } from "@components/care/StatusBadge";
import { usePrescriptionRequests } from "@hooks/usePrescriptionRequests";

const howSteps: {
  icon: CareIconName;
  title: "howUpload" | "howReview" | "howReceive";
  description:
    "howUploadDescription" | "howReviewDescription" | "howReceiveDescription";
}[] = [
  { icon: "upload", title: "howUpload", description: "howUploadDescription" },
  { icon: "shield", title: "howReview", description: "howReviewDescription" },
  { icon: "bag", title: "howReceive", description: "howReceiveDescription" },
];

const Home = () => {
  const { t } = useTranslation("translations");
  const { requests } = usePrescriptionRequests();
  const latest = [...requests]
    .reverse()
    .find((request) => request.patientVisible);

  return (
    <IonContent className="care-content">
      <main className="care-page" data-care-main tabIndex={-1}>
        <PageHeading
          eyebrow={t("care.hello")}
          title={t("care.homeTitle")}
          description={t("care.homeDescription")}
        />
        <div className="care-home-grid grid gap-6 xl:grid-cols-[1.2fr_1fr]">
          <section className="care-upload-card" aria-labelledby="upload-title">
            <div className="care-prescription-art" aria-hidden="true">
              <div className="care-art-sheet">
                <span className="care-art-cross">
                  <CareIcon name="medical" />
                </span>
                <span className="care-art-line" />
                <span className="care-art-line short" />
                <div className="care-art-check">
                  <CareIcon name="check" />
                </div>
              </div>
              <span className="care-art-leaf">
                <CareIcon name="leaf" />
              </span>
            </div>
            <div className="care-upload-copy">
              <span className="care-eyebrow">{t("care.threeSteps")}</span>
              <h2 id="upload-title">{t("care.uploadTitle")}</h2>
              <p>{t("care.uploadDescription")}</p>
              <CareLink
                to="/prescriptions/new"
                icon="add"
                className="care-upload-cta"
              >
                {t("care.uploadAction")}
              </CareLink>
              <span className="care-upload-hint">
                <CareIcon name="document" />
                {t("care.uploadHint")}
              </span>
            </div>
          </section>
          <section
            className="care-card care-latest"
            aria-labelledby="latest-title"
          >
            <div className="care-inline-heading">
              <h2 id="latest-title">{t("care.activePrescription")}</h2>
              <span className="care-small-icon">
                <CareIcon name="document" />
              </span>
            </div>
            {latest && (
              <>
                <div className="care-request-heading">
                  <div>
                    <p className="care-muted">
                      {latest.sampleLetter
                        ? t("care.samplePrescription")
                        : t("care.newRequest")}
                    </p>
                    <h3 dir="ltr">{latest.id}</h3>
                  </div>
                  <StatusBadge status={latest.status} />
                </div>
                <div className="care-mini-progress" aria-hidden="true">
                  {[
                    "reviewing",
                    "preparing",
                    "ready",
                    "delivering",
                    "delivered",
                  ].map((status, index, all) => (
                    <span
                      key={status}
                      className={
                        index <= all.indexOf(latest.status) ? "is-complete" : ""
                      }
                    />
                  ))}
                </div>
                <p className="care-status-summary">
                  {t(`care.statusHint.${latest.status}`)}
                </p>
                <CareLink
                  to={`/prescription-tracking?request=${latest.id}`}
                  variant="secondary"
                  icon="arrow"
                >
                  {t("care.viewProgress")}
                </CareLink>
              </>
            )}
          </section>
        </div>
        <section className="care-how-section" aria-labelledby="how-title">
          <div className="care-inline-heading">
            <div>
              <h2 id="how-title">{t("care.howItWorks")}</h2>
              <p className="care-muted">{t("care.howDescription")}</p>
            </div>
            <span className="care-eyebrow">01 — 03</span>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {howSteps.map((item, index) => (
              <article key={item.title} className="care-how-card">
                <div className="care-how-top">
                  <span className="care-small-icon">
                    <CareIcon name={item.icon} />
                  </span>
                  <span className="care-how-number">0{index + 1}</span>
                </div>
                <h3>{t(`care.${item.title}`)}</h3>
                <p className="care-muted">{t(`care.${item.description}`)}</p>
              </article>
            ))}
          </div>
        </section>
        <aside className="care-help-strip">
          <span className="care-small-icon">
            <CareIcon name="help" />
          </span>
          <div className="flex-1">
            <h2>{t("care.needHelp")}</h2>
            <p className="care-muted">{t("care.helpDescription")}</p>
          </div>
          <CareLink to="/help" variant="quiet" icon="arrow">
            {t("care.helpAction")}
          </CareLink>
        </aside>
      </main>
    </IonContent>
  );
};

export default Home;

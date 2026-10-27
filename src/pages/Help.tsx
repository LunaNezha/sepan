import { IonContent } from "@ionic/react";
import { useTranslation } from "react-i18next";
import { PageHeading } from "@components/care/PageHeading";
import { CareIcon } from "@components/care/CareIcon";

const questions = [
  "faqPhoto",
  "faqAfter",
  "faqDelivery",
  "faqPrivacy",
  "faqUrgent",
] as const;
const Help = () => {
  const { t } = useTranslation("translations");
  return (
    <IonContent className="care-content">
      <main
        data-care-main
        tabIndex={-1}
        className="care-page care-page--narrow"
      >
        <PageHeading
          title={t("care.helpTitle")}
          description={t("care.helpIntro")}
        />
        <section className="care-card care-faq">
          {questions.map((question, index) => (
            <details
              className="care-details"
              key={question}
              open={index === 0 ? true : undefined}
            >
              <summary>{t(`care.${question}`)}</summary>
              <p>{t(`care.${question}Answer`)}</p>
            </details>
          ))}
        </section>
        <aside className="care-help-strip">
          <CareIcon name="help" />
          <p>{t("care.helpFooter")}</p>
        </aside>
      </main>
    </IonContent>
  );
};

export default Help;

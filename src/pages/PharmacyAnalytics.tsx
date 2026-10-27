import { useState } from "react";
import { IonContent } from "@ionic/react";
import { useTranslation } from "react-i18next";
import { PageHeading } from "@components/care/PageHeading";
import { CareLink } from "@components/care/CareButton";
import { CareIcon, type CareIconName } from "@components/care/CareIcon";
import { RequestVolumeChart } from "@components/charts/RequestVolumeChart";
import { usePrescriptionRequests } from "@hooks/usePrescriptionRequests";
import { requestStatuses } from "@appTypes/prescriptionRequest";
import {
  getPrescriptionAnalytics,
  type AnalyticsPeriod,
} from "@utils/prescriptionAnalytics";

const PharmacyAnalytics = () => {
  const { t, i18n } = useTranslation("translations");
  const { requests } = usePrescriptionRequests();
  const [period, setPeriod] = useState<AnalyticsPeriod>(7);
  const report = getPrescriptionAnalytics(requests, period);
  const numbers = new Intl.NumberFormat(i18n.language);
  const percentages = new Intl.NumberFormat(i18n.language, {
    style: "percent",
    maximumFractionDigits: 0,
  });
  const dates = new Intl.DateTimeFormat(i18n.language, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const metrics: {
    label: string;
    value: number;
    hint: string;
    icon: CareIconName;
    key: string;
  }[] = [
    {
      key: "total",
      label: t("reports.total"),
      value: report.total,
      hint: t("reports.totalHint"),
      icon: "document",
    },
    {
      key: "reviewing",
      label: t("care.incoming"),
      value: report.statuses.reviewing,
      hint: t("reports.reviewHint"),
      icon: "time",
    },
    {
      key: "inProgress",
      label: t("care.inProgress"),
      value: report.inProgress,
      hint: t("reports.progressHint"),
      icon: "medical",
    },
    {
      key: "completed",
      label: t("care.completed"),
      value: report.statuses.delivered,
      hint: t("reports.completionHint", {
        value: percentages.format(report.completionRate),
      }),
      icon: "complete",
    },
  ];
  return (
    <IonContent className="care-content">
      <main className="care-page care-analytics" data-care-main tabIndex={-1}>
        <PageHeading
          eyebrow={t("care.pharmacySpace")}
          title={t("care.analytics")}
          description={t("care.analyticsDescription")}
          action={
            <CareLink to="/pharmacy" variant="secondary" icon="list">
              {t("reports.openQueue")}
            </CareLink>
          }
        />
        <section
          className="care-card care-analytics-toolbar"
          aria-label={t("reports.period")}
        >
          <div className="care-analytics-period-copy">
            <span className="care-small-icon">
              <CareIcon name="chart" />
            </span>
            <div>
              <h2>{t("reports.period")}</h2>
              <p className="care-muted" data-testid="analytics-date-range">
                {dates.formatRange(report.start, report.end)}
              </p>
            </div>
          </div>
          <div
            className="care-filters care-analytics-period"
            role="group"
            aria-label={t("reports.period")}
          >
            {([7, 30] as const).map((days) => (
              <button
                key={days}
                type="button"
                aria-pressed={period === days}
                onClick={() => setPeriod(days)}
              >
                {t("reports.lastDays", {
                  count: days,
                  value: numbers.format(days),
                })}
              </button>
            ))}
          </div>
        </section>
        <div
          className="care-analytics-scope"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="care-analytics-preview">
            <CareIcon name="shield" />
            {t("reports.sessionData")}
          </span>
          <p>
            {t("reports.scope", {
              count: period,
              value: numbers.format(period),
            })}
          </p>
        </div>
        <section
          className="care-analytics-metrics grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          aria-label={t("reports.summary")}
        >
          {metrics.map((metric) => (
            <article
              className="care-card care-analytics-metric"
              key={metric.key}
              data-testid={`analytics-${metric.key}`}
            >
              <div className="care-analytics-metric-label">
                <h2>{metric.label}</h2>
                <span className="care-small-icon">
                  <CareIcon name={metric.icon} />
                </span>
              </div>
              <p className="care-analytics-number">
                {numbers.format(metric.value)}
              </p>
              <p className="care-muted">{metric.hint}</p>
            </article>
          ))}
        </section>
        <div className="care-analytics-charts grid items-start gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
          <RequestVolumeChart daily={report.daily} total={report.total} />
          <section
            className="care-card care-analytics-status"
            aria-labelledby="status-title"
          >
            <div className="care-inline-heading">
              <div>
                <h2 id="status-title">{t("reports.statusTitle")}</h2>
                <p className="care-muted">{t("reports.statusDescription")}</p>
              </div>
            </div>
            <ul className="care-analytics-breakdown">
              {requestStatuses.map((status) => {
                const count = report.statuses[status];
                const share = report.total ? count / report.total : 0;
                return (
                  <li key={status}>
                    <div className="care-analytics-breakdown-label">
                      <span>{t(`care.status.${status}`)}</span>
                      <strong>
                        {numbers.format(count)}
                        <span className="care-muted">
                          {" "}
                          · {percentages.format(share)}
                        </span>
                      </strong>
                    </div>
                    <div className="care-analytics-track" aria-hidden="true">
                      <span style={{ width: `${share * 100}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="care-analytics-card-note">
              {t("reports.currentStatusNote")}
            </p>
          </section>
        </div>
        <div className="grid items-start gap-6 lg:grid-cols-2">
          <section className="care-card" aria-labelledby="fulfillment-title">
            <div className="care-inline-heading">
              <div>
                <h2 id="fulfillment-title">{t("reports.fulfillmentTitle")}</h2>
                <p className="care-muted">
                  {t("reports.fulfillmentDescription")}
                </p>
              </div>
            </div>
            <ul className="care-analytics-breakdown">
              {(["pickup", "delivery"] as const).map((method) => (
                <li key={method}>
                  <div className="care-analytics-breakdown-label">
                    <span className="care-analytics-method">
                      <CareIcon name={method === "pickup" ? "bag" : "car"} />
                      {t(`care.deliveryLabel.${method}`)}
                    </span>
                    <strong>
                      {numbers.format(report.fulfillment[method])}
                    </strong>
                  </div>
                  <div className="care-analytics-track" aria-hidden="true">
                    <span
                      style={{
                        width: `${report.total ? (report.fulfillment[method] / report.total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <aside
            className="care-card care-analytics-next"
            aria-labelledby="analytics-next-title"
          >
            <span className="care-small-icon">
              <CareIcon name="list" />
            </span>
            <div>
              <h2 id="analytics-next-title">{t("reports.nextTitle")}</h2>
              <p className="care-muted">{t("reports.nextDescription")}</p>
            </div>
            <CareLink to="/pharmacy" variant="secondary" icon="arrow">
              {t("reports.openQueue")}
            </CareLink>
            <p className="care-analytics-card-note">{t("reports.dataNote")}</p>
          </aside>
        </div>
      </main>
    </IonContent>
  );
};
export default PharmacyAnalytics;

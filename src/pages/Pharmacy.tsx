import { useEffect, useRef, useState } from "react";
import { IonContent } from "@ionic/react";
import { useTranslation } from "react-i18next";
import { usePrescriptionRequests } from "@hooks/usePrescriptionRequests";
import {
  requestStatuses,
  type RequestStatus,
} from "@appTypes/prescriptionRequest";
import { PageHeading } from "@components/care/PageHeading";
import { CareButton, CareLink } from "@components/care/CareButton";
import { CareIcon } from "@components/care/CareIcon";
import { StatusBadge } from "@components/care/StatusBadge";
import { RequestFiles } from "@components/care/RequestFiles";

type Filter = "all" | "reviewing" | "inProgress" | "delivered";

const Pharmacy = () => {
  const { t, i18n } = useTranslation("translations");
  const { requests, updateStatus } = usePrescriptionRequests();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const detailHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (selectedId) detailHeading.current?.focus();
  }, [selectedId]);
  const [announcement, setAnnouncement] = useState("");
  const matchesFilter = (status: RequestStatus) =>
    filter === "all" ||
    (filter === "inProgress"
      ? !["reviewing", "delivered"].includes(status)
      : status === filter);
  const visible = requests
    .filter(
      (request) =>
        matchesFilter(request.status) &&
        `${request.id} ${request.name}`
          .toLocaleLowerCase()
          .includes(query.trim().toLocaleLowerCase()),
    )
    .sort((a, b) => a.createdAt - b.createdAt);
  const selected = requests.find((request) => request.id === selectedId);
  const nextStatus =
    selected &&
    requestStatuses[
      requestStatuses.indexOf(selected.status) +
        (selected.fulfillment === "pickup" && selected.status === "ready"
          ? 2
          : 1)
    ];
  const filters: { value: Filter; label: string; count: number }[] = [
    { value: "all", label: t("care.all"), count: requests.length },
    {
      value: "reviewing",
      label: t("care.incoming"),
      count: requests.filter((request) => request.status === "reviewing")
        .length,
    },
    {
      value: "inProgress",
      label: t("care.inProgress"),
      count: requests.filter(
        (request) => !["reviewing", "delivered"].includes(request.status),
      ).length,
    },
    {
      value: "delivered",
      label: t("care.completed"),
      count: requests.filter((request) => request.status === "delivered")
        .length,
    },
  ];

  return (
    <IonContent className="care-content">
      <main className="care-page" data-care-main tabIndex={-1}>
        <PageHeading
          eyebrow={t("care.pharmacySpace")}
          title={t("care.queueTitle")}
          description={t("care.queueDescription")}
          action={
            <CareLink to="/pharmacy/analytics" variant="secondary" icon="chart">
              {t("care.analytics")}
            </CareLink>
          }
        />
        <div className="care-queue-stats grid gap-4 sm:grid-cols-3">
          {[
            {
              label: t("care.incoming"),
              count: filters[1].count,
              icon: "document" as const,
            },
            {
              label: t("care.inProgress"),
              count: filters[2].count,
              icon: "time" as const,
            },
            {
              label: t("care.completed"),
              count: filters[3].count,
              icon: "complete" as const,
            },
          ].map((item) => (
            <div className="care-card care-stat" key={item.label}>
              <span className="care-small-icon">
                <CareIcon name={item.icon} />
              </span>
              <span>{item.label}</span>
              <strong>
                {new Intl.NumberFormat(i18n.language).format(item.count)}
              </strong>
            </div>
          ))}
        </div>
        <div className="care-queue-layout grid items-start gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <section
            className="care-card care-queue-panel"
            aria-labelledby="queue-title"
          >
            <div className="care-inline-heading">
              <h2 id="queue-title">{t("care.queue")}</h2>
              <span className="care-count">{requests.length}</span>
            </div>
            <div className="care-field">
              <label className="care-sr-only" htmlFor="queue-search">
                {t("care.queueSearch")}
              </label>
              <div className="care-search-input">
                <CareIcon name="search" />
                <input
                  id="queue-search"
                  type="search"
                  placeholder={t("care.queueSearch")}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  maxLength={80}
                />
              </div>
            </div>
            <div
              className="care-filters"
              role="group"
              aria-label={t("care.queue")}
            >
              {filters.map((item) => (
                <button
                  key={item.value}
                  aria-pressed={filter === item.value}
                  onClick={() => setFilter(item.value)}
                >
                  {item.label}
                  <span>{item.count}</span>
                </button>
              ))}
            </div>
            <p className="care-field-hint">{t("care.priorityNote")}</p>
            <ul className="care-queue-list">
              {visible.map((request) => (
                <li key={request.id}>
                  <button
                    className={selected?.id === request.id ? "is-selected" : ""}
                    onClick={() => setSelectedId(request.id)}
                    aria-pressed={selected?.id === request.id}
                    data-testid={`queue-${request.id}`}
                  >
                    <span className="care-queue-order">
                      <strong dir="ltr">{request.id}</strong>
                      <span>
                        {request.sampleLetter
                          ? t("care.samplePatient", {
                              letter: request.sampleLetter,
                            })
                          : request.name}
                      </span>
                      <span className="care-muted">
                        {t(`care.deliveryLabel.${request.fulfillment}`)}
                      </span>
                    </span>
                    <StatusBadge status={request.status} />
                    <CareIcon name="chevron" />
                  </button>
                </li>
              ))}
            </ul>
            {!visible.length && (
              <p className="care-empty" role="status">
                {t("care.queueEmpty")}
              </p>
            )}
          </section>
          {selected ? (
            <section
              className="care-card care-order-detail"
              aria-labelledby="order-title"
            >
              <div className="care-inline-heading">
                <div>
                  <p className="care-eyebrow">{t("care.requestDetails")}</p>
                  <h2
                    id="order-title"
                    dir="ltr"
                    ref={detailHeading}
                    tabIndex={-1}
                  >
                    {selected.id}
                  </h2>
                </div>
                <StatusBadge status={selected.status} />
              </div>
              <dl className="care-definition-list">
                <div>
                  <dt>{t("care.patient")}</dt>
                  <dd>
                    {selected.sampleLetter
                      ? t("care.samplePatient", {
                          letter: selected.sampleLetter,
                        })
                      : selected.name}
                  </dd>
                </div>
                {selected.phone && (
                  <div>
                    <dt>{t("care.phone")}</dt>
                    <dd dir="ltr">{selected.phone}</dd>
                  </div>
                )}
                <div>
                  <dt>{t("care.fulfillment")}</dt>
                  <dd>{t(`care.deliveryLabel.${selected.fulfillment}`)}</dd>
                </div>
                {selected.address && (
                  <div>
                    <dt>{t("care.address")}</dt>
                    <dd>{selected.address}</dd>
                  </div>
                )}
                {selected.note && (
                  <div>
                    <dt>{t("care.optionalNote")}</dt>
                    <dd>{selected.note}</dd>
                  </div>
                )}
              </dl>
              <h3>{t("care.prescriptionFiles")}</h3>
              <RequestFiles files={selected.files} />
              <p className="care-info-note">{t("care.noPayment")}</p>
              {nextStatus ? (
                <CareButton
                  className="w-full"
                  icon="check"
                  data-testid="advance-status"
                  onClick={() => {
                    updateStatus(selected.id, nextStatus);
                    setAnnouncement(
                      t("care.statusUpdated", {
                        id: selected.id,
                        status: t(`care.status.${nextStatus}`),
                      }),
                    );
                  }}
                >
                  {t("care.advance", {
                    status: t(`care.status.${nextStatus}`),
                  })}
                </CareButton>
              ) : (
                <p className="care-completed-note">
                  <CareIcon name="complete" />
                  {t("care.completeMessage")}
                </p>
              )}
            </section>
          ) : (
            <section className="care-card care-empty">
              <span className="care-small-icon">
                <CareIcon name="document" />
              </span>
              <h2>{t("care.selectOrder")}</h2>
              <p className="care-muted">{t("care.selectOrderHint")}</p>
            </section>
          )}
        </div>
        <p className="care-live-announcement" role="status" aria-live="polite">
          {announcement}
        </p>
      </main>
    </IonContent>
  );
};

export default Pharmacy;

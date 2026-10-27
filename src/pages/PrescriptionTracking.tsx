import { useState, type FormEvent } from "react";
import { IonContent } from "@ionic/react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { usePrescriptionRequests } from "@hooks/usePrescriptionRequests";
import { PageHeading } from "@components/care/PageHeading";
import { CareButton, CareLink } from "@components/care/CareButton";
import { CareIcon } from "@components/care/CareIcon";
import { StatusBadge } from "@components/care/StatusBadge";
import { StatusTimeline } from "@components/care/StatusTimeline";
import { RequestFiles } from "@components/care/RequestFiles";

const PrescriptionTracking = () => {
  const { t, i18n } = useTranslation("translations");
  const { requests } = usePrescriptionRequests();
  const { search } = useLocation();
  const navigate = useNavigate();
  const selectedId = new URLSearchParams(search).get("request");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const patientRequests = requests
    .filter(
      (request) =>
        request.patientVisible &&
        (statusFilter === "all" ||
          (statusFilter === "active"
            ? request.status !== "delivered"
            : request.status === "delivered")),
    )
    .reverse();
  const selected = selectedId
    ? patientRequests.find(
        (request) => request.id.toLowerCase() === selectedId.toLowerCase(),
      )
    : patientRequests[0];
  const findRequest = (event: FormEvent) => {
    event.preventDefault();
    navigate(
      query.trim()
        ? `/prescription-tracking?request=${encodeURIComponent(query.trim())}`
        : "/prescription-tracking",
    );
  };

  return (
    <IonContent className="care-content">
      <main className="care-page" data-care-main tabIndex={-1}>
        <PageHeading
          title={t("care.trackingTitle")}
          description={t("care.trackingDescription")}
          action={
            <CareLink to="/prescriptions/new" icon="add">
              {t("care.newRequest")}
            </CareLink>
          }
        />
        <section
          className="care-card care-search-toolbar"
          aria-labelledby="request-search-title"
        >
          <div className="care-search-heading">
            <span className="care-search-emblem" aria-hidden="true">
              <CareIcon name="search" />
            </span>
            <div>
              <h2 id="request-search-title">{t("care.searchLabel")}</h2>
              <p className="care-muted" id="request-search-hint">
                {t("care.searchHint")}
              </p>
            </div>
          </div>
          <form
            className="care-search-form"
            onSubmit={findRequest}
            role="search"
            aria-labelledby="request-search-title"
          >
            <div className="care-field care-search-query">
              <label htmlFor="tracking-search">
                {t("care.requestNumberLabel")}
              </label>
              <div className="care-search-input">
                <CareIcon name="search" />
                <input
                  id="tracking-search"
                  name="idTracking"
                  placeholder={t("care.searchPlaceholder")}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  maxLength={40}
                  aria-describedby="request-search-hint"
                />
              </div>
            </div>
            <div className="care-field">
              <label htmlFor="tracking-status">{t("care.filterStatus")}</label>
              <select
                id="tracking-status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="all">{t("care.all")}</option>
                <option value="active">{t("care.activeRequests")}</option>
                <option value="completed">{t("care.completed")}</option>
              </select>
            </div>
            <CareButton type="submit" variant="secondary" icon="search">
              {t("care.search")}
            </CareButton>
          </form>
          {(selectedId || query || statusFilter !== "all") && (
            <CareButton
              variant="quiet"
              className="care-search-reset"
              icon="back"
              onClick={() => {
                setQuery("");
                setStatusFilter("all");
                navigate("/prescription-tracking");
              }}
            >
              {t("care.resetSearch")}
            </CareButton>
          )}
        </section>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(220px,0.8fr)_minmax(0,1.7fr)]">
          <section
            className="care-request-list"
            aria-label={t("care.allPrescriptions")}
          >
            {patientRequests.map((request) => (
              <button
                key={request.id}
                className={`care-request-option ${selected?.id === request.id ? "is-selected" : ""}`}
                onClick={() =>
                  navigate(`/prescription-tracking?request=${request.id}`)
                }
                aria-pressed={selected?.id === request.id}
              >
                <span className="care-option-id" dir="ltr">
                  {request.id}
                </span>
                <StatusBadge status={request.status} />
                <span className="care-muted">
                  {t(`care.deliveryLabel.${request.fulfillment}`)}
                </span>
              </button>
            ))}
          </section>
          {selected ? (
            <section
              className="care-card care-tracking-card"
              aria-labelledby="tracking-title"
            >
              <div className="care-inline-heading">
                <div>
                  <p className="care-eyebrow">{t("care.progress")}</p>
                  <h2 id="tracking-title" dir="ltr">
                    {selected.id}
                  </h2>
                </div>
                <StatusBadge status={selected.status} />
              </div>
              <p className="care-muted">
                {t("care.updated", {
                  time: new Intl.DateTimeFormat(i18n.language, {
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(selected.updatedAt),
                })}
              </p>
              <div
                aria-live="polite"
                aria-atomic="true"
                className="care-sr-only"
              >
                {t("care.currentStatus")}: {t(`care.status.${selected.status}`)}
              </div>
              <StatusTimeline request={selected} />
              <div className="care-next-step">
                <CareIcon
                  name={selected.status === "delivered" ? "complete" : "help"}
                />
                <div>
                  <h3>{t("care.nextStep")}</h3>
                  <p>{t(`care.statusHint.${selected.status}`)}</p>
                </div>
              </div>
              <details className="care-details">
                <summary>{t("care.requestDetails")}</summary>
                <div className="grid gap-4">
                  <p>{t(`care.deliveryLabel.${selected.fulfillment}`)}</p>
                  {selected.address && <p>{selected.address}</p>}
                  <RequestFiles files={selected.files} />
                </div>
              </details>
              <p className="care-field-hint">{t("care.sessionUpdates")}</p>
            </section>
          ) : (
            <section className="care-card care-empty" role="status">
              <CareIcon name="search" />
              <h2>{t("care.noRequests")}</h2>
              <p className="care-muted">{t("care.noRequestsDescription")}</p>
              <CareButton
                variant="secondary"
                onClick={() => {
                  setQuery("");
                  setStatusFilter("all");
                  navigate("/prescription-tracking");
                }}
              >
                {t("care.resetSearch")}
              </CareButton>
              <CareLink to="/prescriptions/new">
                {t("care.newRequest")}
              </CareLink>
            </section>
          )}
        </div>
      </main>
    </IonContent>
  );
};

export default PrescriptionTracking;

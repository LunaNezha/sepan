import { useEffect, useRef, useState, type FormEvent } from "react";
import { IonContent } from "@ionic/react";
import { useTranslation } from "react-i18next";
import { CareButton, CareLink } from "@components/care/CareButton";
import { CareIcon } from "@components/care/CareIcon";
import { PageHeading } from "@components/care/PageHeading";
import { FileUpload } from "@components/care/FileUpload";
import { RequestFiles } from "@components/care/RequestFiles";
import { usePrescriptionRequests } from "@hooks/usePrescriptionRequests";
import type { RequestContact } from "@appTypes/prescriptionRequest";
import { useLocation } from "react-router-dom";

const emptyContact: RequestContact = {
  name: "",
  phone: "",
  address: "",
  note: "",
  fulfillment: "pickup",
};
const steps = ["stepUpload", "stepDetails", "stepReview"] as const;
type Errors = Partial<Record<"name" | "phone" | "address" | "consent", string>>;
const normalizePhone = (value: string) =>
  value.replace(/[۰-۹٠-٩]/g, (digit) =>
    String(digit.charCodeAt(0) - (digit.charCodeAt(0) >= 1776 ? 1776 : 1632)),
  );

const NewPrescription = () => {
  const { t } = useTranslation("translations");
  const { createRequest } = usePrescriptionRequests();
  const { pathname } = useLocation();
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const [contact, setContact] = useState<RequestContact>(emptyContact);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [createdId, setCreatedId] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const errorSummary = useRef<HTMLDivElement>(null);
  const submissionLock = useRef(false);

  useEffect(() => {
    if (pathname === "/prescriptions/new") heading.current?.focus();
  }, [step, createdId, pathname]);
  useEffect(() => {
    if (pathname !== "/prescriptions/new" && createdId) {
      submissionLock.current = false;
      setCreatedId("");
      setConsent(false);
      setErrors({});
      setStep(0);
    }
  }, [pathname, createdId]);
  const setField = (field: keyof RequestContact, value: string) => {
    setContact((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };
  const showErrors = (next: Errors) => {
    setErrors(next);
    requestAnimationFrame(() => errorSummary.current?.focus());
  };
  const handleContinue = (event: FormEvent) => {
    event.preventDefault();
    if (step === 0) {
      if (!files.length) {
        setFileError(t("care.fileRequired"));
        return;
      }
      setStep(1);
    } else if (step === 1) {
      const next: Errors = {};
      if (contact.name.trim().length < 2) next.name = t("care.nameRequired");
      const phone = normalizePhone(contact.phone);
      if (
        /[^\d\s()+.-]/.test(phone) ||
        !/^\d{9,15}$/.test(phone.replace(/\D/g, ""))
      )
        next.phone = t("care.phoneRequired");
      if (
        contact.fulfillment === "delivery" &&
        contact.address.trim().length < 10
      )
        next.address = t("care.addressRequired");
      if (Object.keys(next).length) {
        showErrors(next);
        return;
      }
      setErrors({});
      setStep(2);
    } else {
      if (!consent) {
        showErrors({ consent: t("care.consentRequired") });
        return;
      }
      if (submissionLock.current) return;
      submissionLock.current = true;
      const id = createRequest(
        {
          ...contact,
          name: contact.name.trim(),
          phone: normalizePhone(contact.phone),
          address:
            contact.fulfillment === "delivery" ? contact.address.trim() : "",
          note: contact.note.trim(),
        },
        files,
      );
      setCreatedId(id);
      setFiles([]);
      setContact(emptyContact);
    }
  };
  const reset = () => {
    submissionLock.current = false;
    setCreatedId("");
    setFiles([]);
    setContact(emptyContact);
    setConsent(false);
    setErrors({});
    setFileError("");
    setStep(0);
  };

  if (createdId)
    return (
      <IonContent className="care-content">
        <main
          className="care-page care-page--narrow"
          data-care-main
          tabIndex={-1}
        >
          <section
            className="care-card care-success"
            aria-labelledby="success-heading"
          >
            <span className="care-success-symbol">
              <CareIcon name="complete" />
            </span>
            <h1 id="success-heading" ref={heading} tabIndex={-1}>
              {t("care.successTitle")}
            </h1>
            <p className="care-description">{t("care.successBody")}</p>
            <div className="care-request-receipt">
              <span>{t("care.keepId")}</span>
              <strong dir="ltr" data-testid="created-request-id">
                {createdId}
              </strong>
            </div>
            <CareLink
              to={`/prescription-tracking?request=${createdId}`}
              icon="list"
            >
              {t("care.trackRequest")}
            </CareLink>
            <CareButton variant="quiet" onClick={reset}>
              {t("care.anotherRequest")}
            </CareButton>
          </section>
        </main>
      </IonContent>
    );

  return (
    <IonContent className="care-content">
      <main
        className="care-page care-page--narrow"
        data-care-main
        tabIndex={-1}
      >
        <PageHeading
          title={t("care.newTitle")}
          description={t("care.newDescription")}
        />
        <ol className="care-stepper" aria-label={t("care.threeSteps")}>
          {steps.map((label, index) => (
            <li
              key={label}
              aria-current={index === step ? "step" : undefined}
              className={index <= step ? "is-active" : ""}
            >
              <span className="care-step-number">
                {index < step ? <CareIcon name="check" /> : index + 1}
              </span>
              <span>{t(`care.${label}`)}</span>
            </li>
          ))}
        </ol>
        <form
          className="care-card care-form-card"
          noValidate
          onSubmit={handleContinue}
        >
          <div className="care-section-heading">
            <h2 ref={heading} tabIndex={-1}>
              {t(
                step === 0
                  ? "care.uploadHeading"
                  : step === 1
                    ? "care.detailsHeading"
                    : "care.reviewHeading",
              )}
            </h2>
            <p className="care-muted">
              {t(
                step === 0
                  ? "care.uploadBody"
                  : step === 1
                    ? "care.detailsBody"
                    : "care.reviewBody",
              )}
            </p>
          </div>
          {Object.values(errors).some(Boolean) && (
            <div
              ref={errorSummary}
              className="care-error-summary"
              tabIndex={-1}
              role="alert"
            >
              <strong>{t("care.fixErrors")}</strong>
              <ul>
                {Object.entries(errors)
                  .filter(([, message]) => message)
                  .map(([field, message]) => (
                    <li key={field}>
                      <a
                        href={`#contact-${field}`}
                        onClick={(event) => {
                          event.preventDefault();
                          document.getElementById(`contact-${field}`)?.focus();
                        }}
                      >
                        {message}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          )}
          {step === 0 && (
            <FileUpload
              files={files}
              error={fileError}
              onError={setFileError}
              onChange={(next) => {
                setFiles(next);
                setFileError("");
              }}
            />
          )}
          {step === 1 && (
            <div className="grid gap-6">
              <fieldset className="care-fulfillment">
                <legend className="care-sr-only">
                  {t("care.fulfillment")}
                </legend>
                {(["pickup", "delivery"] as const).map((method) => (
                  <label
                    key={method}
                    className={`care-choice ${contact.fulfillment === method ? "is-selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="fulfillment"
                      value={method}
                      checked={contact.fulfillment === method}
                      onChange={() => {
                        setField("fulfillment", method);
                        setErrors({});
                      }}
                    />
                    <CareIcon name={method === "pickup" ? "bag" : "car"} />
                    <span>
                      <strong>{t(`care.${method}`)}</strong>
                      <span className="care-muted">
                        {t(
                          method === "pickup"
                            ? "care.pickupHint"
                            : "care.deliveryHint",
                        )}
                      </span>
                    </span>
                  </label>
                ))}
              </fieldset>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="care-field">
                  <label htmlFor="contact-name">{t("care.contactName")}</label>
                  <input
                    id="contact-name"
                    name="contactName"
                    autoComplete="name"
                    maxLength={80}
                    value={contact.name}
                    onChange={(event) => setField("name", event.target.value)}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby="name-hint name-error"
                  />
                  <span id="name-hint" className="care-field-hint">
                    {t("care.contactNameHint")}
                  </span>
                  <span id="name-error" className="care-error">
                    {errors.name}
                  </span>
                </div>
                <div className="care-field">
                  <label htmlFor="contact-phone">{t("care.phone")}</label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    dir="ltr"
                    maxLength={24}
                    value={contact.phone}
                    onChange={(event) => setField("phone", event.target.value)}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby="phone-hint phone-error"
                  />
                  <span id="phone-hint" className="care-field-hint">
                    {t("care.phoneHint")}
                  </span>
                  <span id="phone-error" className="care-error">
                    {errors.phone}
                  </span>
                </div>
              </div>
              {contact.fulfillment === "delivery" && (
                <div className="care-field">
                  <label htmlFor="contact-address">{t("care.address")}</label>
                  <textarea
                    id="contact-address"
                    name="address"
                    autoComplete="street-address"
                    rows={3}
                    maxLength={400}
                    value={contact.address}
                    onChange={(event) =>
                      setField("address", event.target.value)
                    }
                    aria-invalid={Boolean(errors.address)}
                    aria-describedby="address-hint address-error"
                  />
                  <span id="address-hint" className="care-field-hint">
                    {t("care.addressHint")}
                  </span>
                  <span id="address-error" className="care-error">
                    {errors.address}
                  </span>
                </div>
              )}
              <div className="care-field">
                <label htmlFor="contact-note">{t("care.optionalNote")}</label>
                <textarea
                  id="contact-note"
                  name="note"
                  rows={3}
                  maxLength={500}
                  value={contact.note}
                  onChange={(event) => setField("note", event.target.value)}
                  aria-describedby="note-hint"
                />
                <span id="note-hint" className="care-field-hint">
                  {t("care.noteHint")}
                </span>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="grid gap-6">
              <section>
                <div className="care-inline-heading">
                  <h3>{t("care.prescriptionFiles")}</h3>
                  <CareButton variant="quiet" onClick={() => setStep(0)}>
                    {t("care.edit")}
                  </CareButton>
                </div>
                <RequestFiles files={files} />
              </section>
              <section>
                <div className="care-inline-heading">
                  <h3>{t("care.contactDetails")}</h3>
                  <CareButton variant="quiet" onClick={() => setStep(1)}>
                    {t("care.edit")}
                  </CareButton>
                </div>
                <dl className="care-definition-list">
                  <div>
                    <dt>{t("care.contactName")}</dt>
                    <dd>{contact.name}</dd>
                  </div>
                  <div>
                    <dt>{t("care.phone")}</dt>
                    <dd dir="ltr">{contact.phone}</dd>
                  </div>
                  <div>
                    <dt>{t("care.fulfillment")}</dt>
                    <dd>{t(`care.deliveryLabel.${contact.fulfillment}`)}</dd>
                  </div>
                  {contact.fulfillment === "delivery" && (
                    <div>
                      <dt>{t("care.address")}</dt>
                      <dd>{contact.address}</dd>
                    </div>
                  )}
                  {contact.note && (
                    <div>
                      <dt>{t("care.optionalNote")}</dt>
                      <dd>{contact.note}</dd>
                    </div>
                  )}
                </dl>
              </section>
              <p className="care-info-note">
                <CareIcon name="shield" />
                {t("care.costConfirmation")}
              </p>
              <div>
                <label className="care-consent">
                  <input
                    id="contact-consent"
                    type="checkbox"
                    checked={consent}
                    onChange={(event) => {
                      setConsent(event.target.checked);
                      setErrors({});
                    }}
                    aria-invalid={Boolean(errors.consent)}
                    aria-describedby="consent-error"
                  />
                  <span>{t("care.consent")}</span>
                </label>
                <p className="care-error" id="consent-error">
                  {errors.consent}
                </p>
              </div>
            </div>
          )}
          <div className="care-form-actions">
            <CareButton
              variant="secondary"
              icon="back"
              onClick={() => {
                setErrors({});
                setStep((current) => Math.max(0, current - 1));
              }}
              disabled={step === 0}
            >
              {t("care.back")}
            </CareButton>
            <CareButton
              type="submit"
              data-testid="request-continue"
              icon={step === 2 ? "check" : "arrow"}
            >
              {t(step === 2 ? "care.submit" : "care.next")}
            </CareButton>
          </div>
        </form>
        <CareLink to="/" variant="quiet">
          {t("care.cancel")}
        </CareLink>
      </main>
    </IonContent>
  );
};

export default NewPrescription;

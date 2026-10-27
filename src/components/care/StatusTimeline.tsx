import { useTranslation } from "react-i18next";
import {
  requestStatuses,
  type PrescriptionRequest,
  type RequestStatus,
} from "@appTypes/prescriptionRequest";
import { CareIcon } from "./CareIcon";

export const StatusTimeline = ({
  request,
}: {
  request: PrescriptionRequest;
}) => {
  const { t } = useTranslation("translations");
  const stages: readonly RequestStatus[] =
    request.fulfillment === "pickup"
      ? requestStatuses.filter((stage) => stage !== "delivering")
      : requestStatuses;
  const current = stages.indexOf(request.status);
  return (
    <ol className="care-timeline" aria-label={t("care.progress")}>
      {stages.map((stage, index) => (
        <li
          key={stage}
          className={index <= current ? "is-complete" : ""}
          aria-current={index === current ? "step" : undefined}
        >
          <span className="care-timeline-dot">
            {index < current ? (
              <CareIcon name="check" />
            ) : (
              <span>{index + 1}</span>
            )}
          </span>
          <div>
            <p>{t(`care.status.${stage}`)}</p>
            {index === current && (
              <span className="care-muted">
                {t(`care.statusHint.${stage}`)}
              </span>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
};

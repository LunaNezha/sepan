import { useTranslation } from "react-i18next";
import type { RequestStatus } from "@appTypes/prescriptionRequest";
import { CareIcon } from "./CareIcon";

export const StatusBadge = ({ status }: { status: RequestStatus }) => {
  const { t } = useTranslation("translations");
  return (
    <span className={`care-status care-status--${status}`}>
      <CareIcon
        name={
          status === "delivered"
            ? "complete"
            : status === "delivering"
              ? "car"
              : status === "ready"
                ? "bag"
                : "time"
        }
      />
      {t(`care.status.${status}`)}
    </span>
  );
};

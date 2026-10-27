import { useContext } from "react";
import { PrescriptionContext } from "@providers/PrescriptionProvider";

export const usePrescriptionRequests = () => {
  const context = useContext(PrescriptionContext);
  if (!context)
    throw new Error("usePrescriptionRequests requires PrescriptionProvider");
  return context;
};

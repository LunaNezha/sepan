import { createContext, useState, type PropsWithChildren } from "react";
import type {
  PrescriptionRequest,
  RequestContact,
  RequestStatus,
} from "@appTypes/prescriptionRequest";

type PrescriptionContextValue = {
  requests: PrescriptionRequest[];
  createRequest: (contact: RequestContact, files: File[]) => string;
  updateStatus: (id: string, status: RequestStatus) => void;
};

export const PrescriptionContext = createContext<
  PrescriptionContextValue | undefined
>(undefined);

const initialRequests = (): PrescriptionRequest[] => {
  const now = Date.now();
  return (
    [
      {
        id: "SP-1048",
        status: "preparing",
        patientVisible: true,
        sampleLetter: "A",
        fulfillment: "pickup" as const,
      },
      {
        id: "SP-1049",
        status: "reviewing",
        patientVisible: false,
        sampleLetter: "B",
        fulfillment: "delivery" as const,
      },
      {
        id: "SP-1050",
        status: "ready",
        patientVisible: false,
        sampleLetter: "C",
        fulfillment: "pickup" as const,
      },
    ] satisfies Array<
      Pick<
        PrescriptionRequest,
        "id" | "status" | "patientVisible" | "sampleLetter" | "fulfillment"
      >
    >
  ).map((item, index) => ({
    ...item,
    name: "",
    phone: "",
    address: "",
    note: "",
    files: [],
    createdAt: now - (3 - index) * 3_600_000,
    updatedAt: now - 900_000,
  }));
};

export const PrescriptionProvider = ({ children }: PropsWithChildren) => {
  // Sensitive files and contact details deliberately live only in this preview session.
  const [requests, setRequests] = useState(initialRequests);
  const createRequest = (contact: RequestContact, files: File[]) => {
    const id = `SP-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const now = Date.now();
    setRequests((current) => [
      ...current,
      {
        ...contact,
        id,
        files,
        status: "reviewing",
        patientVisible: true,
        createdAt: now,
        updatedAt: now,
      },
    ]);
    return id;
  };
  const updateStatus = (id: string, status: RequestStatus) => {
    setRequests((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status, updatedAt: Date.now() } : item,
      ),
    );
  };
  return (
    <PrescriptionContext.Provider
      value={{ requests, createRequest, updateStatus }}
    >
      {children}
    </PrescriptionContext.Provider>
  );
};

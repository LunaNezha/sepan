export const requestStatuses = [
  "reviewing",
  "preparing",
  "ready",
  "delivering",
  "delivered",
] as const;
export type RequestStatus = (typeof requestStatuses)[number];
type Fulfillment = "pickup" | "delivery";

export interface RequestContact {
  name: string;
  phone: string;
  address: string;
  note: string;
  fulfillment: Fulfillment;
}

export interface PrescriptionRequest extends RequestContact {
  id: string;
  files: File[];
  status: RequestStatus;
  createdAt: number;
  updatedAt: number;
  patientVisible: boolean;
  sampleLetter?: string;
}

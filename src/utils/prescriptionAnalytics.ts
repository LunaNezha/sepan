import {
  requestStatuses,
  type PrescriptionRequest,
  type RequestStatus,
} from "@appTypes/prescriptionRequest";

export type AnalyticsPeriod = 7 | 30;

// Local calendar days remain correct across daylight-saving changes.
const dayKey = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

export const getPrescriptionAnalytics = (
  requests: readonly PrescriptionRequest[],
  period: AnalyticsPeriod,
  now = Date.now(),
) => {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const daily = Array.from({ length: period }, (_, index) => {
    const date = new Date(today);
    date.setDate(date.getDate() - period + index + 1);
    return { timestamp: date.getTime(), count: 0 };
  });
  const days = new Map(
    daily.map((day) => [dayKey(new Date(day.timestamp)), day]),
  );
  const statuses = Object.fromEntries(
    requestStatuses.map((status) => [status, 0]),
  ) as Record<RequestStatus, number>;
  const fulfillment = { pickup: 0, delivery: 0 };
  let total = 0;
  for (const request of requests) {
    if (request.createdAt > now) continue;
    const day = days.get(dayKey(new Date(request.createdAt)));
    if (!day) continue;
    day.count += 1;
    total += 1;
    statuses[request.status] += 1;
    fulfillment[request.fulfillment] += 1;
  }
  return {
    daily,
    start: daily[0].timestamp,
    end: today.getTime(),
    total,
    statuses,
    fulfillment,
    inProgress: statuses.preparing + statuses.ready + statuses.delivering,
    completionRate: total ? statuses.delivered / total : 0,
  };
};

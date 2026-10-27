import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const RequestVolumeChart = ({
  daily,
  total,
}: {
  daily: { timestamp: number; count: number }[];
  total: number;
}) => {
  const { t, i18n } = useTranslation("translations");
  const numbers = new Intl.NumberFormat(i18n.language);
  const shortDate = new Intl.DateTimeFormat(i18n.language, {
    month: "short",
    day: "numeric",
  });
  const fullDate = new Intl.DateTimeFormat(i18n.language, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  return (
    <section
      className="care-card care-analytics-volume"
      aria-labelledby="volume-title"
    >
      <div className="care-inline-heading">
        <div>
          <h2 id="volume-title">{t("reports.volumeTitle")}</h2>
          <p className="care-muted">{t("reports.volumeDescription")}</p>
        </div>
        <span className="care-analytics-total">
          {t("reports.requestCount", {
            count: total,
            value: numbers.format(total),
          })}
        </span>
      </div>
      {total ? (
        <div className="care-analytics-chart" dir="ltr">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart
              data={daily}
              margin={{ top: 16, right: 8, bottom: 4, left: -20 }}
              accessibilityLayer
              aria-label={t("reports.volumeTitle")}
              barCategoryGap="35%"
            >
              <CartesianGrid
                vertical={false}
                stroke="var(--care-border)"
                strokeDasharray="3 4"
              />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(value: number) => shortDate.format(value)}
                tick={{ fill: "var(--care-muted)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                minTickGap={30}
                tickMargin={12}
                height={46}
              />
              <YAxis
                allowDecimals={false}
                tickFormatter={(value: number) => numbers.format(value)}
                tick={{ fill: "var(--care-muted)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                domain={[0, (max: number) => Math.max(1, max)]}
              />
              <Tooltip
                cursor={{ fill: "var(--care-soft)" }}
                labelFormatter={(value) => fullDate.format(Number(value))}
                formatter={(value) => [
                  numbers.format(Number(value)),
                  t("reports.received"),
                ]}
                contentStyle={{
                  background: "var(--care-surface)",
                  border: "1px solid var(--care-control-border)",
                  borderRadius: 12,
                  color: "var(--care-text)",
                  direction: i18n.dir(),
                }}
                labelStyle={{ color: "var(--care-text)" }}
                itemStyle={{ color: "var(--care-primary)" }}
                isAnimationActive={false}
              />
              <Bar
                dataKey="count"
                fill="var(--care-primary)"
                radius={[5, 5, 0, 0]}
                maxBarSize={40}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p
          className="care-analytics-chart care-analytics-chart--empty"
          role="status"
        >
          {t("reports.emptyPeriod")}
        </p>
      )}
      <details className="care-details care-analytics-data">
        <summary>{t("reports.viewData")}</summary>
        <table>
          <caption className="care-sr-only">{t("reports.volumeTitle")}</caption>
          <thead>
            <tr>
              <th scope="col">{t("reports.date")}</th>
              <th scope="col">{t("reports.received")}</th>
            </tr>
          </thead>
          <tbody>
            {daily.map((day) => (
              <tr key={day.timestamp}>
                <th scope="row">{fullDate.format(day.timestamp)}</th>
                <td>{numbers.format(day.count)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </section>
  );
};

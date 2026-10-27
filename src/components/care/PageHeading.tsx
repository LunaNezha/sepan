import type { ReactNode } from "react";

export const PageHeading = ({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
}) => (
  <div className="care-page-heading flex flex-wrap items-end justify-between gap-4">
    <div className="max-w-3xl">
      {eyebrow && <p className="care-eyebrow">{eyebrow}</p>}
      <h1 tabIndex={-1}>{title}</h1>
      <p className="care-description">{description}</p>
    </div>
    {action}
  </div>
);

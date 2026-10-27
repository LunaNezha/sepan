import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { CareIcon, type CareIconName } from "./CareIcon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "quiet";
  icon?: CareIconName;
};
export const CareButton = ({
  variant = "primary",
  icon,
  children,
  className = "",
  type = "button",
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={`care-button care-button--${variant} ${className}`}
    {...props}
  >
    {icon && <CareIcon name={icon} />}
    {children}
  </button>
);

export const CareLink = ({
  to,
  children,
  variant = "primary",
  icon,
  className = "",
}: PropsWithChildren<{
  to: string;
  variant?: "primary" | "secondary" | "quiet";
  icon?: CareIconName;
  className?: string;
}>) => (
  <Link to={to} className={`care-button care-button--${variant} ${className}`}>
    {icon && <CareIcon name={icon} />}
    {children}
  </Link>
);

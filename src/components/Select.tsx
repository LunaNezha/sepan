import Tooltip from "@components/Tooltip";
import { Positions } from "@appTypes/positions";
import { IonSelect } from "@ionic/react";
import { cn } from "@utils/classnames";
import React from "react";
import { useTranslation } from "react-i18next";

type SelectProps = Omit<React.ComponentProps<typeof IonSelect>, "children"> & {
  className?: string;
  errors?: string;
  icon?: string;
  multiple?: boolean;
  platform: "web" | "mobile";
  alertTitle?: string;
  children: React.ReactNode;
};

const Select = (
  {
    className,
    errors,
    children,
    icon,
    multiple = false,
    platform,
    alertTitle,
    ...props
  }: SelectProps,
  ref: React.Ref<HTMLIonSelectElement>,
) => {
  const { t } = useTranslation("translations");

  return (
    <div
      className={cn(
        className,
        "shadows group bg-white-50 dark:bg-big-stone-950 relative flex items-center gap-4 rounded-full border-2 border-transparent px-6 py-1",
        errors && "border-rose-300",
      )}
    >
      <IonSelect
        className="partText:font-iranyekan-regular partText:text-sm partText:text-white-950 partContainer:w-full partIcon:text-white-950 partPlaceholder:font-iranyekan-regular partPlaceholder:text-sm partPlaceholder:text-white-950 dark:partText:text-white-200 dark:partIcon:text-white-200 dark:partPlaceholder:text-white-200 flex-1"
        ref={ref}
        multiple={multiple}
        interface={platform === "web" ? "popover" : "alert"}
        okText={t("buttons.submit")}
        cancelText={t("buttons.close")}
        interfaceOptions={
          platform === "mobile" ? { header: alertTitle } : undefined
        }
        {...props}
      >
        {children}
      </IonSelect>

      {/* error message */}
      {errors && (
        <Tooltip position={Positions.Top} message={errors}>
          <i className="fi fi-rr-exclamation text-rose-400 duration-300 ease-out"></i>
        </Tooltip>
      )}

      {/* input releavent icon */}
      {icon ? (
        <i
          className={cn(
            icon,
            "text-white-950 dark:text-white-200 duration-300 ease-out group-hover:text-blue-600",
          )}
        ></i>
      ) : null}
    </div>
  );
};

const ForwardSelect = React.forwardRef(Select);
ForwardSelect.displayName = "Select";

export default ForwardSelect;

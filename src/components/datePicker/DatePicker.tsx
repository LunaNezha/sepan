import React from "react";
import DefaultDatePicker, {
  DefaultDatePickerProps,
} from "@components/datePicker/DefaultDatePicker";
import JalaliDatePicker, {
  JalaliDatePickerProps,
} from "@components/datePicker/JalaliDatePicker";

const views = {
  default: DefaultDatePicker,
  jalali: JalaliDatePicker,
};

type Props = JalaliDatePickerProps &
  DefaultDatePickerProps & {
    locale: {
      types: "default" | "jalali";
    };
  };

const LocalizeDatePicker: React.FC<Props> = (props) => {
  const CurrentDatePicker = views[props.locale.types];

  return <CurrentDatePicker {...props} />;
};

export default LocalizeDatePicker;

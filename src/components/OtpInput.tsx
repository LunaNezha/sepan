import { useRef } from "react";
import Input from "@components/Input";

type Props = {
  numberOfdigits: number;
  errors?: string;
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
};

const OtpInput = ({
  numberOfdigits,
  errors,
  value = "",
  onChange,
  onBlur,
  name,
}: Props) => {
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from(
    { length: numberOfdigits },
    (_, i) => value[i] ?? "",
  );

  const updateDigit = (index: number, text: string) => {
    const next = [...digits];
    next[index] = text.replace(/\D/g, "").slice(-1);
    onChange?.(next.join(""));
    if (next[index]) inputs.current[index + 1]?.focus();
  };

  return digits.map((digit, index) => (
    <Input
      key={index}
      ref={(element) => {
        inputs.current[index] = element;
      }}
      type="text"
      inputMode="numeric"
      autoComplete={index === 0 ? "one-time-code" : "off"}
      name={name ? `${name}-${index}` : undefined}
      aria-label={`Digit ${index + 1}`}
      maxLength={1}
      BorderRadius="lg"
      placeholder="-"
      Padding="otp"
      TextSizes="lg"
      TextAligns="center"
      value={digit}
      errors={errors}
      onBlur={onBlur}
      onChange={(event) => updateDigit(index, event.target.value)}
      onKeyDown={(event) => {
        if (event.key === "Backspace" && !digit)
          inputs.current[index - 1]?.focus();
      }}
      onPaste={(event) => {
        event.preventDefault();
        const code = event.clipboardData
          .getData("text")
          .replace(/\D/g, "")
          .slice(0, numberOfdigits);
        onChange?.(code);
        inputs.current[Math.min(code.length, numberOfdigits - 1)]?.focus();
      }}
    />
  ));
};

export default OtpInput;

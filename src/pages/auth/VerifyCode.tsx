import { Button } from "@components/Button";
import OtpInput from "@components/OtpInput";
import { useVerifyCodeValidation } from "@hooks/useFormValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { IonSpinner, IonText } from "@ionic/react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const VerifyCode = () => {
  type FormValues = z.infer<typeof FormSchema>;
  const { t } = useTranslation("translations");
  const FormSchema = z.object({ verifyCode: useVerifyCodeValidation() });
  const { control, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { verifyCode: "" },
  });
  const { errors, isSubmitting, isLoading } = formState;

  return (
    <form
      noValidate
      onSubmit={handleSubmit(() => undefined)}
      className="flex flex-col items-center gap-8"
    >
      <div className="flex flex-col gap-2">
        {/* OTP inputs */}
        <div
          className="flex items-center gap-2 sm:gap-3"
          style={{ direction: "ltr" }}
        >
          <Controller
            name="verifyCode"
            control={control}
            render={({ field }) => (
              <OtpInput
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                numberOfdigits={6}
                errors={errors.verifyCode?.message}
              />
            )}
          />
        </div>

        {/* verification code manage */}
        <div className="font-iranyekan-regular text-white-950 dark:text-white-200 flex flex-wrap items-center justify-between gap-2 sm:gap-4">
          {/* time remaining */}
          <small className="text-xs opacity-80 dark:opacity-60">
            {`${t("globals.time_remaining")} 84 ${t("globals.seconds")}`}
          </small>

          {/* handle sending verification code again */}
          <div className="flex items-center gap-2">
            <small className="text-xs opacity-80 dark:opacity-60">
              {t("error_res.not_send_verifycode")}
            </small>

            <a className="font-iranyekan-bold cursor-pointer text-xs text-emerald-400 transition-all hover:text-emerald-500 dark:hover:text-emerald-600">
              {t("buttons.send_again")}
            </a>
          </div>
        </div>
      </div>

      {/* buttons */}
      <div className="flex w-full flex-wrap items-center justify-between gap-4">
        <Button
          type="submit"
          variant={"text-default"}
          size={"md"}
          round={"full"}
        >
          <IonText>{t("buttons.change_phone_number")}</IonText>
        </Button>

        <Button
          type="submit"
          variant={"filled-green"}
          size={"md"}
          round={"full"}
        >
          <IonText>{t("buttons.activation")}</IonText>
          {isSubmitting && isLoading ? (
            <IonSpinner name="dots"></IonSpinner>
          ) : (
            <i className="fi fi-sr-shield-check"></i>
          )}
        </Button>
      </div>
    </form>
  );
};

export default VerifyCode;

import { Button } from "@components/Button";
import Input from "@components/Input";
import { IonSpinner, IonText } from "@ionic/react";
import { useEffect } from "react";
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { PathNames } from "@constants/pathnames";
import { useUsernameValidation } from "@hooks/useFormValidation";

const Username = () => {
  type FormValues = z.infer<typeof FormSchema>;
  const { t, i18n } = useTranslation("translations");
  const navigate = useNavigate();
  const FormSchema = z.object({ username: useUsernameValidation() });
  const { register, handleSubmit, formState, reset } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
  });
  const { errors, isSubmitting, isLoading, isSubmitSuccessful } = formState;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmit: SubmitHandler<FormValues> = (res) => {
    reset();
    navigate(`${PathNames.Auth.LoginSecondStep}?username=${res.username}`);
  };

  const onError = (error: FieldErrors<FormValues>) => {
    enqueueSnackbar(error.username?.message, { variant: "error" });
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit, onError)}
      className="flex flex-col gap-4"
    >
      <Input
        {...register("username")}
        type="text"
        icon="fi fi-rr-user"
        name="username"
        BorderRadius={"full"}
        placeholder={t("inputs.national_code")}
        errors={errors.username?.message}
      />

      <Button type="submit" variant={"filled-green"} size={"md"} round={"full"}>
        <IonText>{t("buttons.continue")}</IonText>
        {isSubmitting && isLoading ? (
          <IonSpinner name="dots"></IonSpinner>
        ) : (
          <i
            className={
              i18n.language === "fa"
                ? "fi fi-rr-arrow-small-left"
                : "fi fi-rr-arrow-small-right"
            }
          ></i>
        )}
      </Button>
    </form>
  );
};

export default Username;

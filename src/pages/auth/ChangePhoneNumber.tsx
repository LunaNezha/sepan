import {
  useNewPasswordValidation,
  usePasswordValidation,
  useUsernameValidation,
} from "@hooks/useFormValidation";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Input from "@components/Input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@components/Button";
import { IonSpinner, IonText } from "@ionic/react";
import { useNavigate } from "react-router";
import { PathNames } from "@constants/pathnames";

const ChangePhoneNumber = () => {
  type FormValues = z.infer<typeof FormSchema>;

  const { t } = useTranslation("translations");
  const navigate = useNavigate();
  const FormSchema = z.object({
    username: useUsernameValidation(),
    password: usePasswordValidation(),
    new_password: useNewPasswordValidation(),
  });
  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
  });
  const { errors, isSubmitting, isLoading } = formState;

  return (
    <form
      noValidate
      onSubmit={handleSubmit(() => undefined)}
      className="flex flex-col gap-8"
    >
      <div className="flex flex-col gap-4">
        {/* username input */}
        <Input
          {...register("username")}
          type="text"
          icon="fi fi-rr-user"
          name="username"
          BorderRadius={"full"}
          placeholder={t("inputs.national_code")}
          errors={errors.username?.message}
        />

        {/* password input */}
        <Input
          {...register("password")}
          type="password"
          icon="fi fi-rr-key"
          name="password"
          BorderRadius={"full"}
          placeholder={t("inputs.password")}
          errors={errors.password?.message}
        />

        {/* new password input */}
        <Input
          {...register("new_password")}
          type="password"
          icon="fi fi-rr-key"
          name="new_password"
          BorderRadius={"full"}
          placeholder={t("inputs.new_password")}
          errors={errors.new_password?.message}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between">
        {/* back button */}
        <Button
          onClick={() => navigate(PathNames.Auth.LoginFirstStep)}
          variant={"text-default"}
          size={"md"}
          round={"full"}
        >
          <IonText>{t("buttons.back")}</IonText>
        </Button>

        {/* submit button */}
        <Button
          type="submit"
          variant={"filled-green"}
          size={"md"}
          round={"full"}
        >
          <IonText>{t("buttons.submit")}</IonText>
          {isSubmitting && isLoading ? (
            <IonSpinner name="dots"></IonSpinner>
          ) : (
            <i className="fi fi-sr-check-circle"></i>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ChangePhoneNumber;

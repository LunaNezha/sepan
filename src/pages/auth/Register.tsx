import Input from "@components/Input";
import { Controller, useForm } from "react-hook-form";
import {
  useBirthDateValidation,
  useConfirmPasswordValidation,
  useDiseaseTypeValidation,
  useFirstNameValidation,
  useGenderValidation,
  useLastNameValidation,
  usePasswordValidation,
  usePhoneNumberValidation,
  usePrivacyPolicyValidation,
  useUsernameValidation,
} from "@hooks/useFormValidation";
import { Trans, useTranslation } from "react-i18next";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import LocalizeDatePicker from "@components/datePicker/DatePicker";
import { FA } from "@constants/languages";
import { useMaskito } from "@maskito/react";
import options from "@utils/phoneMask";
import Select from "@components/Select";
import { isWebView } from "@utils/platform";
import {
  IonCheckbox,
  IonSelectOption,
  IonSpinner,
  IonText,
} from "@ionic/react";
import React from "react";
import { Button } from "@components/Button";
import { PathNames } from "@constants/pathnames";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import useDiseaseTypes from "@hooks/useDiseaseTypes";
import useGenders from "@hooks/useGenders";

const Register = () => {
  type FormValues = z.infer<typeof RegisterFormSchema>;

  const { t, i18n } = useTranslation("translations");
  const navigate = useNavigate();
  const genders = useGenders();
  const diseaseTypes = useDiseaseTypes();
  const phoneNumberRef = useMaskito({ options });
  const RegisterFormSchema = z.object({
    firstname: useFirstNameValidation(),
    lastname: useLastNameValidation(),
    birthDate: useBirthDateValidation(),
    username: useUsernameValidation(),
    password: usePasswordValidation(),
    confirmPassword: useConfirmPasswordValidation(),
    phoneNumber: usePhoneNumberValidation(),
    gender: useGenderValidation(),
    diseaseType: useDiseaseTypeValidation(),
    privacyPolicy: usePrivacyPolicyValidation(),
  });

  const { control, register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(RegisterFormSchema),
  });
  const { errors, isSubmitting, isLoading } = formState;

  return (
    <form
      noValidate
      onSubmit={handleSubmit(() => undefined)}
      className="flex flex-col gap-8"
    >
      {/* inputs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
        {/* first name */}
        <Input
          {...register("firstname")}
          type="text"
          icon="fi fi-rr-id-badge"
          name="firstname"
          BorderRadius={"full"}
          placeholder={t("inputs.firstname")}
          errors={errors.firstname?.message}
        />

        {/* last name */}
        <Input
          {...register("lastname")}
          type="text"
          icon="fi fi-rr-id-badge"
          name="lastname"
          BorderRadius={"full"}
          placeholder={t("inputs.lastname")}
          errors={errors.lastname?.message}
        />

        {/* birth date */}
        <Controller
          control={control}
          name="birthDate"
          render={() => (
            <LocalizeDatePicker
              inputAttributes={{ placeholder: t("inputs.birthdate") }}
              errors={errors.birthDate?.message}
              locale={
                i18n.language === FA
                  ? { types: "jalali" }
                  : { types: "default" }
              }
            />
          )}
        />

        {/* username */}
        <Input
          {...register("username")}
          type="text"
          icon="fi fi-rr-user"
          name="username"
          BorderRadius={"full"}
          placeholder={t("inputs.national_code")}
          errors={errors.username?.message}
        />

        {/* password */}
        <Input
          {...register("password")}
          type="password"
          icon="fi fi-rr-key"
          name="password"
          BorderRadius={"full"}
          placeholder={t("inputs.password")}
          errors={errors.password?.message}
        />

        {/* confirm password */}
        <Input
          {...register("confirmPassword")}
          type="password"
          icon="fi fi-rr-key"
          name="confirmPassword"
          BorderRadius={"full"}
          placeholder={t("inputs.confirm_password")}
          errors={errors.confirmPassword?.message}
        />

        {/* phone number */}
        <Input
          {...register("phoneNumber")}
          ref={phoneNumberRef}
          type="tel"
          dir="ltr"
          icon="fi fi-rr-phone-call"
          name="phoneNumber"
          BorderRadius={"full"}
          placeholder="+98 xxx xxx-xxxx"
          errors={errors.phoneNumber?.message}
        />

        {/* gender */}
        <Controller
          control={control}
          name="gender"
          render={() => (
            <Select
              platform={isWebView() ? "web" : "mobile"}
              placeholder={t("inputs.gender")}
              icon="fi fi-rr-venus-mars"
              alertTitle={t("alert_titles.gender")}
              errors={errors.gender?.message}
            >
              {genders.map((item, index) => (
                <React.Fragment key={index}>
                  <IonSelectOption value={item.value}>
                    {item.name}
                  </IonSelectOption>
                </React.Fragment>
              ))}
            </Select>
          )}
        />

        {/* disease type */}
        <Controller
          control={control}
          name="diseaseType"
          render={() => (
            <Select
              className="sm:col-span-2 sm:row-span-5 md:col-span-1 lg:col-span-2 lg:row-span-5"
              platform={isWebView() ? "web" : "mobile"}
              placeholder={t("inputs.disease_type")}
              icon="fi fi-rr-medicine"
              multiple={true}
              alertTitle={t("alert_titles.disease_type")}
              errors={errors.diseaseType?.message}
            >
              {diseaseTypes.map((item, index) => (
                <React.Fragment key={index}>
                  <IonSelectOption value={item.value}>
                    {item.name}
                  </IonSelectOption>
                </React.Fragment>
              ))}
            </Select>
          )}
        />
      </div>

      {/* terms and condition */}
      <div className="flex items-center gap-4">
        <IonCheckbox {...register("privacyPolicy")} name="privacyPolicy" />

        <div className="flex flex-col">
          {/* policy accept */}
          <IonText className="font-iranyekan-regular text-white-950 dark:text-white-200 text-sm leading-6">
            <Trans
              i18nKey="checkboxes.register_copyright"
              t={t}
              components={{
                TermsConditionLink: (
                  <Link
                    to="/terms-and-conditions"
                    className="font-iranyekan-bold text-blue-600"
                  >
                    {t("titles.terms_and_conditions")}
                  </Link>
                ),
                PrivacyLink: (
                  <Link
                    to="/privacy-policy"
                    className="font-iranyekan-bold text-blue-600"
                  >
                    {t("titles.privacy")}
                  </Link>
                ),
              }}
            ></Trans>
          </IonText>

          {/* show error */}
          {errors && (
            <span className="font-iranyekan-bold text-xs text-rose-400">
              {errors.privacyPolicy?.message}
            </span>
          )}
        </div>
      </div>

      {/* buttons */}
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

        {/* login button */}
        <Button
          type="submit"
          variant={"filled-green"}
          size={"md"}
          round={"full"}
        >
          <IonText>{t("buttons.register")}</IonText>
          {isSubmitting && isLoading ? (
            <IonSpinner name="dots"></IonSpinner>
          ) : (
            <i className="fi fi-rr-user-add"></i>
          )}
        </Button>
      </div>
    </form>
  );
};

export default Register;

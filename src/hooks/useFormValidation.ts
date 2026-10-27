import { z } from "zod";
import { useTranslation } from "react-i18next";
import { nationalCodeRegex } from "@utils/regexPatterns";

export const useUsernameValidation = () => {
  const { t } = useTranslation("translations");

  return z
    .string({ error: t("validations.requireds.national_code") })
    .min(1, t("validations.requireds.national_code"))
    .min(5, t("validations.minimum.national_code"))
    .max(30, t("validations.maximum.national_code"))
    .regex(nationalCodeRegex, {
      message: t("validations.national_code_format"),
    });
};

export const usePasswordValidation = () => {
  const { t } = useTranslation("translations");

  return z
    .string({ error: t("validations.requireds.password") })
    .min(1, t("validations.requireds.password"))
    .min(6, { message: t("validations.minimum.password") });
};

export const useVerifyCodeValidation = () => z.string().regex(/^\d{6}$/);

export const useFirstNameValidation = () => {
  const { t } = useTranslation("translations");

  return z
    .string({ error: t("validations.requireds.firstname") })
    .min(1, t("validations.requireds.firstname"));
};

export const useLastNameValidation = () => {
  const { t } = useTranslation("translations");

  return z
    .string({ error: t("validations.requireds.lastname") })
    .min(1, t("validations.requireds.lastname"));
};

export const useBirthDateValidation = () => {
  const { t } = useTranslation("translations");

  return z.date({ error: t("validations.requireds.birthdate") });
};

export const useConfirmPasswordValidation = () => {
  const { t } = useTranslation("translations");

  return z
    .string({ error: t("validations.requireds.confirm_password") })
    .min(1, t("validations.requireds.confirm_password"));
};

export const useNewPasswordValidation = () => {
  const { t } = useTranslation("translations");

  return z
    .string({ error: t("validations.requireds.new_password") })
    .min(1, t("validations.requireds.new_password"));
};

export const usePhoneNumberValidation = () => {
  const { t } = useTranslation("translations");

  return z.string({ error: t("validations.requireds.phone_number") });
};

export const useGenderValidation = () => {
  const { t } = useTranslation("translations");

  return z.string({ error: t("validations.requireds.gender") });
};

export const useDiseaseTypeValidation = () => {
  const { t } = useTranslation("translations");

  return z.string({ error: t("validations.requireds.disease_type") });
};

export const usePrivacyPolicyValidation = () => {
  const { t } = useTranslation("translations");

  return z.literal(true, {
    error: t("validations.requireds.terms_and_conditions"),
  });
};

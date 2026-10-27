import { VariantProps, cva } from "class-variance-authority";

/**
 * * ======================
 * * Border Radius
 * * ======================
 */
export type BorderRadiusProps = VariantProps<typeof BorderRadiusVariants>;
export const BorderRadiusVariants = cva([], {
  variants: {
    BorderRadius: {
      sm: ["rounded-xs"],
      md: ["rounded-md"],
      lg: ["rounded-lg"],
      xl: ["rounded-xl"],
      full: ["rounded-full"],
    },
  },
  defaultVariants: {
    BorderRadius: "lg",
  },
});

/**
 * * ======================
 * * Text Sizes
 * * ======================
 */
export type TextSizesProps = VariantProps<typeof TextSizesVariants>;
export const TextSizesVariants = cva([], {
  variants: {
    TextSizes: {
      base: ["text-base"],
      xs: ["text-xs"],
      sm: ["text-xs sm:text-sm"],
      md: ["text-md"],
      lg: ["text-lg"],
      xl: ["text-xl"],
      "2xl": ["text-2xl"],
      "3xl": ["text-3xl"],
    },
  },
  defaultVariants: {
    TextSizes: "sm",
  },
});

/**
 * * ======================
 * * Padding
 * * ======================
 */
export type PaddingProps = VariantProps<typeof PaddingVariants>;
export const PaddingVariants = cva([], {
  variants: {
    Padding: {
      otp: ["px-3", "py-2"],
      sm: ["px-4", "py-2"],
      md: ["px-6", "py-4"],
    },
  },
  defaultVariants: {
    Padding: "md",
  },
});

/**
 * * ======================
 * * Text Aligns
 * * ======================
 */
export type TextAlignsProps = VariantProps<typeof TextAlignsVariants>;
export const TextAlignsVariants = cva([], {
  variants: {
    TextAligns: {
      center: "text-center",
      left: "text-left",
      right: "text-right",
      auto: "ltr:text-left rtl:text-right",
    },
  },
  defaultVariants: {
    TextAligns: "auto",
  },
});

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@utils/classnames";

const buttonVariants = cva(
  ["flex", "btn", "shadows", "items-center", "justify-center", "gap-2"],
  {
    variants: {
      variant: {
        "filled-default": [
          "bg-white-50",
          "dark:bg-big-stone-950",
          " text-white-950",
          " dark:text-white-200",
          " hover:text-blue-600",
          " dark:hover:text-blue-600",
        ],
        "filled-green": [
          "bg-emerald-400",
          "text-white-50",
          "hover:bg-emerald-500",
          "dark:hover:bg-emerald-600",
        ],
        "filled-blue": [
          "bg-blue-600",
          " text-white-50",
          " hover:bg-blue-600",
          " dark:hover:bg-blue-600",
        ],
        "outlined-default": [
          "bg-transparent",
          "border-[1px]",
          "text-white-950",
          "dark:text-white-200",
          "border-white-950",
          "dark:border-white-200",
          "hover:bg-white-950/10",
          "dark:hover:bg-white-200/10",
        ],
        "outlined-green": [
          "bg-transparent",
          "border-[1px]",
          "border-emerald-400",
          "text-emerald-400",
          "hover:bg-emerald-400/10",
        ],
        "outlined-blue": [
          "bg-transparent",
          "border-[1px]",
          "border-blue-600",
          "text-blue-600",
          "hover:bg-blue-600/10",
        ],
        "outlined-red": [
          "bg-transparent",
          "border-[1px]",
          "border-rose-400",
          "text-rose-400",
          "hover:bg-rose-400/10",
        ],
        "text-default": [
          "shadow-none",
          "bg-transparent",
          "text-white-950",
          "dark:text-white-200",
          "hover:bg-white-50",
          "dark:hover:bg-big-stone-950",
        ],
        "text-green": [
          "shadow-none",
          "bg-transparent",
          "text-emerald-400",
          "hover:text-emerald-400",
          "dark:hover:text-emerald-400",
          "hover:bg-emerald-400/25",
          "dark:hover:bg-emerald-400/25",
        ],
        "text-blue": [
          "shadow-none",
          "bg-transparent",
          "text-blue-600",
          "hover:text-blue-600",
          "dark:hover:text-blue-600",
          "hover:bg-blue-600/25",
          "dark:hover:bg-blue-600/25",
        ],
        "text-red": [
          "shadow-none",
          "bg-transparent",
          "text-rose-400",
          "hover:text-rose-400",
          "dark:hover:text-rose-400",
          "hover:bg-rose-400/25",
          "dark:hover:bg-rose-400/25",
        ],
      },
      size: {
        sm: ["px-3", "py-2", "text-sm", "font-iranyekan-bold"],
        md: [
          "sm:px-5 px-3",
          "sm:py-3 py-2",
          "sm:text-base text-sm",
          "font-iranyekan-bold",
        ],
        lg: ["px-6", "py-4", "text-lg", " font-iranyekan-bold"],
      },
      round: {
        md: ["rounded-md"],
        lg: ["rounded-lg"],
        xl: ["rounded-xl"],
        full: ["rounded-full"],
      },
    },
    defaultVariants: {
      variant: "filled-default",
      size: "md",
      round: "md",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, round, size, variant, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ className, round, size, variant }))}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button };

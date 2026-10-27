import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import hooks from "eslint-plugin-react-hooks";

export default tseslint.config(
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "android/**",
      "ios/**",
      "src/types/resources.d.ts",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { react, "react-hooks": hooks },
    settings: { react: { version: "detect" } },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
    },
  },
  {
    files: ["**/*.{js,ts,tsx}"],
    languageOptions: {
      globals: {
        document: "readonly",
        window: "readonly",
        location: "readonly",
        console: "readonly",
        URLSearchParams: "readonly",
        HTMLElement: "readonly",
        HTMLInputElement: "readonly",
        HTMLIonPopoverElement: "readonly",
        HTMLIonSelectElement: "readonly",
        HTMLIonSelectOptionElement: "readonly",
        cy: "readonly",
        describe: "readonly",
        it: "readonly",
        beforeEach: "readonly",
      },
    },
  },
);

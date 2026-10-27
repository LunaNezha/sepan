import type { MaskitoOptions } from "@maskito/core";

const phoneMask: MaskitoOptions = {
  mask: [
    "+",
    "9",
    "8",
    " ",
    /\d/,
    /\d/,
    /\d/,
    " ",
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ],
};

export default phoneMask;

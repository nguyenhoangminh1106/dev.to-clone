import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Merriweather ", ...fontFamily.sans],
      },
      maxWidth: {
        "10xl": "95rem", // 160rem equals 2560px
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;

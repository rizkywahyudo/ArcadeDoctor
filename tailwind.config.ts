import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: { colors: { ink: "#0b1220", panel: "#111c2d", teal: "#42d6c5" } } },
  plugins: []
};
export default config;

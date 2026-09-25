import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0A0B10",
        panel: "#12141F",
        panel2: "#181B29",
        signal: "#00E6C3",
        amber: "#FFB020",
        ink: "#EDEFF4",
        slate: "#7C8494",
        line: "#242838",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      keyframes: {
        pulseRing: {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "70%": { transform: "scale(1.6)", opacity: "0" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        waveform: {
          "0%, 100%": { transform: "scaleY(0.3)" },
          "50%": { transform: "scaleY(1)" },
        },
      },
      animation: {
        pulseRing: "pulseRing 1.8s cubic-bezier(0.4,0,0.6,1) infinite",
        waveform: "waveform 0.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

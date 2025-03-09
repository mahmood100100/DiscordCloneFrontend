/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
      "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          background: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
          card: {
            DEFAULT: "hsl(var(--card))",
            foreground: "hsl(var(--card-foreground))",
          },
          popover: {
            DEFAULT: "hsl(var(--popover))",
            foreground: "hsl(var(--popover-foreground))",
          },
          primary: {
            DEFAULT: "hsl(var(--primary))",
            foreground: "hsl(var(--primary-foreground))",
          },
          secondary: {
            DEFAULT: "hsl(var(--secondary))",
            foreground: "hsl(var(--secondary-foreground))",
          },
          muted: {
            DEFAULT: "hsl(var(--muted))",
            foreground: "hsl(var(--muted-foreground))",
          },
          accent: {
            DEFAULT: "hsl(var(--accent))",
            foreground: "hsl(var(--accent-foreground))",
          },
          destructive: {
            DEFAULT: "hsl(var(--destructive))",
            foreground: "hsl(var(--destructive-foreground))",
          },
          border: "hsl(var(--border))",
          input: "hsl(var(--input))",
          ring: "hsl(var(--ring))",
          chart: {
            1: "hsl(var(--chart-1))",
            2: "hsl(var(--chart-2))",
            3: "hsl(var(--chart-3))",
            4: "hsl(var(--chart-4))",
            5: "hsl(var(--chart-5))",
          },
        },
        borderRadius: {
          lg: "var(--radius)",
          md: "calc(var(--radius) - 2px)",
          sm: "calc(var(--radius) - 4px)",
        },
        keyframes: {
          spinReverse: {
            from: { transform: "rotate(0deg)" },
            to: { transform: "rotate(-360deg)" },
          },
          pulseScale: {
            "0%, 100%": { transform: "scale(1)" },
            "50%": { transform: "scale(1.1)" },
          },
          bounce: {
            "0%, 100%": { transform: "translateY(0)" },
            "50%": { transform: "translateY(-10px)" },
          },
          pulse: {
            "0%, 100%": { opacity: "0.5" },
            "50%": { opacity: "1" },
          },
          fadeIn: {
            "0%": { opacity: "0", transform: "translateY(10px)" },
            "100%": { opacity: "1", transform: "translateY(0)" },
          },
          spin: {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
          },
        },
        animation: {
          spin: "spin 1s linear infinite",
          "spin-reverse": "spinReverse 1s linear infinite",
          "pulse-scale": "pulseScale 2s ease-in-out infinite",
          "bounce-slow": "bounce 2s ease-in-out infinite",
          "pulse-slow": "pulse 3s ease-in-out infinite",
          "fade-in": "fadeIn 1.5s ease-in-out forwards",
          "spin-slow": "spin 4s linear infinite",
        },
      },
    },
    plugins: [require("tailwindcss-animate")],
  };
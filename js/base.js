tailwind.config = {
  theme: {
    extend: {
      colors: {
        "aqua-blue": "#0891b2",
        "aqua-dark": "#0e7490",
        "aqua-light": "#67e8f9",
        "earth-brown": "#92400e",
        "earth-light": "#fbbf24",
        "danger-red": "#dc2626",
        "safe-green": "#059669",
        "vibrant-purple": "#7c3aed",
        "vibrant-pink": "#ec4899",
        "vibrant-orange": "#f97316",
        "vibrant-teal": "#14b8a6",
        "electric-blue": "#3b82f6",
        "lime-green": "#84cc16",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 3s infinite",
        gradient: "gradient 8s ease infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        gradient: {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
      },
    },
  },
};

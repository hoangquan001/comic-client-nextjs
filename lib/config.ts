export const config = {
  USE_API: true,
  ENABLE_CACHE: true,
  ENABLE_ADS: false,
  APP_NAME: "MeTruyenMoi",
  HOST: process.env.NEXT_PUBLIC_HOST || "metruyenmoi.org",
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "https://metruyenmoi.org",
  BASE_API_URL:
    // process.env.NEXT_PUBLIC_API_URL || "http://51.79.248.148:5080",
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5080",
  CHATBOT_HOST:
    process.env.NEXT_PUBLIC_CHATBOT_HOST || "https://metruyenmoi.org/v1/chatbot",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
} as const;

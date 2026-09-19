const config = {
  distDir: process.env.NEXT_BUILD_DIR || ".next",
  devIndicators: false,
  webpack(config, { dev }) {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};
export default config;

const config = {
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
  },
  // The demos fetch these from the CDN, and no server code reads them.
  outputFileTracingExcludes: {
    '*': ['public/data/**', 'public/models/**'],
  },
  async redirects() {
    return [{ source: '/index', destination: '/', permanent: true }];
  },
};

export default config;

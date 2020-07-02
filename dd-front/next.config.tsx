const CONFIG = {
  serverRuntimeConfig: {
    SERVER_BASE_URL: process.env.SERVER_BASE_URL
  },
  publicRuntimeConfig: {
    CLIENT_BASE_URL: process.env.CLIENT_BASE_URL
  },
  webpackDevMiddleware: (config: any) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 200
    };
    return config;
  }
};

export default CONFIG;

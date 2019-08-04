module.exports = {
  serverRuntimeConfig: {
    SERVER_BASE_URL: process.env.SERVER_BASE_URL
  },
  publicRuntimeConfig: {
    CLIENT_BASE_URL: process.env.CLIENT_BASE_URL
  },
  webpackDevMiddleware: config => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 200
    };
    return config;
  }
};

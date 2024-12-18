export default {
  apps: [
    {
      name: "nexus_server",
      script: "./server.js",
      env: {
        NODE_ENV: "development",
        // ENV_VAR1: "environment_variable",
      },
    },
  ],
};

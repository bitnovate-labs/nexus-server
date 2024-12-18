export default {
  apps: [
    {
      name: "nexus-application",
      script: "./server.js",
      args: "start",
      env: {
        NODE_ENV: "development",
        ENV_VAR1: "environment_variable",
      },
    },
  ],
};

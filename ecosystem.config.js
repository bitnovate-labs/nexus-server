export default {
  apps: [
    {
      name: "nexus-application",
      script: "npm start",
      args: "start",
      env: {
        NODE_ENV: "development",
        ENV_VAR1: "environment_variable",
      },
    },
  ],
};

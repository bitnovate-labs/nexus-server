export default {
  apps: [
    {
      name: "nexus_server",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "development",
        ENV_VAR1: "environment_variable",
      },
    },
  ],
};

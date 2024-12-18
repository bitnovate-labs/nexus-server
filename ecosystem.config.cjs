module.exports = {
  apps: [
    {
      name: "nexus_server",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "development",
        ENV_VAR1: "environment_variable",
      },
    },
  ],
};

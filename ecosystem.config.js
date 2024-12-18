export default {
  apps: [
    {
      name: "nexus-application",
      script: "/root/.nvm/versions/node/v23.4.0/bin/npm",
      args: "run start",
      env: {
        NODE_ENV: "development",
        ENV_VAR1: "environment_variable",
      },
    },
  ],
};

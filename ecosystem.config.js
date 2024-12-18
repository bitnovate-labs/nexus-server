export default {
  apps: [
    {
      name: "nexus-application",
      script: "npm",
      args: "run dev",
      env: {
        NODE_ENV: "development",
        ENV_VAR1: "environment_variable",
      },
    },
  ],
};

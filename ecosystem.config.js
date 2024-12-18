export default {
  apps: [
    {
      name: "nexus_server",
      script: "npm",
      args: "run dev",
      env: {
        NODE_ENV: "development",
        ENV_VAR1: "environment_variable",
      },
    },
  ],
};

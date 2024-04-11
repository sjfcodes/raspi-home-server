const env = (() => {
  const { argv } = process;
  const envArgIndex = argv.indexOf("--env");
  if (envArgIndex === -1) return;
  return argv[envArgIndex + 1];
})();

const isDev = env !== "production";

// pm2 ecosystem config (https://pm2.keymetrics.io/docs/usage/application-declaration/)
module.exports = {
  apps: [
    {
      name: "client",
      cwd: "/home/sjfox/code/raspi-home-server/client",
      script: "npm run dev",
      shutdown_with_message: true,
      max_restarts: 10,
      env_production: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
      },
    },
    {
      name: "server",
      cwd: "/home/sjfox/code/raspi-home-server/server",
      script: isDev ? "sudo npm run dev" : "sudo npm run start",
      max_restarts: 10,
      shutdown_with_message: true,
      env_production: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
      },
    },
  ],
};

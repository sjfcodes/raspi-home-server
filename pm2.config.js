module.exports = {
  apps: [
    {
      name: "client",
      cwd: "/home/sjfox/code/raspi-home-server/client",
      script: "npm run dev",
      watch: true,
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
      script: "sudo npm run start",
      watch: true,
      ignore_watch: ['logs'],
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

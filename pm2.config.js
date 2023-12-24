module.exports = {
  apps: [
    {
      name: "client",
      cwd: "/home/sjfox/code/raspi-home-server/client",
      script: "npm run dev",
      watch: false,
      shutdown_with_message: true,
      max_restarts: 10,
      env_production: {
        NODE_ENV: "production"
      },
      env_development: {
        NODE_ENV: "development"
      },
    },
    {
      name: "server",
      cwd: "/home/sjfox/code/raspi-home-server/server",
      script: "sudo npm run start",
      watch: true,
      max_restarts: 10,
      shutdown_with_message: true,
      env_production: {
        NODE_ENV: "production"
      },
      env_development: {
        NODE_ENV: "development"
      }
    },
  ],

  // deploy: {
  //   production: {
  //     user: "SSH_USERNAME",
  //     host: "SSH_HOSTMACHINE",
  //     ref: "origin/master",
  //     repo: "GIT_REPOSITORY",
  //     path: "DESTINATION_PATH",
  //     "pre-deploy-local": "",
  //     "post-deploy":
  //       "npm install && pm2 reload ecosystem.config.js --env production",
  //     "pre-setup": "",
  //   },
  // },
};

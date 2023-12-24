# raspi-home-server

Home server that uses express backend & vite + react frontend

Both client & server run on raspberry pi, applications are managed by [pm2](https://pm2.keymetrics.io/)

```shell
# Start all applications
pm2 start pm2.config.js --env development

# Stop all
pm2 stop pm2.config.js --env development

# Restart all
pm2 restart pm2.config.js --env development

# Reload all
pm2 reload pm2.config.js --env development

# Delete all
pm2 delete pm2.config.js --env development
```

[To enable autostart node apps on reboot](https://pm2.keymetrics.io/docs/usage/startup/)
Needed to use sudo for the scripts to get to work
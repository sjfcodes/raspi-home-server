# raspi-home-server

Note: application uses npm package `raspi-gpio` which requires `arm` or `arm64` platform.

Links

- [pinout.xyz](https://pinout.xyz)
- [Node.js and Raspberry Pi](https://www.w3schools.com/nodejs/nodejs_raspberrypi.asp)

Commands:

```bash
$ sudo reboot
$ sudo shutdown -h now
# view pinout info
$ pinout

# download image from web
$ curl https://elinux.org/images/c/cb/Raspberry_Pi_Logo.svg > raspberry_pi.svg
```

With exception of power pins, pin 27, and pin 28, use any pin as regular GPIO pin.
NEVER SEND MORE THEN 3.3v INTO PINS!
GREEN GPIO pin states:

- HIGH: 3.3v
- LOW: 0v

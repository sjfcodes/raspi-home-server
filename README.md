# raspi-home-server

Links
- [pinout.xyz](https://pinout.xyz)
- [Node.js and Raspberry Pi](https://www.w3schools.com/nodejs/nodejs_raspberrypi.asp)


Commands:
```bash
$ sudo reboot
$ sudo shutdown -h now
# view pinout info
$ pinout 
```

With exception of power pins, pin 27, and pin 28, use any pin as regular GPIO pin.
NEVER SEND MORE THEN 3.3v INTO PINS!
GREEN GPIO pin states:
 - HIGH: 3.3v
 - LOW: 0v

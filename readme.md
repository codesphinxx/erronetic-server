# Erronetic-Server
Backend service for erronetic-js


### Requirements
We need [Node.js](https://nodejs.org) to install and run scripts.

## Install and run

Run next commands in your terminal:

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies and launch browser with examples.|
| `npm start` | Launch browser to show the examples. <br> Press `Ctrl + c` to kill **http-server** process. |

## GENERATING SECURITY TOKEN
1. create db app create record
2. use record id to encrypt app name
3. encrypt concatenated encrypted app name and record id 
4. now your all set...
# Mao-Online
An online version of the game Mao. Find latest working version in redesign.

UNIX Terminal Instructions:
Change the constant `address` in server/app/scripts/config.js to match the machine running the server.
With npm installed, run `npm install` in project directory.
To automatically bundle changes to server/app/scripts/bundle.js run 'npx babel server/app/jsx/ -d server/app/scripts -w & npx watchify server/app/scripts -o server/app/scripts/bundle.js &
`
To stop these tasks, run `jobs` to find the number associated with the command you want to stop and then run `kill %X` where X is that number.
To start running the server run `node server/server.js` in the project directory.
To find open tables (while the server is running), go to the address `http://<ip address>:<port>/lobbies` in your browser (port is 8080 if code isn't changed).
To join a table (while the server is running), go to the address` http://<ip address>:<port>?tableID=<ID>&name=<player name>` in your browser.

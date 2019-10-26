#!/bin/bash
cd /home/trevor/Projects/Mao\ Online/
npx watchify server/app/scripts/index.js -d -o server/app/scripts/bundle.js &
npx babel server/app/jsx -d server/app/scripts -w &
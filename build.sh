#!/bin/bash
cd /home/trevor/Projects/Mao\ Online/
npx babel server/app/components/ -d server/app/scripts -w & npx watchify $1 -o server/app/scripts/bundle.js &
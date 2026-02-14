#!/data/data/com.termux/files/usr/bin/bash

# Pickups app start script

# Enable polling to avoid ENOSPC errors
export CHOKIDAR_USEPOLLING=true
export CHOKIDAR_INTERVAL=1000

# Clear Metro Bundler cache
npx expo start -c --lan

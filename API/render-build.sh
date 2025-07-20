#!/bin/bash

echo "🔧 Running npm install..."
npm install

echo "🔍 Checking Puppeteer executablePath..."
node -e "const puppeteer = require('puppeteer'); const path = puppeteer.executablePath(); if (!path) { console.error('❌ No executable path found'); process.exit(1); } else { console.log('✅ Found Chromium:', path); }"

echo "✅ Build step completed successfully."

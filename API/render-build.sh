#!/bin/bash

echo "🔧 Running npm install..."
npm install

echo "🔍 Checking Puppeteer executablePath..."
node -e "const puppeteer = require('puppeteer'); console.log('✅ Puppeteer Chromium path:', puppeteer.executablePath());"

echo "✅ Build step completed successfully."

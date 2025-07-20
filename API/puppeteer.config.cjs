const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // 👇 This changes the default cache path to something inside your project
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
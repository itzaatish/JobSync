const puppeteer = require('puppeteer');
const fs = require('fs');
const { RawHtmlToFinal } = require('./pdf_design');
const dotenv = require('dotenv');
dotenv.config();

// This function generates a PDF from a raw HTML file.
// This function takes as input the file path of the final Designed HTML file , which is generated rawtoFinalHtml function .
// This function return a PDF buffer that can be sent as a response or saved to disk.

const pdfGeneratorFromHtml = async (designHtmlPath) => {
  let browser;
  try {
    const html = fs.readFileSync(designHtmlPath, 'utf8');
    if(!html) {
        throw new Error("The provided HTML file in the PDF generation section is empty or does not exist.");
    }
    fs.unlinkSync(designHtmlPath);

    // console.log(process.env.PUPPETEER_EXECUTABLE_PATH);
    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10px',
        right: '12px',
        bottom: '10px',
        left: '17px'
      }
    });

    await browser.close();
    return pdfBuffer;

  } catch (error) {
    if (browser) await browser.close();
    throw new Error(`PDF generation failed: ${error}`);
  }
};

module.exports = { pdfGeneratorFromHtml };
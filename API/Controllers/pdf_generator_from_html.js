const puppeteer = require('puppeteer');
const fs = require('fs');

// console.log(html);

const pdfGeneratorFromHtml = async (req, res) => {
    let browser;
    const html = fs.readFileSync('Resources/test.html', 'utf8'); // Adjust the path as needed

    try{
        browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '8px',
                right: '6px',
                bottom: '5px',
                left: '6px'
            }
        });

        await browser.close();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
        res.setHeader('Content-Length', pdfBuffer.length);
        res.send(pdfBuffer);
    }
    catch (error) {
        console.error("Error generating PDF:", error);
        if (browser) {
            await browser.close();
        }
        res.status(500).send("Error generating PDF");
    }
}


module.exports = { pdfGeneratorFromHtml };
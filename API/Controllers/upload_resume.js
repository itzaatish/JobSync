const fs = require('fs');
const pdfParser = require("pdf-parse");
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const {ResumeParsing} = require('./resume_generate'); 
const {rawHtmlToFinal} = require('./pdf_design'); 
const { pdfGeneratorFromHtml } = require('./pdf_generator_from_html');

const uploadResume = async (req, res) => {
  try {
    const file = req.file;
    const description = req.body.description?.trim(); 

    if (!file || !description) {
      return res.status(400).json({
        error: 'File or description not provided' 
      });
    }

    const filepath = file.path;
    const dataBuffer = fs.readFileSync(filepath);
    const pdfData = await pdfParser(dataBuffer);
    fs.unlinkSync(filepath); 

    // Unique filenames
    const resumeFileName = `tempResume_${uuidv4()}.txt`;
    const descriptionFileName = `tempDescription_${uuidv4()}.txt`;

    const resumeFilePath = path.join(__dirname, '../Resources', resumeFileName);
    const descriptionFilePath = path.join(__dirname, '../Resources', descriptionFileName);

    // Save parsed data to disk
    fs.writeFileSync(resumeFilePath, pdfData.text, 'utf8');
    fs.writeFileSync(descriptionFilePath, description, 'utf8');

    // console.log('✅ Resume and job description saved.');

    let resumePathAI ;
    try{
      // Call the ResumeParsing function to generate the HTML resume
      resumePathAI = await ResumeParsing(resumeFilePath, descriptionFilePath);
      // console.log('✅ Resume generated from OpenAI API:');
    }catch (error) {
      console.error('❌ Error generating resume from OpenAI API:', error);
      return res.status(500).json({
        error: `Error generating resume from OpenAI API. ${error}`
      });
    }

    let resumePathDesign ;
    try{
      //call the ResumeDesign function to Design the Final PDF
      resumePathDesign = rawHtmlToFinal(resumePathAI);
      // console.log('✅ Resume designed successfully.');
    }catch(err){
      console.error('❌ Error in designing the resume:', err);
      return res.status(500).json({
        error: `Error designing the resume. ${err}`
      });
    }
    let tempPdfBuffer;
    try{
      tempPdfBuffer = await pdfGeneratorFromHtml(resumePathDesign);
      // console.log('✅ PDF generated successfully from HTML.');
      // Save the PDF to disk

    }catch (err) {
      console.error('❌ Error in generating PDF:', err);
      return res.status(500).json({
        error: `Error generating PDF from HTML. : ${err}`
      });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
    res.status(200).send(tempPdfBuffer); // Send the PDF buffer as response
    return ;

  } catch (error) {
    console.error('❌ Upload error:', error);
    return res.status(500).json({
       error: `Server error while processing upload. ${error}`
    });
  }

};



module.exports = { uploadResume };

const fs = require('fs');
const pdfParser = require("pdf-parse");

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const filepath = req.file.path;
    const dataBuffer = fs.readFileSync(filepath);
    const data = await pdfParser(dataBuffer);

    // Delete file after parsing
    fs.unlinkSync(filepath); // Use unlink for async version if preferred
    console.log('File deleted successfully');
    
    res.status(200).json(data.text);
    console.log(data.text);

  } catch (error) {
    console.error(`Error in uploading: ${error}`);
    res.status(500).send("Server side error");
  }
};

const discHandler = (req , res)=>{
    const discription = req.body;
    res.status(200).json({"message" : "Discription recieved Succesfully"})
    
    return {
      jobDisc : discription 
    }

}

module.exports = { uploadResume , discHandler};

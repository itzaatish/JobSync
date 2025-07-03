const express = require("express");
const { signupHandler, loginHandler } = require("../Controllers/signup_login");
const { authHandler } = require("../middleware/auth");
const { uploadResume , discHandler} = require("../Controllers/upload_resume");
const { promptGeneration } = require("../Controllers/resume_generate");
const { pdfGeneratorFromHtml } = require("../Controllers/pdf_generator_from_html");
const multer = require("multer");

const upload = multer({ dest: 'Resources/' }); // uploads will be saved to /Resource/
const router = express.Router();

async function temp(req, res) {
    const data = req.body;
    console.log(data);
    res.send("Hello world, this route is currently working");
}

router.route("/")
  .get(temp)
  .post(temp);

router.post('/signup', signupHandler);
router.post('/login', loginHandler);
router.get('/dashboard', authHandler, temp);
router.post('/upload', upload.single('file'), uploadResume);
router.route('/jobD').post(discHandler);
router.route('/result').get(promptGeneration);
router.route('/pdf').get(pdfGeneratorFromHtml);

module.exports = router;

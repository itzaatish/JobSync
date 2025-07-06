const express = require("express");
const { signupHandler, loginHandler } = require("../Controllers/signup_login");
const { authHandler } = require("../middleware/auth");
const { uploadResume } = require("../Controllers/upload_resume");
const { createNewApplication } = require("../Controllers/create_new_application");
const { getApplications } = require("../Controllers/get_applications");
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
router.post('/upload', upload.single('resume'), authHandler , uploadResume);
// router.route('/result').get(promptGeneration);
router.route('/pdf').get(pdfGeneratorFromHtml);
router.post('/create_application',authHandler, createNewApplication);
router.get('/get_applications', authHandler, getApplications);

module.exports = router;

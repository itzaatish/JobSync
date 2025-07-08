const express = require("express");
const { signupHandler, loginHandler } = require("../Controllers/signup_login");
const { authHandler } = require("../middleware/auth");
const { uploadResume } = require("../Controllers/upload_resume");
const { createNewApplication } = require("../Controllers/create_new_application");
const { getApplications } = require("../Controllers/get_applications");
const { pdfGeneratorFromHtml } = require("../Controllers/pdf_generator_from_html");
const { deleteApplication, updateApplicationStatus } = require("../Controllers/update_application");
const { getSingleApplication } = require("../Controllers/get_single_application");
const multer = require("multer");

const upload = multer({ dest: 'Resources/' }); 
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
router.route('/pdf').get(pdfGeneratorFromHtml);
router.post('/create_application',authHandler, createNewApplication);
router.get('/get_applications', authHandler, getApplications);
router.route('/applications/:applicationId')
      .delete(authHandler , deleteApplication)
      .patch(authHandler , updateApplicationStatus)
      .get( authHandler , getSingleApplication );
router.patch('/applications/:applicationId/note', authHandler, updateApplicationStatus);


module.exports = router;

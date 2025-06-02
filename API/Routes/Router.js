import express from "express";
import {signupHandler , loginHandler} from "../Controllers/signup_login.js";
const router = express.Router();

async function temp(req, res) {
    const data = req.body;
    console.log(data);
    res.send("Hello world, this route is currently working");
}

// Temporary test route
router.route("/")
  .get(temp)
  .post(temp);

// Signup route (should only use POST for creating user)
router.post('/signup', signupHandler);

// Placeholder login handler
router.post('/login', loginHandler);

export default router;

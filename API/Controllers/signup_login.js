const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const db = new PrismaClient();

const passcodeEncrypt = async (password, rounds) => {
  try {
    const salt = await bcrypt.genSalt(rounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return { hashedPassword };
  } catch (error) {
    // console.error("Encryption error:", error);
    throw error;
  }
};

const generateToken = (userId) => {
  try {
    const date = new Date().getDate();
    return jwt.sign(
      { date, userId },
      process.env.JWT_SECRET_KEY, 
      { expiresIn: "2d" }
    );
  } catch (error) {
    // console.error("Token generation error", error);
    throw error;
  }
};

const signupHandler = async (req, res) => {
  console.log("Signup request received", req.body);
  try {
    const { nameUser, passwordUser, mailUser } = req.body;

    if (!nameUser || !passwordUser || !mailUser) {
      return res.status(400).json({
        error: "All fields are required",});
    }

    const emailFound = await db.users_info.findUnique({
      where: {
        mail_id: mailUser,
      },
    });

    if (emailFound) {
      return res.status(400).json({
        error: "Email already exists, please try another one",});
    }

    const { hashedPassword } = await passcodeEncrypt(passwordUser, 10);

    await db.users_info.create({
      data: {
        name: nameUser,
        password: hashedPassword,
        mail_id: mailUser,
      },
    });

    const user = await db.users_info.findUnique({
      where: {  mail_id: mailUser },
    });

    if (!user) {
      return res.status(400).json({
        error: "User creation failed, please try again later",});  
    }

    const token = generateToken(user.user_id);
    return res.status(201).json({
      message: "User created successfully",
      token,
      user :{
        user_id: user.user_id,
        name: user.name,
        mail_id: user.mail_id,
      }
    });
  } catch (error) {
    // console.error("Signup error:", error);
    return res.status(500).json({
      error: `Server side error - signup failed ${error}`,});
  }
};

const loginHandler = async (req, res) => {
  try {
    const { mailUser, passwordUser } = req.body;

    const user = await db.users_info.findUnique({
      where: {
        mail_id: mailUser,
      },
    });

    if (!user) {
      return res.status(401).json({error: "User not found, please signup first"});
    }

    const match = await bcrypt.compare(passwordUser, user.password);
    if (!match) {
      return res.status(401).json({error: "Invalid password, please try again"});
    }

    const token = generateToken(user.user_id);
    // console.log("Token generated", token);

    // Send token as JSON object (recommended)
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        mail_id: user.mail_id,
      }  
    });
  } catch (error) {
    // console.error("Login error", error);
    return res.status(500).json({
      error: `Server side error - login failed ${error}`,
    });
  }
}


module.exports = {
      signupHandler,
      loginHandler
}

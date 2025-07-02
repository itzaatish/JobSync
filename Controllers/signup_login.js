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
    console.error("Encryption error:", error);
    throw error;
  }
};

const generateToken = (userId) => {
  try {
    const date = new Date().getDate();
    return jwt.sign(
      { date, userId },
      process.env.JWT_SECRET_KEY, // adjust this to your env variable
      { expiresIn: "2d" }
    );
  } catch (error) {
    console.error("Token generation error", error);
    throw error;
  }
};

const signupHandler = async (req, res) => {
  console.log(req.body);
  try {
    const { nameUser, passwordUser, mailUser } = req.body;

    if (!nameUser || !passwordUser || !mailUser) {
      return res.status(400).send("All fields not filled");
    }

    const emailFound = await db.users_info.findUnique({
      where: {
        mail_id: mailUser,
      },
    });

    if (emailFound) {
      return res.status(400).send("Mail error: same mail already found");
    }

    const { hashedPassword } = await passcodeEncrypt(passwordUser, 10);

    await db.users_info.create({
      data: {
        name: nameUser,
        password: hashedPassword,
        mail_id: mailUser,
      },
    });

    return res.status(201).send("User created successfully");
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).send("Internal server error");
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
      return res.status(401).send("No user with this mail found");
    }

    const match = await bcrypt.compare(passwordUser, user.password);
    if (!match) {
      return res.status(401).send("Wrong password, try again");
    }

    const token = generateToken(user.user_id);
    console.log("Token generated", token);

    // Send token as JSON object (recommended)
    return res.status(200).json({ token });
  } catch (error) {
    console.error("Login error", error);
    return res.status(500).send("Server side error - login failed");
  }
};


module.exports = {
      signupHandler,
      loginHandler
}

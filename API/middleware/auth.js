const jwt = require('jsonwebtoken');

const authHandler = (req, res, next) => {
    const head = req.headers.authorization;
    // console.log("Auth header:", head);

    if (!head || !head.toLowerCase().startsWith("bearer ")) {
        return res.status(401).send("Authorization Failed");
    }

    try {
        const token = head.split(' ')[1];
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decodeToken;
        next();
    } catch (error) {
        console.log("Authentication failed: " + error);
        res.status(401).json({
            error: "Token not accepted, failed authorization"
        });
    }
};

module.exports = { authHandler };

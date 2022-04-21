const jwt = require("express-jwt");

const User = require("../models/User.model")

const isAuthenticated = jwt({
    secret: process.env.TOKEN_SECRET,
    algorithms: ["HS256"],
    requestProperty: "payload",
    getToken: getTokenFromHeaders,
});

function getTokenFromHeaders(req) {
    if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
        const token = req.headers.authorization.split(" ")[1];
        return token;
    }
}

/* const checkUser = (req, res, err) => {
    const token = req.cookie.jwt;

    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) =>{
            if (err) {
                console.log(err)
                next();
            } else {
                const user = User.findById(decodedToken.id);
                console.log(user);
            }
        })
    }
} */

module.exports = { isAuthenticated }
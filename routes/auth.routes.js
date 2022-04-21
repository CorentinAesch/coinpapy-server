const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
        const { email, firstName, lastName, password } = req.body;

        if (!email) {
            return res
                .status(400)
                .render("auth/signup", { errorMessage: {email: "Please provide your email."}, form:{ email, firstName,lastName, password }});
        }
    
        if (password.length < 8) {
            return res.status(400).json({password: "Your password needs to be at least 8 characters long."});
        }
    
        const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
        if (!regex.test(password)) {
            return res.status(400).json({ password: "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter." });
        }
          
        console.log({ email,firstName,lastName, password });

        const foundUser = await User.findOne({ email });
        if (foundUser) {
            res.status(400).json({ message: "user already exists" });
            return;
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const createdUser = await User.create({ email, firstName, lastName, password: hashedPassword });

        res.status(200).json({ email: createdUser.email, _id: createdUser._id });
    }

    catch (e) {
        res.status(500).json({ message: e.message })
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: "missing fields" })
        return;
    }

    const foundUser = await User.findOne({ email });
    if (!foundUser) {
        res.status(401).json({ message: "invalid login" });
        return;
    }

    const correctPassword = bcrypt.compareSync(password, foundUser.password);

    if (!correctPassword) {
        res.status(401).json({ message: "invalid login2" });
        return;
    }

    //delete foundUser.password;
    const authToken = jwt.sign(
        { _id: foundUser._id, email: foundUser.email, username: foundUser.username },
        process.env.TOKEN_SECRET,
        { algorithm: "HS256", expiresIn: "1h" }
    )

    res.status(200).json({ authToken });

});

module.exports = router;
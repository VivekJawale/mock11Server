const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express.Router();
const User = require("./user.model");
const SCECRET_KEY = "12345";

app.post("/register", async (req, res) => {
    const { name, email, password, Profilepicture, Phone, bio } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.send({
                status: 0,
                message: "User already Exists",
            });
        } else {
            let pass = await bcrypt.hash(password, 10);
            let user = await User.create({
                ...req.body,
                password: pass,
            });
            return res
                .status(201)
                .send({ user, message: "User created Successfully" });
        }
    } catch (error) {
        return res.status(404).send(error.message);
    }
});


app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            let pass = await bcrypt.compare(password, user.password);
            if (!pass) {
                return res.send("incorrect password");
            } else {
                let token = jwt.sign(
                    {
                        _id: user._id,
                        email: user.email,
                    },
                    SCECRET_KEY
                );
                return res.send({ token, user, message: "Login Successfully" });
            }
        } else {
            return res.send("Your not registered");
        }
    } catch (error) {
        return res.send(error.message);
    }
});

app.get("/getprofile", async (req, res) => {
    let token = req.headers.authorization.split(' ')[1];
    let dectoken = jwt.verify(token, SCECRET_KEY);
    let user = await User.findOne({ email: dectoken.email })
    if (user) {
        return res.status(200).send(user);
    } else {
        return res.status(404).send('User not found');
    }
})


module.exports = app;
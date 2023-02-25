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
    const _id = req.body._id;
    const user = await User.find({ _id: _id })
    if (user) {
        return res.status(200).send(user);
    } else {
        return res.status(404).send('User not found');
    }
})

app.patch("/edit", async (req, res) => {
    const _id = req.body._id;
    try {
        const user = await User.findByIdAndUpdate({ _id: _id }, req.body);
        if (user) {
            return res.status(200).send(`Updated user profile`);
        } else {
            return res.status(404).send(`User profile not found`);
        }
    } catch (error) {
        return res.status(404).send("Unable to edit profile data");
    }
})


module.exports = app;
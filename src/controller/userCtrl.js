const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const { jwtToken } = require("../config/jwtToken");
const { refreshToken } = require("../config/refreshToken");
const validateMongoId = require("../utils/valMongoId");

const createUserCtrl = async (req, res) => {
    const { email, name, password } = req.body;
    const saltRounds = 10;
    try {
        /* if (!email || !name || !password) {
            return res.status(400).json({ error: { emptyFields: 'All fields are required.' } });
        } */
        const findUser = await User.findOne({ email });

        if (!findUser) {
            const salt = await bcrypt.genSalt(saltRounds);
            const passwordHash = await bcrypt.hash(password, salt);
            console.log('Generated password hash:', passwordHash);
            const newUser = await User.create({
                name,
                email,
                password: passwordHash,
            });
            console.log('New user created:', newUser);
            return res.status(200).json(newUser);
        } else {
            return res.status(409).json({ error: { userErr: 'User already exists. Please login.' } });
        }
    } catch (error) {
        console.error('Error in user creation:', error);
        return res.status(500).json({ error: 'Server Error' });
    }
};

const loginUserCtrl = async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt:', req.body);
    try {
        const findUser = await User.findOne({ email });
        if (!findUser) {
            return res.status(404).json({ error: { wrngEmail: 'Incorrect email or not found.' } });
        }
        console.log('User found:', findUser);
        console.log('Hashed password from DB:', findUser.password);

        const isPasswordMatched = await bcrypt.compare(password, findUser.password);
        console.log('Plain password:', password);
        console.log('Password match result:', isPasswordMatched);
        
        if (!isPasswordMatched) {
            return res.status(400).json({ error: { wrngPass: 'Wrong Password' } });
        }

        const rfrshToken = refreshToken(findUser._id);
        await User.findByIdAndUpdate(findUser._id, { refreshToken: rfrshToken }, { new: true });
        
        /* res.cookie("refreshToken", rfrshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        }); */
        
        return res.json({
            _id: findUser._id,
            firstname: findUser.firstname,
            lastname: findUser.lastname,
            email: findUser.email,
            mobile: findUser.mobile,
            token: jwtToken(findUser._id),
        });
    } catch (error) {
        console.error('Error in user login:', error);
        return res.status(500).json({ error: 'Server Error' });
    }
};

const userLogoutCtrl = async (req, res) => {
    const { refreshToken } = req.cookies;

    try {
        if (!refreshToken) {
            return res.sendStatus(204);
        }

        const user = await User.findOne({ refreshToken });
        /* if (!user) {
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: true,
            });
            return res.sendStatus(204);
        } */

        user.refreshToken = "";
        await user.save();

        /* res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        }); */

        res.sendStatus(204);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};


module.exports = { createUserCtrl, loginUserCtrl, userLogoutCtrl };
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
    }
}, {
    timestamps: true,
});

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', userSchema);
const express = require("express");
const { createUserCtrl, loginUserCtrl, userLogoutCtrl, } = require("../controller/userCtrl");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/register", createUserCtrl);
router.post("/login", loginUserCtrl);
router.patch("/logout", authMiddleware, userLogoutCtrl);

module.exports = router;
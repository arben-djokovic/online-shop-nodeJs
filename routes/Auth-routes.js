const express = require("express")
const router = express.Router()
const { getLoginContr, getSingupContr, postLoginContr, logOutContr, postSingupContr } = require("../controllers/Auth-controller");
const { loginValidationRules, singupValidationRules } = require("../middleware/middlewares");


router.get("/singup", getSingupContr)
router.post("/singup",singupValidationRules, postSingupContr)
router.get("/login", getLoginContr)
router.post("/login",loginValidationRules, postLoginContr)
router.post('/logout', logOutContr)

module.exports = router
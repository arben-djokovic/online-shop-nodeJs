const express = require("express")
const router = express.Router()
const { getLoginContr, getSingupContr, postLoginContr, logOutContr, postSingupContr } = require("../controllers/Auth-controller");

router.get("/singup", getSingupContr)
router.post("/singup", postSingupContr)
router.get("/login", getLoginContr)
router.post("/login", postLoginContr)
router.post('/logout', logOutContr)

module.exports = router
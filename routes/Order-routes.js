const express = require("express")
const { postBuy, getOrders, getManageOrders, postUpdateOrder } = require("../controllers/Order-controller")
const { adminRoutes } = require("../middleware/middlewares")
const router = express.Router()

router.post("/buy", postBuy)
router.get("/orders", getOrders)
router.get("/manage-orders",adminRoutes, getManageOrders)
router.post("/update-order",adminRoutes, postUpdateOrder)
module.exports = router
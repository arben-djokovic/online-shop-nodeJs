const express = require("express")
const { postAddProductToCart, postUpdateQuantity, getCart } = require("../controllers/Cart-controller")
const router = express.Router()

router.post("/add-product-cart/:id", postAddProductToCart)
router.post("/update-quantity/:id", postUpdateQuantity)
router.get("/cart", getCart)

module.exports = router
const express = require("express")
const { getAllProductsContr, getProductContr } = require("../controllers/Product-controller")
const router = express.Router()

router.get("/products/:id", getProductContr)
router.get("/", getAllProductsContr)

module.exports = router
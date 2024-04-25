const express = require("express")
const { getAllProductsContr, getProductContr, getManageProducts, getEditProduct, postUpdateProduct, getAddProduct, postAddProduct, postDeleteProduct, getEditProductsContr } = require("../controllers/Product-controller")
const { adminRoutes, productValidationRules } = require("../middleware/middlewares")
const router = express.Router()

router.get("/", getAllProductsContr)
router.get("/products/:id", getProductContr)
router.get("/manage-products",adminRoutes, getManageProducts)
router.get("/edit-product/:id",adminRoutes, getEditProductsContr)
router.get("/add-product", adminRoutes , getAddProduct)
router.post("/update-product/:id",productValidationRules,adminRoutes, postUpdateProduct)
router.post("/add-product",productValidationRules, adminRoutes, postAddProduct)
router.post("/delete-product/:id", adminRoutes, postDeleteProduct)  
module.exports = router
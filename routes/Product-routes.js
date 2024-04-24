const express = require("express")
const { getAllProductsContr, getProductContr, getManageProducts, getEditProduct, postUpdateProduct, getAddProduct, postAddProduct, postDeleteProduct } = require("../controllers/Product-controller")
const { adminRoutes } = require("../middleware/middlewares")
const router = express.Router()

router.get("/", getAllProductsContr)
router.get("/products/:id", getProductContr)
router.get("/manage-products",adminRoutes, getManageProducts)
router.get("/edit-product/:id",adminRoutes, getEditProduct)
router.post("/update-product/:id",adminRoutes, postUpdateProduct)
router.get("/add-product", adminRoutes , getAddProduct)
router.post("/add-product", adminRoutes, postAddProduct)
router.post("/delete-product/:id", adminRoutes, postDeleteProduct)  
module.exports = router

var jwt = require('jsonwebtoken');
const path = require('path')
const secretKey = process.env.SECRET_KEY;
const Product = require("../models/Product");


async function getProductContr(req, res){
    const filePath = path.join(__dirname,'../', 'views', 'Product')
    const user = await jwt.decode(req.cookies.token, secretKey)
    const product = await Product.getById(req.params.id)
    res.render(filePath, {user: user, product: product})
}
async function getAllProductsContr(req, res){
    const filePath = path.join(__dirname,'../', 'views', 'Home')
    const user = await jwt.decode(req.cookies.token, secretKey)
    const result = await Product.getAllProducts()
    if(result.error){
        return res.redirect('/')
    }
    res.render(filePath, {user: user, products: result})
}
async function getEditProductsContr(req, res) {
    const filePath = path.join(__dirname, 'views', 'UpdateProduct')
    const user = await jwt.decode(req.cookies.token, secretKey)
    const product = await Product.getById(req.params.id)
    res.render(filePath, {user: user, product: product})
}
async function getManageProducts(req, res) {
    const filePath = path.join(__dirname, '../', 'views', 'Manage-products')
    const user = await jwt.decode(req.cookies.token, secretKey)
    const result = await Product.getAllProducts()
    if(result.error){
        return res.redirect('/')
    }
    res.render(filePath, {user: user, products: result})
}
async function getEditProduct(req, res){
    const filePath = path.join(__dirname, '../', 'views', 'UpdateProduct')
    const user = await jwt.decode(req.cookies.token, secretKey)
    const product = await Product.getById(req.params.id)
    res.render(filePath, {user: user, product: product})
}
async function postUpdateProduct(req, res) {
    const product = await Product.getById(req.params.id)
    const result = await Product.updateProduct({
        _id: req.params.id,
        title: req.body.title,
        summary: req.body.summary,
        price: req.body.price,
        image: req.file ? req.file.path : product.image,
        desc: req.body.desc
    })
    if(result.error){
        return res.redirect("/")
    }
    res.redirect("/")
}
async function getAddProduct(req, res) {
    const filePath = path.join(__dirname, '../', 'views', 'AddProduct')
    const user = await jwt.decode(req.cookies.token, secretKey)
    res.render(filePath, {user: user, product: null})
}
async function postAddProduct(req, res){
    try {
        const newProduct = {
            title: req.body.title,
            image: req.file ? req.file.path : null,
            summary: req.body.summary,
            price: req.body.price,
            desc: req.body.desc
        };
        // Your code to create new product and handle image
        const result = await Product.addProduct(newProduct)
    } catch (error) {
        console.error("Error in postAddProduct:", error);
        return res.status(500).send("Internal Server Error");
    }
    res.redirect("/add-product")
}
async function postDeleteProduct(req, res){
    try{
        const result = await Product.deleteById(req.params.id)
        if(result.error){
            console.log(result)
            return res.redirect("/")
        }
        res.redirect("/manage-products")
    }catch(err){
        console.log(err)
        return res.redirect("/")
    }
}
module.exports = {
    getProductContr,
    getAllProductsContr,
    getEditProductsContr,
    getManageProducts,
    getEditProduct,
    postUpdateProduct,
    getAddProduct,
    postAddProduct,
    postDeleteProduct
}
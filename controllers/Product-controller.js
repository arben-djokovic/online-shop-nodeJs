
var jwt = require('jsonwebtoken');
const path = require('path')
const secretKey = process.env.SECRET_KEY;
const Product = require("../models/Product");
const { validationResult } = require('express-validator');


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
    const filePath = path.join(__dirname, '../', 'views', 'UpdateProduct')
    const user = await jwt.decode(req.cookies.token, secretKey)
    let product, errors
    if(req.cookies.updateProductInputErrors && req.params.id == req.cookies.updateProductInput._id){
        product = {...req.cookies.updateProductInput}
        errors = req.cookies.updateProductInputErrors
    }else{
        product = await Product.getById(req.params.id)
    }
    res.render(filePath, {user: user, product: product, errors: errors || []})
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
async function postUpdateProduct(req, res) {
    res.cookie("updateProductInput", {
        title: req.body.title,
        image: req.file ? req.file.path : null,
        summary: req.body.summary,
        price: req.body.price,
        desc: req.body.desc,
        _id: req.params.id
    })
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.cookie("updateProductInputErrors", errors.array())
        console.log({ errors: errors.array() })
        return res.redirect(`/edit-product/${req.params.id}`)
    }
    const product = await Product.getById(req.params.id)
    try{
        const result = await Product.updateProduct({
            _id: req.params.id,
            title: req.body.title,
            summary: req.body.summary,
            price: req.body.price,
            image: req.file ? req.file.path : product.image,
            desc: req.body.desc
        })
        res.clearCookie("updateProductInput")
        res.clearCookie("updateProductInputErrors")
        if(result.error){
            return res.redirect("/")
        }
    }catch(err){
        console.log(err)
    }
    res.redirect("/")
}
async function getAddProduct(req, res) {
    const filePath = path.join(__dirname, '../', 'views', 'AddProduct')
    const user = await jwt.decode(req.cookies.token, secretKey)
    res.render(filePath, {user: user, product: req.cookies.productInputs, errors: req.cookies.productInputsErorr || []})
}
async function postAddProduct(req, res){
    res.cookie("productInputs", {
        title: req.body.title,
        image: req.file ? req.file.path : null,
        summary: req.body.summary,
        price: req.body.price,
        desc: req.body.desc,
    })
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.cookie("productInputsErorr", errors.array())
        console.log({ errors: errors.array() })
        return res.redirect("/add-product")
    }
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
        res.clearCookie("productInputs")
        res.clearCookie("productInputsErorr")
        return res.redirect("/")
    } catch (error) {
        console.error("Error in postAddProduct:", error);
        return res.redirect("/add-product")
    }
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
    postUpdateProduct,
    getAddProduct,
    postAddProduct,
    postDeleteProduct
}
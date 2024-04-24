
var jwt = require('jsonwebtoken');
const path = require('path')
const secretKey = process.env.SECRET_KEY;
const Product = require("../models/Product");
const bcrypt = require("bcrypt")


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
module.exports = {
    getProductContr,
    getAllProductsContr,
    getEditProductsContr
}
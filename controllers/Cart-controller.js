
var jwt = require('jsonwebtoken');
const path = require('path');
const Product = require('../models/Product');
const secretKey = process.env.SECRET_KEY;

async function postAddProductToCart(req, res) {
    let cartItems = []
    if(!req.cookies.cartItems){
        res.cookie("cartItems", [{id: req.params.id, quantity: 1}])
    }else{
        cartItems = req.cookies.cartItems
        const isIncluded = cartItems.filter(el => el.id == req.params.id)
        if(isIncluded.length > 0){
            return res.redirect("/cart")
        }
        await cartItems.push({id: req.params.id, quantity: 1})
        res.cookie("cartItems", cartItems)
    }
    res.redirect("/cart")
}
async function postUpdateQuantity (req, res) {
    let cartItems = req.cookies.cartItems
    if(req.body.quantity == 0){
        cartItems = cartItems.filter(el => el.id != req.params.id)
    }else{
        await cartItems.forEach(element => {
            if(element.id == req.params.id){
                element.quantity = req.body.quantity
            } 
        });
    }
    res.cookie("cartItems", cartItems)
    res.redirect("/cart")
}
async function getCart (req, res) {
    const filePath = path.join(__dirname, '../', 'views', 'Cart')
    const user = await jwt.decode(req.cookies.token, secretKey)
    let cartItems = []
    let totalCartPrice = 0
    if(req.cookies.cartItems){
        const result = await Product.getByIds(req.cookies.cartItems)
        result.forEach(element => {
            req.cookies.cartItems.forEach(element2 => {
                if(element._id == element2.id){
                    totalCartPrice += (element.price * element2.quantity)
                    cartItems.push({
                        ...element,
                        ...element2,
                        totalPrice: element.price * element2.quantity
                    })
                }
            });
        });
    }else{
        cartItems = []
    }
    res.render(filePath, {user: user, products: cartItems, totalCartPrice: totalCartPrice})
}
module.exports = {
    postAddProductToCart,
    postUpdateQuantity,
    getCart
}
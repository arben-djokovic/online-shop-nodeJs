var jwt = require('jsonwebtoken');
const path = require('path')
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt")
const { ObjectId } = require('mongodb');
const db = require('../data/database'); 
const Order = require('../models/Order');

async function postBuy(req, res){
    const products = JSON.parse(req.body.products);
    let productsOrder = []
    let totalOrderPrice = 0
    products.forEach(element => {
        totalOrderPrice += (element.price * element.quantity)
        productsOrder.push({
            id: new ObjectId(element.id) || new ObjectId(element._id),
            quantity: element.quantity
        })
    }); 
    const user = jwt.decode(req.cookies.token, secretKey)
    const newOrder = {
        user_id: new ObjectId(user.id),
        products: productsOrder,
        status: 'PENDING',
        date: new Date(),
        totalOrderPrice: totalOrderPrice
    }
    try{
        const result = await db.getDb().collection('orders').insertOne(newOrder)
        res.clearCookie("cartItems")    
        return res.redirect("/orders")
    }catch(err){
        console.log(err)
    }
    res.redirect("/cart")
}
async function getOrders (req, res) {
    const filePath = path.join(__dirname, '../', 'views', 'Orders')
    const user = jwt.decode(req.cookies.token, secretKey)
    const result = await Order.getOrdersByUserId(user.id)
    res.render(filePath, {user: user, orders: result})
}
async function getManageOrders(req, res) {
    const filePath = path.join(__dirname,'../', 'views', 'ManageOrders')
    const user = await jwt.decode(req.cookies.token, secretKey)
    const result = await Order.getAllOrders()
    res.render(filePath, {user: user, orders: result})
}

async function postUpdateOrder(req, res){
    const id = JSON.parse(req.body.orderid)
    const status = req.body.status
    console.log(status)
    const result = await Order.updateStatus(id, status)
    res.redirect("/manage-orders")
}
module.exports = {
    postBuy,
    getOrders,
    getManageOrders,
    postUpdateOrder
}
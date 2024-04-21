const express = require("express")
const path = require('path')
require('dotenv').config();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { body, validationResult } = require('express-validator');
const db = require('./data/database') 
const User = require("./models/User");
const bcrypt = require("bcrypt")

const secretKey = process.env.SECRET_KEY;
const app = express()


app.use(express.urlencoded({extended: false}))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const adminRoutes = async(req, res, next) => {
    const user = await jwt.decode(req.cookies.token, secretKey)
    if(!user || !user.isAdmin){
        return res.redirect("/")
    }
    next()
}

app.get("/", async(req, res) => {
    const filePath = path.join(__dirname, 'views', 'Home')
    const user = await jwt.decode(req.cookies.token, secretKey)
    console.log(user)
    res.render(filePath, {user: user})
})
app.get("/products/:id", async(req, res) => {
    const filePath = path.join(__dirname, 'views', 'Product')
    const user = await jwt.decode(req.cookies.token, secretKey)
    res.render(filePath, {user: user})
})
app.get("/cart", async(req, res) => {
    const filePath = path.join(__dirname, 'views', 'Cart')
    const user = await jwt.decode(req.cookies.token, secretKey)
    res.render(filePath, {user: user})
})
app.get("/singup", async(req, res) => {
    const filePath = path.join(__dirname, 'views', 'Singup')
    const user = await jwt.decode(req.cookies.token, secretKey)
    res.render(filePath, {user: user})
})
app.post("/singup", async(req, res) => {
    try{
        const result = await User.singup({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 12),
            isAdmin: true,
            address: req.body.street})
            if(result.error){
                return res.redirect('/singup')
            }
        res.cookie("token", result)
        return res.redirect('/')
    }catch(err){
        console.log(err)
    }
    res.redirect('/singup')
})
app.get("/login", async(req, res) => {
    const filePath = path.join(__dirname, 'views', 'Login')
    const user = await jwt.decode(req.cookies.token, secretKey)
    res.render(filePath, {user: user})
})
app.post("/login", async(req, res) => {
    try{
        const result = await User.login(req.body.email, req.body.password)
        if(result.error){
            console.log(result.error)
            return res.redirect('/login')
        }
        const token = await jwt.sign({
            name: result.data.name,
            email: result.data.email,
            isAdmin: result.data.isAdmin,
            address: result.data.address
        }, secretKey);
        res.cookie('token', token)
        res.redirect("/")
    }catch(err){
        console.log(err)
    }
})
app.post('/logout', (req, res) => {
    res.clearCookie('token')
    res.redirect('/')
})
app.get("/orders", async(req, res) => {
    const filePath = path.join(__dirname, 'views', 'Orders')
    const user = await jwt.decode(req.cookies.token, secretKey)
    res.render(filePath, {user: user})
})
app.get("/manage-products",adminRoutes, async(req, res) => {
    const filePath = path.join(__dirname, 'views', 'Manage-products')
    const user = await jwt.decode(req.cookies.token, secretKey)
    res.render(filePath, {user: user})
})
app.get("/edit-product/:id",adminRoutes, async(req, res) => {
    const filePath = path.join(__dirname, 'views', 'UpdateProduct')
    const user = await jwt.decode(req.cookies.token, secretKey)
    res.render(filePath, {user: user})
})
app.get("/add-product",adminRoutes, async(req, res) => {
    const filePath = path.join(__dirname, 'views', 'AddProduct')
    const user = await jwt.decode(req.cookies.token, secretKey)
    res.render(filePath, {user: user})
})
app.get("/manage-orders",adminRoutes, async(req, res) => {
    const filePath = path.join(__dirname, 'views', 'ManageOrders')
    const user = await jwt.decode(req.cookies.token, secretKey)
    res.render(filePath, {user: user})
})
db.connection().then(() => {
    app.listen(3000)
})
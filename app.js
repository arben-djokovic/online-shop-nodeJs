const express = require("express")
const path = require('path')
require('dotenv').config();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { body, validationResult } = require('express-validator');
const db = require('./data/database') 
const User = require("./models/User");
const Order = require("./models/Order");
const Product = require("./models/Product");
const bcrypt = require("bcrypt")
const multer  = require('multer');
const { ObjectId } = require('mongodb');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Upload files to the 'uploads/' directory
    },
    filename: function (req, file, cb) {
        // Ensure a unique filename by appending a timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});
const upload = multer({ storage: storage });
const secretKey = process.env.SECRET_KEY;
const app = express()

app.use(express.static(path.join(__dirname, 'uploads')));

app.use(express.urlencoded({extended: false}))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(upload.single('image'));

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
    const result = await Product.getAllProducts()
    if(result.error){
        return res.redirect('/')
    }
    res.render(filePath, {user: user, products: result})
})
app.get("/products/:id", async(req, res) => {
    const filePath = path.join(__dirname, 'views', 'Product')
    const user = await jwt.decode(req.cookies.token, secretKey)
    const product = await Product.getById(req.params.id)
    res.render(filePath, {user: user, product: product})
})
app.get("/cart", async(req, res) => {
    const filePath = path.join(__dirname, 'views', 'Cart')
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
            isAdmin: false,
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
            id: result.data.id || result.data._id,
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
    const result = await Order.getOrdersByUserId(user.id)
    res.render(filePath, {user: user, orders: result})
})
app.get("/manage-products",adminRoutes, async(req, res) => {
    const filePath = path.join(__dirname, 'views', 'Manage-products')
    const user = await jwt.decode(req.cookies.token, secretKey)
    const result = await Product.getAllProducts()
    if(result.error){
        return res.redirect('/')
    }
    res.render(filePath, {user: user, products: result})
})
app.get("/edit-product/:id",adminRoutes, async(req, res) => {
    const filePath = path.join(__dirname, 'views', 'UpdateProduct')
    const user = await jwt.decode(req.cookies.token, secretKey)
    const product = await Product.getById(req.params.id)
    res.render(filePath, {user: user, product: product})
})
app.post("/update-product/:id", async(req, res) => {
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
})
app.get("/add-product",adminRoutes, async(req, res) => {
    const filePath = path.join(__dirname, 'views', 'AddProduct')
    const user = await jwt.decode(req.cookies.token, secretKey)
    res.render(filePath, {user: user, product: null})
})
app.get("/manage-orders",adminRoutes, async(req, res) => {
    const filePath = path.join(__dirname, 'views', 'ManageOrders')
    const user = await jwt.decode(req.cookies.token, secretKey)
    const result = await Order.getAllOrders()
    res.render(filePath, {user: user, orders: result})
})
app.post("/add-product", async(req, res) => {
    const newProduct = {
        title: req.body.title,
        image: req.file ? req.file.path : null, 
        summary: req.body.summary,
        price: req.body.price,
        desc: req.body.desc
    };
    const result = await Product.addProduct(newProduct)
    res.redirect("/add-product")
})
app.post("/delete-product/:id", async(req, res) => {
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
})
app.post("/add-product-cart/:id", async(req, res) => {
    let cartItems
    if(!req.cookies.cartItems){
        res.cookie("cartItems", [{id: req.params.id, quantity: 1}])
    }else{
        cartItems = req.cookies.cartItems
        await cartItems.push({id: req.params.id, quantity: 1})
        res.cookie("cartItems", cartItems)
    }
    res.redirect("/cart")
})
app.post("/update-quantity/:id", async(req, res) => {
    let cartItems = req.cookies.cartItems
    await cartItems.forEach(element => {
        if(element.id == req.params.id){
            element.quantity = req.body.quantity
        } 
    });
    res.cookie("cartItems", cartItems)
    res.redirect("/cart")
})
app.post("/buy", async(req, res) => {
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
})
app.post("/update-order", async(req, res)=> {
    const id = JSON.parse(req.body.orderid)
    const status = req.body.status
    console.log(status)
    const result = await Order.updateStatus(id, status)
    res.redirect("/manage-orders")
})
db.connection().then(() => {
    app.listen(3000)
})
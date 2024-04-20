const express = require("express")
const path = require('path')
require('dotenv').config();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { body, validationResult } = require('express-validator');

const secretKey = process.env.SECRET_KEY;
const app = express()


app.use(express.urlencoded({extended: false}))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    const filePath = path.join(__dirname, 'views', 'Home')
    res.render(filePath)
})
app.get("/products/:id", (req, res) => {
    const filePath = path.join(__dirname, 'views', 'Product')
    res.render(filePath)
})
app.get("/cart", (req, res) => {
    const filePath = path.join(__dirname, 'views', 'Cart')
    res.render(filePath)
})
app.get("/singup", (req, res) => {
    const filePath = path.join(__dirname, 'views', 'Singup')
    res.render(filePath)
})
app.get("/login", (req, res) => {
    const filePath = path.join(__dirname, 'views', 'Login')
    res.render(filePath)
})
app.get("/orders", (req, res) => {
    const filePath = path.join(__dirname, 'views', 'Orders')
    res.render(filePath)
})
app.listen(3000)
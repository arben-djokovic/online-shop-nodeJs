
var jwt = require('jsonwebtoken');
const path = require('path')
const secretKey = process.env.SECRET_KEY;
const User = require("../models/User");
const bcrypt = require("bcrypt")
const { validationResult } = require('express-validator');
const { clearAuthFormCookies } = require('../middleware/middlewares');

async function getLoginContr(req, res){
    const filePath = path.join(__dirname, '../', 'views', 'Login')
    const user = await jwt.decode(req.cookies.token, secretKey)
    res.render(filePath, {user: user, loginInput: req.cookies.loginInputs || [], loginInputErrors: req.cookies.loginInputErrors || []})
}
async function postLoginContr(req, res){
    res.cookie("loginInputs", {
        email: req.body.email
    })
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.cookie("loginInputErrors", errors.array())
        console.log({ errors: errors.array() })
        return res.redirect("/login")
    }
    try{
        const result = await User.login(req.body.email, req.body.password)
        if(result.error){
            console.log(result)
            res.cookie("loginInputErrors", result.error)
            return res.redirect('/login')
        }
        clearAuthFormCookies(res)
        res.cookie('token', result)
        console.log(jwt.decode(result, secretKey))
        res.redirect("/")
    }catch(err){
        console.log(err)
    }
}

async function getSingupContr(req, res){
    const filePath = path.join(__dirname,'../', 'views', 'Singup')
    const user = await jwt.decode(req.cookies.token, secretKey)
    console.log(req.cookies.singupInput)
    res.render(filePath, {user: user, singupInput: req.cookies.singupInputs || [], singupInputErrors: req.cookies.singupInputErrors || []})
}
async function postSingupContr(req, res){
    res.cookie("singupInputs", {
        email: req.body.email,
        confemail: req.body.confemail,
        name: req.body.name,
        street: req.body.street
    })
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.cookie("singupInputErrors", errors.array())
        return res.redirect("/singup")
    }
    try{
        const result = await User.singup({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 12),
            isAdmin: false,
            address: req.body.street})
            if(result.error){
                res.cookie("singupInputErrors", result.error)
                return res.redirect('/singup')
            }
            clearAuthFormCookies(res)
            res.cookie("token", result)
            console.log(jwt.decode(result, secretKey))
            return res.redirect('/')
    }catch(err){
        console.log(err)
    }
    res.redirect('/singup')
}
    
async function logOutContr(req, res){
    res.clearCookie('token')
    res.redirect('/')
}
    
module.exports = {
    getLoginContr,
    postLoginContr,
    getSingupContr,
    postSingupContr,
    logOutContr
}
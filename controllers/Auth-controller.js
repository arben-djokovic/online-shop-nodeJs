
var jwt = require('jsonwebtoken');
const path = require('path')
const secretKey = process.env.SECRET_KEY;
const User = require("../models/User");
const bcrypt = require("bcrypt")


async function getLoginContr(req, res){
    const filePath = path.join(__dirname, '../', 'views', 'Login')
    const user = await jwt.decode(req.cookies.token, secretKey)
    res.render(filePath, {user: user})
}
async function postLoginContr(req, res){
    try{
        const result = await User.login(req.body.email, req.body.password)
        if(result.error){
            console.log(result.error)
            return res.redirect('/login')
        }
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
    res.render(filePath, {user: user})
}
async function postSingupContr(req, res){
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
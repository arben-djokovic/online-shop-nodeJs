const db = require('../data/database');
var jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")

const secretKey = process.env.SECRET_KEY;

class User{
    constructor(name, email, password, isAdmin, address){
        this.name = name,
        this.email = email,
        this.password = password,
        this.isAdmin = isAdmin,
        this.address = address
    }
    static async login(email, password){
        try{
            const result = await db.getDb().collection("users").find({email: email}).toArray()
            if(result.length == 0){
                return {error: [{msg: "Korisnik ne postoji"}]}
            }
            if(bcrypt.compareSync(password, result[0].password)){
                return this.generateToken(result[0])
            }            
            return {error: [{msg: "Pogresne informacije"}]}

        }catch(err){            
            return {error: [{msg: "Greska u prijavljivanju"}]}
        }
    }
    static async singup(user){
        try{
            const doExist = await db.getDb().collection("users").find({email: user.email}).toArray()
            if(doExist.length > 0){
                return {error: [{msg: "Korisnik vec postoji"}]}
            }
            const result = await db.getDb().collection("users").insertOne({
                name: user.name,
                email: user.email,
                password: user.password,
                isAdmin: user.isAdmin,
                address: user.address})
            return this.generateToken({...user, id: result.insertedId})
        }catch(err){
            return { error: [{msg: "Greska u prijavljivanju"}]}
        }
    }
    static async generateToken(user){
        const token = await jwt.sign({ 
            name: user.name,
            email: user.email,
            id: user.id || user._id,
            isAdmin: user.isAdmin,
            address: user.address}, secretKey)
        return token
    }
}
module.exports = User;
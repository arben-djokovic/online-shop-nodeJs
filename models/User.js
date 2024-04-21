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
                return { error: "Korisnik nije pronadjen"}
            }
            if(bcrypt.compareSync(password, result[0].password)){
                return {data: result[0]}
            }
            return { error: "Pogresne informacije"}
        }catch(err){
            return { error: "Greska u prijavljivanju"}
        }
    }
    static async singup(user){
        try{
            const result = await db.getDb().collection("users").insertOne({
                name: user.name,
                email: user.email,
                password: user.password,
                isAdmin: user.isAdmin,
                address: user.address})
            const token = await jwt.sign({ name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                address: user.address}, secretKey)
            return token
        }catch(err){
            return { error: "Greska u prijavljivanju"}
        }
    }
}
module.exports = User;
const db = require('../data/database');
const { ObjectId } = require('mongodb');
class Product{
    constructor(name, summary, price, image, desc){
        this.name = name,
        this.summary = summary,
        this.price = price,
        this.image = image,
        this.desc = desc
    }

    static async addProduct(product) {
        try{
            const result = await db.getDb().collection("products").insertOne({
                title: product.title,
                summary: product.summary,
                price: product.price,
                image: product.image,
                desc: product.desc
            })
            return result
        }catch(err){
            return {error: "Erorr accured"}
        }
    }
    static async getAllProducts() {
        try{
            const result = await db.getDb().collection("products").find({}).toArray()
            return result
        }catch(err){
            return {error: "Cannot get all products"}
        }
    }
    static async deleteById(id){
        try{
            const result = await db.getDb().collection("products").deleteOne({_id: new ObjectId(id)})
            console.log(result)
            return true
        }catch(err){
            return {error: "Cannot delete product"}
        }
    }
    static async getById(id){
        try{
            const result = await db.getDb().collection("products").find({_id: new ObjectId(id)}).toArray()
            console.log(result)
            return result[0]
        }catch(err){
            return {error: "Cannot find product"}
        }
    }
    static async updateProduct(product){
        try{
            const result = await db.getDb().collection('products').updateOne({_id: new ObjectId(product._id)},{$set: {
                title: product.title,
                summary: product.summary,
                price: product.price,
                image: product.image,
                desc: product.desc
            }})
            return true
        }catch(err){
            return {error: "Cannot update product"}
        }
    }
    static async getByIds(ids){
        let objectIds = ids.map(id => new ObjectId(id))
        try{
            const result = await db.getDb().collection("products").find({_id: {$in: objectIds}}).toArray()
            return result
        }catch(err){
            return {error: "Cannot find product"}
        }
    }
}
module.exports = Product
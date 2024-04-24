const db = require('../data/database');
const { ObjectId } = require('mongodb');
const Product = require('./Product');
class Order{
    constructor(user_id, product_id, date, status){
        this.user_id = user_id,
        this.product_id = product_id,
        this.date = date,
        this.status = status
    }

    static async updateStatus(order_id, status) {
        try {
            const result = await db
                .getDb()
                .collection("orders")
                .updateOne(
                    { _id: new ObjectId(order_id) },
                    { $set: { status: status } }
                );
            console.log(result);
            return result;
        } catch (err) {
            console.log(err);
            return { error: "Error updating order status" };
        }
    }
    static async getOrdersByUserId(user_id){
        console.log(user_id)
        try{    
            const orders = await db.getDb().collection("orders").aggregate([
                {
                    $match: { "user_id": new ObjectId(user_id) }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "user_id",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                {
                    $unwind: "$user"
                },
                {
                    $unwind: "$products"
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "products.id",
                        foreignField: "_id",
                        as: "productsDetails"
                    }
                },
                {
                    $unwind: "$productsDetails"
                },
                {
                    $project: {
                        _id: 1,
                        user_id: 1,
                        status: 1,
                        date: 1,
                        user: 1,
                        totalOrderPrice: 1,
                        "products.id": 1,
                        "products.quantity": 1,
                        "productsDetails.title": 1,
                        "productsDetails.summary": 1,
                        "productsDetails.price": 1,
                        "productsDetails.image": 1,
                        "productsDetails.desc": 1
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        user_id: { $first: "$user_id" },
                        status: { $first: "$status" },
                        date: { $first: "$date" },
                        user: { $first: "$user" },
                        totalOrderPrice: { $first: "$totalOrderPrice" },
                        products: {
                            $push: {
                                id: "$products.id",
                                quantity: "$products.quantity",
                                title: "$productsDetails.title",
                                summary: "$productsDetails.summary",
                                price: "$productsDetails.price",
                                image: "$productsDetails.image",
                                desc: "$productsDetails.desc"
                            }
                        }
                    }
                }
            ]).toArray();

            return orders;
        }catch(err){
            console.log(err)
            return {error: "Greska u trazenju orders-a"}
        }
    }
    static async getAllOrders(){
        try{    
            const orders = await db.getDb().collection("orders").aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "user_id",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                {
                    $unwind: "$user"
                },
                {
                    $unwind: "$products"
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "products.id",
                        foreignField: "_id",
                        as: "productsDetails"
                    }
                },
                {
                    $unwind: "$productsDetails"
                },
                {
                    $project: {
                        _id: 1,
                        user_id: 1,
                        status: 1,
                        date: 1,
                        user: 1,
                        totalOrderPrice: 1,
                        "products.id": 1,
                        "products.quantity": 1,
                        "productsDetails.title": 1,
                        "productsDetails.summary": 1,
                        "productsDetails.price": 1,
                        "productsDetails.image": 1,
                        "productsDetails.desc": 1
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        user_id: { $first: "$user_id" },
                        status: { $first: "$status" },
                        date: { $first: "$date" },
                        user: { $first: "$user" },
                        totalOrderPrice: { $first: "$totalOrderPrice" },
                        products: {
                            $push: {
                                id: "$products.id",
                                quantity: "$products.quantity",
                                title: "$productsDetails.title",
                                summary: "$productsDetails.summary",
                                price: "$productsDetails.price",
                                image: "$productsDetails.image",
                                desc: "$productsDetails.desc"
                            }
                        }
                    }
                }
            ]).toArray();

            return orders;
        }catch(err){
            console.log(err)
            return {error: "Greska u trazenju orders-a"}
        }
    }
}
module.exports = Order
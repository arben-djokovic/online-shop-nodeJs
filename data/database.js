const mongodb = require('mongodb')

const mongodbClient = mongodb.MongoClient;
let database;
const connection = async() => {
    try{
        const client = await mongodbClient.connect('mongodb://0.0.0.0:27017')
        database = client.db('online-shop')
    }catch(err){
        console.log(err)
        throw err
    }
}
 
const getDb = () => {
    if(database){
        console.log("connected")
        return database
    }
    console.log("not connected")
    throw { message: "Not connected"}
}


module.exports ={
    connection,
    getDb
}
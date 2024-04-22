const { MongoClient } = require('mongodb');
let database;

const connection = async() => {
    try {
        const client = new MongoClient('mongodb://0.0.0.0:27017');
        await client.connect();
        database = client.db('online-shop');
    } catch(err) {
        console.log(err);
        throw err;
    }
};

 
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
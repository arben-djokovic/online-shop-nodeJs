const express = require("express")
const path = require('path')
require('dotenv').config();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const db = require('./data/database') 
const Order = require("./models/Order");
const Product = require("./models/Product");
const multer  = require('multer');
const { ObjectId } = require('mongodb');

const authRoutes = require("./routes/Auth-routes");
const productsRoutes = require("./routes/Product-routes");
const cartRoutes = require("./routes/Cart-routes");
const orderRoutes = require("./routes/Order-routes");
const { adminRoutes } = require("./middleware/middlewares");

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

app.use(authRoutes)
app.use(productsRoutes)
app.use(cartRoutes)
app.use(orderRoutes)


db.connection().then(() => {
    app.listen(3000)
})
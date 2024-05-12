var jwt = require("jsonwebtoken");
const path = require("path");
const secretKey = process.env.SECRET_KEY;
const { ObjectId } = require("mongodb");
const db = require("../data/database");
const Order = require("../models/Order");
const stripe = require("stripe")("sk_test_51PFcXMG6itVkQBRdRyRMvwIUx1zuDGx9LyNz9gB3BftIOmkUeWBmQMUcBIefyeb7cNUQYbNVXL1pbNKeuBdMSC7X00lLKA8GnS");

async function postBuy(req, res) {
  const products = JSON.parse(req.body.products);
  console.log(products)
  let productsOrder = [];
  let totalOrderPrice = 0;
  products.forEach((element) => {
      totalOrderPrice += element.price * element.quantity;
    productsOrder.push({
      id: new ObjectId(element.id) || new ObjectId(element._id),
      quantity: element.quantity,
    });
  });
  const user = jwt.decode(req.cookies.token, secretKey);
  const newOrder = {
    user_id: new ObjectId(user.id),
    products: productsOrder,
    status: "PENDING",
    date: new Date(),
    totalOrderPrice: totalOrderPrice,
  };
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: products.map(item => {
        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.title || 'test'
                },
                unit_amount: +item.price*100
            },
            quantity: item.quantity,
        }
    }),
    mode: "payment",
    success_url: `http://localhost:3000/orders`,
    cancel_url: `http://localhost:3000/order/cancel`,
  });

  try {
    const result = await db.getDb().collection("orders").insertOne(newOrder);
    res.clearCookie("cartItems");
    // return res.redirect("/orders");
  } catch (err) {
    console.log(err);
  }
  
  res.redirect(303, session.url);
//   res.redirect("/cart");
}
async function getOrders(req, res) {
  const filePath = path.join(__dirname, "../", "views", "Orders");
  const user = jwt.decode(req.cookies.token, secretKey);
  const result = await Order.getOrdersByUserId(user.id);
  res.render(filePath, { user: user, orders: result });
}
async function getManageOrders(req, res) {
  const filePath = path.join(__dirname, "../", "views", "ManageOrders");
  const user = await jwt.decode(req.cookies.token, secretKey);
  const result = await Order.getAllOrders();
  res.render(filePath, { user: user, orders: result });
}
async function getOrderError(req, res){
    const filePath = path.join(__dirname, "../", "views", "OrderError");
    const user = await jwt.decode(req.cookies.token, secretKey);
    res.render(filePath, { user: user})
}


async function postUpdateOrder(req, res) {
  const id = JSON.parse(req.body.orderid);
  const status = req.body.status;
  console.log(status);
  const result = await Order.updateStatus(id, status);
  res.redirect("/manage-orders");
}
module.exports = {
  postBuy,
  getOrders,
  getManageOrders,
  postUpdateOrder,
  getOrderError
};

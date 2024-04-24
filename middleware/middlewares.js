const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

const adminRoutes = async (req, res, next) => {
    const user = await jwt.decode(req.cookies.token, secretKey);
    if (!user || !user.isAdmin) {
        return res.redirect("/");
    }
    next();
};

module.exports = { adminRoutes };

const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;
const { body } = require('express-validator');

const adminRoutes = async (req, res, next) => {
    const user = await jwt.decode(req.cookies.token, secretKey);
    if (!user || !user.isAdmin) {
        return res.redirect("/");
    }
    next();
};
const loginValidationRules = [
    body('email').isEmail().withMessage("Unesite ispravan email"),
    body('password').isLength({ min: 2 }).withMessage("Netacne informacije")
  ];
const singupValidationRules = [
    body('email').isEmail().withMessage("Unesite ispravan email"),
    body('confemail').custom((value, { req }) => {
        if (value !== req.body.email) {
          throw new Error('Confirmation email must match email');
        }
        return true;
      }),
    body('password').isLength({ min: 2 }).withMessage("Password prekratak"),
    body('name').isLength({ min: 2 }).withMessage("Ime prekratko"),
    body('street').isLength({ min: 2 }).withMessage("Ulica neispravno unijeta!")
];
const clearAuthFormCookies = (res) => {
  res.clearCookie('singupInputs')
  res.clearCookie('singupInputErrors')
  res.clearCookie('loginInputs')
  res.clearCookie('loginInputErrors')
}

module.exports = { adminRoutes, loginValidationRules, singupValidationRules, clearAuthFormCookies };

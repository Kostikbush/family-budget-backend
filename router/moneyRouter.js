const Router = require("express").Router;
const MoneyController = require("../controllers/money-controller");
const router = new Router();
const { body } = require("express-validator");

router.post("/getBudget", body("email").isEmail(), MoneyController.getBudget);

router.post(
  "/addIncom",
  body("email").isEmail() /* 
  email: email
  incom:{
    title: {
          type: String,
          required: true,
          default: "Доход",
        },
    sum: {
          type: Number,
          required: true,
        },
    type: {mounth or week
          type: String, 
          required: true,
        },
    date: Number of mounth 
    dayWeek: Number of week 
  }
*/,
  body("incom").isObject(),
  MoneyController.addPlainIncom
);
router.post(
  "/deleteIncom",
  // id, email
  MoneyController.deletePlainIncom
);
router.delete(
  "/deleteExpens",
  // id, email
  MoneyController.deletePlainExpens
);

module.exports = router;

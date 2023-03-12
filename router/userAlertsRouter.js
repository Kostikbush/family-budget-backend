const Router = require("express").Router;
const UserAlertController = require("../controllers/userAlertsController");
const router = new Router();
const { body } = require("express-validator");

router.post(
  "/newAlertFromUser",
  body("emailFrom").isEmail(),
  /* 
      emailFrom
      emailTo
      title: 'Создать общий сюжет' || 'Добавить расход',
      message: `Пользователь ${emailFrom} хочет создать с вами общий буджет` || 
      `Пользователь ${emailFrom} хочет добавить расход`
      expens?: { || {}
        title: {
          type: String,
          required: true,
          default: "Расход",
        },
        sum: {
          type: Number,
          required: true,
        },
        
      }
  */
  body("emailTo").isEmail(),
  body("emailFrom").isEmail(),
  body("theme").isObject(),
  body("expens").isObject(),
  UserAlertController.alertUser
);
router.post(
  "/anserFromUser",
  body("anser").isObject(),
  /* 
    "anser":{
        "fromUser": "accountUse@yandex.ru",
        "anser": "Yes"
    } 
  */
  UserAlertController.anserUser
);
router.post("/users", UserAlertController.searchUsers);

module.exports = router;

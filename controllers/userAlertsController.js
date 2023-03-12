const { validationResult } = require("express-validator");

const userAlertService = require("../servise/user-alert-service");

const ApiError = require("../exceptions/api-error");

class UserAlertController {
  async alertUser(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            "Введённое значение не является почтой",
            errors.array()
          )
        );
      }
      /* 
        theme = {
            title: 'Создать общий сюжет' || 'Добавить расход',
            message: `Пользователь ${emailFrom} хочет создать общий буджет`
            id?: String
        }
      */
      const { emailFrom, emailTo, theme, expens } = req.body;
      const alert = await userAlertService.alertUser(
        emailFrom,
        emailTo,
        theme,
        expens
      );

      return res.status(200).json(alert);
    } catch (e) {
      next(e);
    }
  }
  async anserUser(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            "Введённое значение не является объектом",
            errors.array()
          )
        );
      }
      const { anser } = req.body;
      if (anser.anser === "Yes") {
        const anserOn = await userAlertService.anserUser(anser);
        return res.status(200).json(anserOn);
      } else {
        await userAlertService.clearAlert(anser.fromUser);
        return res.status(200).json({ message: "Вы ответили нет" });
      }
    } catch (e) {
      next(e);
    }
  }
  async searchUsers(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            "Введённое значение не является строкой",
            errors.array()
          )
        );
      }
      const { email, emailFrom } = req.body;
      const users = await userAlertService.searchUsers(email, emailFrom);
      return res.status(200).json(users);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserAlertController();

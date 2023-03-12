const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-error");
const MunyService = require("../servise/money-service");
class MoneyController {
  async getBudget(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest("У вас указана неправильная почта"),
          errors.array()
        );
      }
      const { email } = req.body;
      const budget = await MunyService.getBudget(email);
      return res.status(200).json(budget);
    } catch (e) {
      next(e);
    }
  }
  async addPlainIncom(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest(
            "Введённое значение не является доходом",
            errors.array()
          )
        );
      }

      const { incom, email } = req.body;
      const alert = await MunyService.addPlainIncome(incom, email);

      return res.status(200).json(alert);
    } catch (e) {
      next(e);
    }
  }
  async deletePlainIncom(req, res, next) {
    try {
      const { id, email } = req.body;
      const alert = await MunyService.detePalinIncom(id, email);
      return res.status(200).json(alert);
    } catch (e) {
      next(e);
    }
  }
  async deletePlainExpens(req, res, next) {
    try {
      const { id, email } = req.body;
      const alert = await MunyService.deletePlainExpens(id, email);

      return res.status(200).json(alert);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new MoneyController();

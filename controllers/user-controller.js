const { validationResult } = require("express-validator");

const userService = require("../servise/user-service");
const ApiError = require("../exceptions/api-error");

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest("Ошибка при валидации", errors.array())
        );
      }
      const { email, password, name } = req.body;
      const userData = await userService.registration(email, password, name);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 45 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 45 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }
  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    } catch (e) {
      next(e);
    }
  }
  async refresh(req, res, next) {
    try {
      const refreshToken = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 45 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  async deletUser(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest("Ошибка при валидации", errors.array())
        );
      }
      const { email, password } = req.body;
      await userService.deletUser(email, password);
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      if (!token) {
        return next(ApiError.BadRequest("Что-то пошло не так", errors.array()));
      }
      return res.json("ok");
    } catch (e) {
      next(e);
    }
  }
  async images(req, res, next) {
    try {
      const images = await userService.getImages();
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      return res.json(images);
    } catch (e) {
      next(e);
    }
  }
  async setUserAvatar(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest("Ошибка при валидации", errors.array()));
    }
    const { avatar, email } = req.body;
    const newUserData = await userService.setAvatar(avatar, email);
    return res.json(newUserData);
  }
  async getComments(req, res, next) {
    try {
      const comments = await userService.getComments();
      return res.json(comments);
    } catch (e) {
      next(e);
    }
  }
  async addComment(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest("Ошибка при валидации", errors.array())
        );
      }
      const { email, comment, smile } = req.body;
      const user = await userService.addComment(email, comment, smile);
      return res.json(user);
    } catch (e) {
      next(e);
    }
  }
  async getOpponent(req, res, next) {
    try {
      const { budgetId } = req.body;
      const users = await userService.getOpponent(budgetId);
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }
  async getUser(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest("Ошибка при валидации", errors.array())
        );
      }
      const { email } = req.body;
      const user = await userService.getUser(email);
      return res.json(user);
    } catch (e) {
      next(e);
    }
  }
  async checkBack(req, res, next) {
    try {
      res.status(200).json("ok");
    } catch (e) {
      next(e);
    }
  }
  async changeName(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest("Ошибка при валидации", errors.array())
        );
      }
      const { email, name } = req.body;
      console.log(email);
      const upDateUser = await userService.changeName(email, name);
      res.json(upDateUser);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();

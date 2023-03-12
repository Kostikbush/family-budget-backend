const Router = require("express").Router;
const userController = require("../controllers/user-controller");
const router = new Router();
const { body } = require("express-validator");
router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 6, max: 20 }),
  body("name").isLength({ min: 3, max: 12 }),
  userController.registration
);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/activate/:link", userController.activate);
router.get("/refresh", userController.refresh);
router.delete(
  "/deletUser",
  body("email").isEmail(),
  body("password").isLength({ min: 4, max: 20 }),
  userController.deletUser
);
router.get("/images", userController.images);
router.post(
  "/setAvatar",
  body("avatar").isString(),
  body("email").isEmail(),
  userController.setUserAvatar
);
router.get("/comments", userController.getComments);
router.post(
  "/addComment",
  body("email").isEmail(),
  body("comment").isString(),
  body("smile").isString(),
  userController.addComment
);
router.post("/getOpponent", userController.getOpponent);
router.post("/getUser", body("email").isEmail(), userController.getUser);
router.get("/checkBack", userController.checkBack);
router.post(
  "/changeName",
  body("email").isString(),
  body("name").isString(),
  userController.changeName
);

module.exports = router;

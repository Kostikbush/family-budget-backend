const bcrypt = require("bcrypt");
const uuid = require("uuid");
const fs = require("fs");
const path = require("path");

const UserModel = require("../models/user-model");
const BudgetSchema = require("../models/budget-model");
const mailService = require("./mail-service");
const TokenModel = require("../models/token-model");
const tokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-error");
const CommentShema = require("../models/comment-model");
const ChatModel = require("../models/chat-model");

class UserService {
  async registration(email, password, name) {
    const candidate = await UserModel.findOne({ email });

    if (candidate) {
      throw ApiError.BadRequest(
        `Пользователь с почтовым адресом ${email} уже существует`
      );
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();
    const user = await UserModel.create({
      email,
      name,
      password: hashPassword,
      activationLink,
      avatar: "",
      isSetComment: false,
    });
    await mailService.sendActivetionMail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`
    );
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      user: user,
    };
  }
  async activate(activationLink) {
    const user = await UserModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest("Неккоректная ссылка активации");
    }
    user.isActivated = true;
    await user.save();
  }
  async login(email, password) {
    console.log(email);
    const user = await UserModel.findOne({ email });
    console.log(email, user);
    if (!user) {
      throw ApiError.BadRequest("Пользователь с таким email не найден");
    }
    const isPassEquals = await bcrypt.compare(password, user.password);

    if (!isPassEquals) {
      throw ApiError.BadRequest("Неверный пароль");
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      user: user,
    };
  }
  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }
  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      user: userDto,
    };
  }
  async deletUser(email, password) {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw ApiError.BadRequest("Пользователь с таким email не найден");
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest("Неверный пароль");
    }
    const idBudget = user.budget;
    const idChat = user.chat;
    const idUser = user._id;
    await TokenModel.findOneAndRemove({ user: idUser });
    await UserModel.deleteOne({ email: email });
    if (idBudget && idChat) {
      await BudgetSchema.deleteOne({ _id: idBudget });
      await ChatModel.deleteOne({ _id: idChat });
      const userTwo = await UserModel.findOne({ budget: idBudget });
      userTwo.chat = null;
      userTwo.budget = null;
      await userTwo.save();
    }
  }
  async getImages() {
    const imagesPath = path.join(__dirname, "../img");

    const images = fs
      .readdirSync(imagesPath)
      .filter((file) => path.extname(file) === ".svg");
    const imagesData = images.map((image) => {
      const filePath = path.join(imagesPath, image);
      const content = fs.readFileSync(filePath, "utf8");
      return {
        name: path.basename(image, path.extname(image)),
        content: content,
      };
    });
    return imagesData;
  }
  async setAvatar(avatar, email) {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      throw ApiError.BadRequest("Пользователь с таким email не найден");
    }
    user.avatar = avatar;
    await user.save();
    return user;
  }
  async getComments() {
    const comments = await CommentShema.find();
    return comments;
  }
  async addComment(email, comment, smile) {
    const user = await UserModel.findOne({ email: email });
    user.isSetComment = true;
    await user.save();
    await CommentShema.create({
      email: email,
      comment: comment,
      name: user.name,
      smile: smile,
    });
    return user;
  }
  async getOpponent(budgetId) {
    const users = await UserModel.find({ budget: budgetId });
    if (users.length < 2) {
      throw ApiError.BadRequest("Пользователь не найден");
    }
    return users;
  }
  async getUser(email) {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      throw ApiError.BadRequest("Пользователь не найден");
    }
    return user;
  }
  async changeName(email, newName) {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      throw ApiError.BadRequest("Пользователь не найден");
    }

    user.name = newName;
    await user.save();
    return user;
  }
}

module.exports = new UserService();

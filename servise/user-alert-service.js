const uuid = require("uuid");

const UserModel = require("../models/user-model");
const mailService = require("./mail-service");
const ApiError = require("../exceptions/api-error");
const BudgetSchema = require("../models/budget-model");
const MunyService = require("./money-service");
const ChatModel = require("../models/chat-model");

class UserAlertService {
  async alertUser(emailFrom, emailTo, theme, expens) {
    const userTo = await UserModel.findOne({ email: emailTo });
    if (!userTo) {
      throw ApiError.BadRequest(
        `Пользователь с почтовым адресом ${emailTo} не существует`
      );
    }
    if (userTo.alert.length) {
      throw ApiError.BadRequest(
        `Пользователю с почтовым адресом ${emailTo} уже послано 1 уведомление`
      );
    }
    if (theme.title === "Добавить расход") {
      await MunyService.canAddExpens(userTo.budget);
    }
    const id = uuid.v4();
    userTo.alert.push({
      id: id,
      userFrom: emailFrom,
      userTo: emailTo,
      theme: theme.title,
      message: theme.message,
    });
    await userTo.save();
    return {
      text: "Уведомление отправлено",
      id,
    };
  }
  //
  //
  //
  //
  //
  async anserUser(anser) {
    const email = anser.fromUser;
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest(
        `Пользователь с почтовым адресом ${user} не  существует`
      );
    }
    const emailTo = user.alert[0].userFrom;
    const userTo = await UserModel.findOne({ email: emailTo });
    if (user.alert[0].theme === "Создать общий сюжет") {
      if (typeof userTo.budget === String && userTo.budget.length > 3) {
        throw ApiError.BadRequest(
          `У пользователя  ${userTo.email} уже есть бюджет.`
        );
      } else if (typeof user.budget === String && user.budget.length > 3) {
        if (typeof user.budget === String && user.budget.length > 3) {
          throw ApiError.BadRequest(
            `У пользователя  ${user.email} уже есть бюджет.`
          );
        }
      }
      const budget = await BudgetSchema.create({
        freeIncomes: 0,
      });
      const chat = await ChatModel.create({});
      userTo.chat = chat._id;
      user.chat = chat._id;
      userTo.budget = budget._id;
      user.budget = budget._id;
      user.alert = [];
      await userTo.save();
      await user.save();
      return { message: "Бюджет с чатом создан", idBudget: budget._id };
    }
    if (user.alert[0].theme === "Добавить расход") {
      // const idBudget = user.budget;
      // const budget = await BudgetSchema.findOne({ _id: idBudget });
      // if (!budget) {
      //   throw ApiError.BadRequest(`Общий бюджет ещё не создан`);
      // } else if (!budget.plannedIncomes.length) {
      //   throw ApiError.BadRequest(`У вас ещё нет доходов на этот расход!`);
      // } else {
      //   const expenses = budget.plannedExpenditure.notAnserExpenses[0];
      //   let info = await MunyService.addPlainExpenses(budget, expenses);
      //   budget.plannedExpenditure.notAnserExpenses = [];
      //   await budget.save();
      //   if (info.message === "Отрицательный баланс бюджета") {
      //     ApiError.BadRequest(`У вас не хватает доходов на этот расход!`);
      //   } else {
      //     return (budget = info.budget);
      //   }
      // }
      user.alert = [];
      await user.save();
      await userTo.save();
      await MunyService.clearnotAnserExpenses(user.budget);
    }
  }
  async searchUsers(string, email) {
    let usersSearch = [];
    const users = Array.from(await UserModel.find());

    users.map((user) => {
      let lengthStr = string.length;
      if (lengthStr < 3) {
        throw ApiError.BadRequest(`Слишком короткая строка`);
      }
      if (user.email.slice(0, lengthStr) === string) {
        usersSearch.push(user);
      }
    });
    let notThisUser = usersSearch.filter((user) => user.email !== email);
    let hasNoBudgetUsers = notThisUser.filter(
      (user) =>
        user.budget === "" || user.budget === null || user.budget === undefined
    );
    return hasNoBudgetUsers;
  }
  async clearAlert(email) {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      throw ApiError.BadRequest(
        `Пользователь с почтовым адресом ${user} не  существует`
      );
    }
    if (user.alert[0].theme !== "Создать общий сюжет") {
      await MunyService.clearnotAnserExpenses(user.budget);
    }
    console.log(user);
    user.alert = [];
    await user.save();
    return "ok";
  }
}
module.exports = new UserAlertService();

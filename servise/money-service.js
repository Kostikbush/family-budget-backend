const uuid = require("uuid");

const ApiError = require("../exceptions/api-error");
const BudgetSchema = require("../models/budget-model");
const CheckMunyService = require("./check-muny-service");
const UserModel = require("../models/user-model");

class MunyService {
  async getBudget(email) {
    let user = await UserModel.findOne({ email: email });
    let budget = await BudgetSchema.findOne({ _id: user.budget });
    if (!budget) {
      throw ApiError.BadRequest(`Общий бюджет ещё не создан`);
    }
    let updateBudget = CheckMunyService.updateBudget(budget);
    budget = updateBudget;
    await budget.save();
    return budget;
  }
  async addPlainExpenses(budget, expenses) {
    const info = CheckMunyService.canAddChangeBudget(budget, expenses);
    return info;
  }
  async deletePlainExpens(id, email) {}

  async addPlainIncome(incom, email) {
    const user = await UserModel.findOne({ email: email });
    const idBudget = user.budget;
    if (!idBudget) {
      throw ApiError.BadRequest(`Общий бюджет ещё не создан`);
    }
    const budget = await BudgetSchema.findOne({ _id: idBudget });
    if (!budget) {
      throw ApiError.BadRequest(`Общий бюджет ещё не создан`);
    }
    const newId = uuid.v4();
    if (incom.type === "week") {
      const rest = budget.plannedIncomes.incomWeek;
      budget.plannedIncomes.incomWeek = [
        {
          id: newId,
          title: incom.title,
          sum: incom.sum,
          dayOfWeek: incom.dayWeek,
        },
        ...rest,
      ];
      await budget.save();
    } else {
      budget.plannedIncomes.incomMounth.push({
        id: newId,
        title: incom.title,
        sum: incom.sum,
        dateOfMounth: incom.date,
      });
      await budget.save();
    }

    return {
      budget,
    };
  }
  async detePlainIncom(id, email) {}
  async canAddExpens(idBudget) {
    const budget = BudgetSchema.findOne({ _id: idBudget });
    if (!budget) {
      throw ApiError.BadRequest(`Общий бюджет ещё не создан`);
    } else if (!budget.plannedIncomes.length) {
      throw ApiError.BadRequest(`У вас ещё нет доходов на этот расход!`);
    }
    budget.plannedExpenditure.notAnserExpenses.push(expens);
    await budget.save();
  }
  async clearnotAnserExpenses(idBudget) {
    const budget = BudgetSchema.findOne({ _id: idBudget });
    if (!budget) {
      throw ApiError.BadRequest(`Общий бюджет ещё не создан`);
    }
    budget.plannedExpenditure.notAnserExpenses = [];
    await budget.save();
  }
}

module.exports = new MunyService();

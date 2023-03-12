const { Schema, model } = require("mongoose");

const BudgetSchema = new Schema({
  plannedIncomes: {
    incomWeek: [
      {
        id: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
          default: "Доход",
        },
        sum: {
          type: Number,
          required: true,
        },
        dayOfWeek: {
          type: Number,
          required: true,
        },
      },
    ],
    incomMounth: [
      {
        id: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
          default: "Доход",
        },
        sum: {
          type: Number,
          required: true,
        },
        dateOfMounth: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  plannedExpenditure: {
    expensWeek: [
      {
        id: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
          default: "Расход",
        },
        sum: {
          type: Number,
          required: true,
        },
        dayOfWeek: {
          type: String,
          required: true,
        },
      },
    ],
    expensMounth: [
      {
        id: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
          default: "Расход",
        },
        sum: {
          type: Number,
          required: true,
        },
        dateOfMounth: {
          type: Number,
          required: true,
        },
        dimension: {
          type: String,
          required: true, //rubles || percentages
        },
      },
    ],
    expensYear: [
      {
        id: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
          default: "Расход",
        },
        sum: {
          type: Number,
          required: true,
        },
        date: {
          mounth: { type: Number, required: true },
          day: { type: Number, required: true },
        },
      },
    ],
    notAnserExpenses: [
      {
        id: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
          default: "Расход",
        },
        expensSum: {
          type: Number,
          required: true,
        },
        typeOfDateExp: {
          type: String, // week or mounth or year
          required: true,
        },
        dateOrDayOfWeek: {
          dayIfWeek: { type: Number },
          dateIfMounth: {
            mounth: { type: Number },
            day: { type: Number },
          },
        },
        dimension: {
          type: String,
          required: true,
        },
      },
    ],
  },
  aim: [
    {
      id: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      cost: {
        type: Number,
        required: true,
      },
      completionDate: {
        type: String,
      },
      accumulated: {
        type: Number,
        required: true,
      },
    },
  ],
  expenses: [
    {
      id: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        default: "Расход",
      },
      cost: {
        type: Number,
        required: true,
      },
      date: {
        year: { type: Number, required: true },
        mounth: { type: Number, required: true },
        day: { type: Number, required: true },
      },
    },
  ],
  incomes: [
    {
      id: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        default: "Доход",
      },
      sum: {
        type: Number,
        required: true,
      },
      date: {
        year: { type: Number, required: true },
        mounth: { type: Number, required: true },
        day: { type: Number, required: true },
      },
    },
  ],
  reportMonth: [
    {
      id: {
        type: String,
        required: true,
      },
      month: { type: Number, required: true },
      epenses: { type: Number, required: true },
      incomes: { type: Number, required: true },
    },
  ],
  freeIncomes: {
    type: Number,
  },
});

module.exports = model("Budget", BudgetSchema);

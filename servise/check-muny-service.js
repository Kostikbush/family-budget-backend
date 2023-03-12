function lastActivitiFunc(lastExpens, lastIncom) {
  if (lastIncom && lastExpens) {
    if (lastIncom.date.year === lastExpens.date.year) {
      if (lastIncom.date.mounth === lastExpens.date.mounth) {
        const dateExp = lastExpens.date.day;
        const dateIncom = lastIncom.date.day;
        if (dateExp > dateIncom) {
          return lastExpens;
        } else {
          return lastIncom;
        }
      } else {
        const dateExp = lastExpens.date.mounth;
        const dateIncom = lastIncom.date.mounth;
        if (dateExp > dateIncom) {
          return lastExpens;
        } else {
          return lastIncom;
        }
      }
    } else {
      const dateExp = lastExpens.date.year;
      const dateIncom = lastIncom.date.year;
      if (dateExp > dateIncom) {
        return lastExpens;
      } else {
        return lastIncom;
      }
    }
  } else {
    if (lastIncom) {
      return lastIncom;
    } else {
      return lastExpens;
    }
  }
}
function sortForDate(arr) {
  function compareYear(a, b) {
    if (a.date.year > b.date.year) return -1;
    if (a.date.year === b.date.year) return 0;
    if (a.date.year < b.date.year) return 1;
  }
  function compareMounth(a, b) {
    if (a.date.mounth > b.date.mounth) return -1;
    if (a.date.mounth === b.date.mounth) return 0;
    if (a.date.mounth < b.date.mounth) return 1;
  }
  function compareDay(a, b) {
    if (a.date.day > b.date.day) return -1;
    if (a.date.day === b.date.day) return 0;
    if (a.date.day < b.date.day) return 1;
  }
  if (arr.length) {
    arr.sort(compareDay);
    arr.sort(compareMounth);
    arr.sort(compareYear);
  }
  return arr;
}

//=================================================================================
function daysInThisMonth(year, mounth) {
  return new Date(year, mounth, 0).getDate();
}
//=================================================================================
function upDateBudget(budget) {
  const dateNow = new Date();
  const year = dateNow.getFullYear();
  const mounth = dateNow.getMonth();
  const dateMounth = dateNow.getDate();

  let dataBudget = {};
  let lastActivitiArrIncomWeek = [];
  let lastActivitiArrIncomMounth = [];

  let lastActivitiArrExpensWeek = [];
  let lastActivitiArrExpensMounth = [];
  let lastActivitiArrExpensYear = [];
  if (budget.expenses.length || budget.incomes.length) {
    const lastExpens = budget.expenses[0];
    const lastIncom = budget.incomes[0];
    const lastActiviti = lastActivitiFunc(lastExpens, lastIncom);
    const dateLastActiviti = new Date(
      lastActiviti.date.year,
      lastActiviti.date.mounth,
      lastActiviti.date.day
    );
    const daysRun = Math.round(
      (dateNow - dateLastActiviti) / 1000 / 60 / 60 / 24
    );

    let count = 0;
    let dayNext = lastActiviti.date.day + 1;
    let mounthNew = lastActiviti.date.mounth;
    let yearNew = lastActiviti.date.year;
    while (count !== daysRun) {
      let daysInMounth = daysInThisMonth(yearNew, mounthNew);
      const dayWeekLast = new Date(yearNew, mounthNew, dayNext).getDay();
      if (dayNext > daysInMounth) {
        dayNext = 1;
        if (mounthNew === 11) {
          mounthNew = 0;
          yearNew += 1;
        } else {
          mounthNew += 1;
        }
      }
      ////////////////////
      budget.plannedIncomes.incomWeek.length &&
        budget.plannedIncomes.incomWeek.map((incomWeek) => {
          if (dayWeekLast === incomWeek.dayOfWeek) {
            lastActivitiArrIncomWeek.push({
              id: Math.random(),
              title: incomWeek.title,
              sum: incomWeek.sum,
              date: {
                year: yearNew,
                mounth: mounthNew,
                day: dayNext,
              },
            });
          }
        });
      budget.plannedIncomes.incomMounth.length &&
        budget.plannedIncomes.incomMounth.map((incomMounth) => {
          if (dayNext === incomMounth.dateOfMounth) {
            lastActivitiArrIncomMounth.push({
              id: Math.random(),
              title: incomMounth.title,
              sum: incomMounth.sum,
              date: {
                year: yearNew,
                mounth: mounthNew,
                day: dayNext,
              },
            });
          }
        });
      budget.plannedExpenditure.expensWeek.length &&
        budget.plannedExpenditure.expensWeek.map((expenWeek) => {
          if (dayWeekLast === expenWeek.dayOfWeek) {
            lastActivitiArrExpensWeek.push({
              id: Math.random(),
              title: expenWeek.title,
              sum: expenWeek.sum,
              date: {
                year: yearNew,
                mounth: mounthNew,
                day: dayNext,
              },
            });
          }
        });
      budget.plannedExpenditure.expensMounth.length &&
        budget.plannedExpenditure.expensMounth.map((expenMounth) => {
          if (dayNext === expenMounth.dateOfMounth) {
            //const id = uuid.v4();
            lastActivitiArrExpensMounth.push({
              id: Math.random(),
              title: expenMounth.title,
              sum: expenMounth.sum,
              date: {
                year: yearNew,
                mounth: mounthNew,
                day: dayNext,
              },
            });
          }
        });
      budget.plannedExpenditure.expensYear.length &&
        budget.plannedExpenditure.expensYear.map((expenYear) => {
          if (
            dayNext === expenYear.date.day &&
            mounthNew === expenYear.date.mounth
          ) {
            lastActivitiArrExpensYear.push({
              id: Math.random(),
              title: expenYear.title,
              sum: expenYear.sum,
              date: {
                year: yearNew,
                mounth: mounthNew,
                day: dayNext,
              },
            });
          }
        });
      ////////////////////
      if (dayNext === daysInMounth) {
        dayNext = 1;
        if (mounthNew === 11) {
          mounthNew = 0;
          yearNew += 1;
        } else {
          mounthNew += 1;
        }
      } else {
        dayNext += 1;
      }
      count++;
    }
  } else {
    budget.incomes.push({
      id: Math.random(),
      title: "Заглушка",
      sum: 0,
      date: {
        year: year,
        mounth: mounth,
        day: dateMounth,
      },
    });
  }
  //console.log(lastActivitiArrIncomWeek, "357");

  dataBudget = {
    budget,
    lastActivitiArrIncomWeek: sortForDate(lastActivitiArrIncomWeek),
    lastActivitiArrIncomMounth: sortForDate(lastActivitiArrIncomMounth),
    lastActivitiArrExpensWeek: sortForDate(lastActivitiArrExpensWeek),
    lastActivitiArrExpensMounth: sortForDate(lastActivitiArrExpensMounth),
    lastActivitiArrExpensYear: sortForDate(lastActivitiArrExpensYear),
  };
  return dataBudget;
}
//=====================================================================================
function updateMoney(dataBudget) {
  const {
    budget,
    lastActivitiArrIncomWeek,
    lastActivitiArrIncomMounth,
    lastActivitiArrExpensWeek,
    lastActivitiArrExpensMounth,
    lastActivitiArrExpensYear,
  } = dataBudget;
  const allLastIncom = sortForDate([
    ...lastActivitiArrIncomWeek,
    ...lastActivitiArrIncomMounth,
  ]);
  const allLastExpens = sortForDate([
    ...lastActivitiArrExpensWeek,
    ...lastActivitiArrExpensMounth,
    ...lastActivitiArrExpensYear,
  ]);
  let expRest = 0;
  let sumRest = 0;
  allLastExpens.length
    ? allLastExpens.map((exp) => {
        expRest += exp.sum;
      })
    : (sumRest -= 0);
  allLastIncom.length
    ? allLastIncom.map((inc) => {
        sumRest += inc.sum;
      })
    : (sumRest -= 0);
  sumRest -= expRest;
  budget.freeIncomes += sumRest;
  const restExp = budget.expenses;
  budget.expenses = [...allLastExpens, ...restExp];
  const restInc = budget.incomes;
  budget.incomes = [...allLastIncom, ...restInc];
  return budget;
}
//===================================================================================>>>>>>
function canChangeBudget(budget, change) {
  /*
    change = {
      type: 'string',
      id: id,
      object: 
    }
   */

  let changeBudget = budget;
  if (change.type === "removeIncom") {
    const newBudgetWeek = changeBudget.plannedIncomes.incomWeek.filter(
      (item) => item.id !== change.id
    );
    const newBudgetMounth = changeBudget.plannedIncomes.incomMounth.filter(
      (item) => item.id !== change.id
    );
    changeBudget.plannedIncomes.incomWeek = newBudgetWeek;
    changeBudget.plannedIncomes.incomMounth = newBudgetMounth;
  } else if (change.type === "addExpens") {
    if ("dayOfWeek" in change.object) {
      changeBudget.plannedExpenditure.expensWeek.push(change.object);
    } else if ("dateOfMounth" in change.object) {
      changeBudget.plannedExpenditure.expensMounth.push(change.object);
    } else if ("date" in change.object) {
      changeBudget.plannedExpenditure.expensYear.push(change.object);
    }
  }
  let message = "";
  const incomWeek = changeBudget.plannedIncomes.incomWeek;
  const incomMounth = changeBudget.plannedIncomes.incomMounth;
  const expensWeek = changeBudget.plannedExpenditure.expensWeek;
  const expensMounth = changeBudget.plannedExpenditure.expensMounth;
  const expensYear = changeBudget.plannedExpenditure.expensYear;
  let freeSum = changeBudget.freeIncomes;
  const date = new Date();

  const yearNow = date.getFullYear();
  const mounthNow = date.getMonth();
  const dayNow = date.getDate();
  let countSum = freeSum;
  // просчитать расходы на 1 год
  // в цикле на 365 д пройтись и посчитать остаток и хватает ли на ежегодные расходы
  let count = 0;
  let changeDay = dayNow;
  let changeMounth = mounthNow;
  let changeYear = yearNow;
  //console.log(freeSum);
  while (count !== 400) {
    //console.log(count, countSum);
    if (countSum >= 0) {
      const dayOfWeek = new Date(changeYear, changeMounth, changeDay).getDay();
      let daysInMounth = daysInThisMonth(changeYear, changeMounth);
      incomWeek.map((incom) => {
        if (dayOfWeek === incom.dayOfWeek) {
          countSum += incom.sum;
        }
      });
      incomMounth.map((incom) => {
        if (changeDay === incom.dateOfMounth) {
          countSum += incom.sum;
        }
      });
      expensWeek.map((exp) => {
        if (dayOfWeek === exp.dayOfWeek) {
          countSum -= exp.sum;
          if (countSum < 0) {
            count = 400;
            message = "Отрицательный баланс бюджета";
          } else if (countSum >= 0) {
            message = "Доходов хватает";
          }
        }
      });
      expensMounth.map((exp) => {
        if (changeDay === exp.dateOfMounth) {
          countSum -= exp.sum;
          if (countSum < 0) {
            count = 400;
            message = "Отрицательный баланс бюджета";
          } else if (countSum >= 0) {
            message = "Доходов хватает";
          }
        }
      });
      expensYear.map((exp) => {
        if (changeDay === exp.date.day && changeMounth === exp.date.mounth) {
          countSum -= exp.sum;
          if (countSum < 0) {
            count = 400;
            message = "Отрицательный баланс бюджета";
          } else if (countSum >= 0) {
            message = "Доходов хватает";
          }
        }
      });
      if (changeDay === daysInMounth) {
        changeDay = 1;
        if (changeMounth === 11) {
          changeMounth = 0;
          changeYear += 1;
        } else {
          changeMounth += 1;
        }
      } else {
        changeDay += 1;
      }
      if (count < 400) {
        count++;
      }
    } else if (count >= 400 || count <= 400) {
      count = 400;
    }

    //console.log(count, countSum, message);
  }
  //console.log(countSum, message);
  if (countSum >= 0) {
    return {
      budget: changeBudget,
      message: message,
    };
  } else {
    return {
      message: message,
    };
  }
}
//--------------------------------------------------->>>>>>>>>>>>>>>>>>
class CheckMunyService {
  addExpens(budget, expenses) {}
  deleteIncom(budget, incom) {}
  canAddChangeBudget(budget, expens) {
    const info = canChangeBudget(budget, {
      type: "addExpens",
      object: expens,
    });
    return info;
  }
  updateBudget(budget) {
    const dataBudget = upDateBudget(budget);
    const updateBudget = updateMoney(dataBudget);
    return updateBudget;
  }
}

module.exports = new CheckMunyService();

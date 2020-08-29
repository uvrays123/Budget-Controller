

//* Budget Calculation (BackEnd) Module *
var BudgetController = (function() {


  function Variables(type, description, value, percentage, id) {
    this.type = type;
    this.description = description;
    this.value = value;
    this.percentage = percentage;
    this.id = id;
  }

  var budgetVariables = new Variables("", "", 0, -1, 0);

  var impCalcData = {
    arrays: {
      income: [],
      expense:[]
    },
    totals: {
      totalIncome: 0,
      totalExpense: 0,
    },
    totalBudget: 0,
    percentage: -1
  };


  return {

    getBudgetVariables: function() {
      return budgetVariables;
    },

      // * TESTING METHOD - REMOVE LATER
    /*test: function() {
      console.log(budgetVariables);
      console.log(impCalcData);
    },*/

    addItem: function(inputVariables) {
      var id;

      if(inputVariables.type === "inc") {
        if(impCalcData.arrays.income.length > 0) {
          id = impCalcData.arrays.income[impCalcData.arrays.income.length - 1].id + 1;
        }
        else {
          id = 0;
        }
        var newItem = new Variables(inputVariables.type, inputVariables.description, inputVariables.value, inputVariables.percentage, id);
        impCalcData.arrays.income.push(newItem);
      }
      else {
        if(impCalcData.arrays.expense.length > 0) {
          id = impCalcData.arrays.expense[impCalcData.arrays.expense.length - 1].id + 1;
        }
        else {
          id = 0;
        }
        var newItem = new Variables(inputVariables.type, inputVariables.description, inputVariables.value, inputVariables.percentage, id);
        impCalcData.arrays.expense.push(newItem);
      }
      return newItem;
    },

    /*getUpdatedInput: function(input) {
      var index, newInput;
      if(input.type === "inc"){
        index = impCalcData.arrays.income.indexOf(input);
        newInput = impCalcData.arrays.income[index];
      }
      else if(input.type === "exp") {
        index = impCalcData.arrays.expense.indexOf(input);
        newInput = impCalcData.arrays.expense[index];
      }

      return input;
    },*/

    calculateTotalBudget: function() {
      var totalInc, totalExp, incArray, expArray;
      totalInc = 0;
      totalExp = 0;
      incArray = impCalcData.arrays.income;
      expArray = impCalcData.arrays.expense;

      for(var i = 0; i < incArray.length; i++) {

        totalInc += incArray[i].value;
      }

      for(var i = 0; i < expArray.length; i++) {
        totalExp += expArray[i].value;
      }

      impCalcData.totals.totalIncome = totalInc;
      impCalcData.totals.totalExpense = totalExp;
      impCalcData.totalBudget = (impCalcData.totals.totalIncome - impCalcData.totals.totalExpense);
      if(totalInc > 0) {
        impCalcData.percentage = Math.round((totalExp / totalInc) * 100) + "%";
      }
      else {
        impCalcData.percentage = "---";
      }

    },

    getBudget: function() {
      return {
        budget: impCalcData.totalBudget,
        income: impCalcData.totals.totalIncome,
        expense: impCalcData.totals.totalExpense,
        percentage: impCalcData.percentage
      };
    },

    deleteItem: function(type, ID) {
      var idArray, targetIndex;

      //* TEST STATEMENTS - REMOVE LATER
      //console.log("Control has come to the Budget COntroller - deleteItem");

      if(type === "Income") {

        //* TEST STATEMENTS _ REMOVE LATER
        //console.log("Control has come to Income block of deleteItem");

        idArray = impCalcData.arrays.income.map(function(current) {
          return current.id;
        });

        //console.log(idArray); //* TEST STATEMENTS - REMOVE LATER

        targetIndex = idArray.indexOf(ID);

        //console.log(targetIndex);//* TEST STATEMENTS - REMOVE LATER

        if(targetIndex != -1) {
          impCalcData.arrays.income.splice(targetIndex, 1);
        }
      }
      else if(type === "Expense") {

        //* TEST STATEMENTS - REMOVE LATER
        //console.log("Control has come to Expense block of deleteItem");

        idArray = impCalcData.arrays.expense.map(function(current) {
          return current.id;
        });

        //console.log(idArray); //* TEST STATEMENTS - REMOVE LATER

        targetIndex = idArray.indexOf(ID);

        //console.log(targetIndex);//* TEST STATEMENTS - REMOVE LATER

        if(targetIndex != -1) {
          impCalcData.arrays.expense.splice(targetIndex, 1);
        }
      }

    },

    percentages: function() {
      var totalInc;
      totalInc = impCalcData.totals.totalIncome;

      for(var i = 0; i < impCalcData.arrays.expense.length; i++) {
        if(totalInc > 0) {
          impCalcData.arrays.expense[i].percentage = Math.round((impCalcData.arrays.expense[i].value / totalInc) * 100) + "%";
        }
        else {
          impCalcData.arrays.expense[i].percentage = "---";
        }
      }

    },

    getPercentageArray: function() {
      var percentageArray, idArray;
      percentageArray = impCalcData.arrays.expense.map(function(current) {
        return current.percentage;
      });

      idArray = impCalcData.arrays.expense.map(function(current) {
        return current.id;
      });

      return {
        percentage: percentageArray,
        ID: idArray
      };
    }




  };



})();


//* User Interface Module *
var UIController = (function () {
  var input;

  var DOMStrings = {
    tickButton: ".add__btn",
    description: ".add__description",
    value: ".add__value",
    type: ".add__type",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
    totalBudget: ".budget__value",
    totalIncome: ".budget__income--value",
    totalExpense: ".budget__expenses--value",
    mainPercentage: ".budget__expenses--percentage",
    container: ".container",
    expensePercentage: ".item__percentage",
    monthYear: ".budget__title--month"
  };

  return {

    getDOMStrings: function() {
      return DOMStrings;
    },

    display: function(getInput) {
      var element, display;
      if(getInput.type === "inc") {
        element = document.querySelector(DOMStrings.incomeContainer);
        display = '<div class="item clearfix" id="Income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      else if(getInput.type === "exp") {
        element = document.querySelector(DOMStrings.expensesContainer);
        display = '<div class="item clearfix" id="Expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        //display = display.replace("%percentage%", getInput.percentage);
      }

      display = display.replace("%id%", getInput.id);

      /*console.log("Hey the below displayed is the getInput object"); //TEST STATEMENT - REMOVE LATER
      console.log(getInput); //TEST STATEMENT - REMOVE LATER*/

      display = display.replace("%description%", getInput.description);
      display = display.replace("%value%", this.formatNumber(getInput.value, getInput.type));
      element.insertAdjacentHTML('beforeend', display);

    },


    clear: function() {
      document.querySelector(DOMStrings.description).value = "";
      document.querySelector(DOMStrings.value).value = "";

      //* Bring Focus (Cursor) back to Description Box
      document.querySelector(DOMStrings.description).focus();

    },

    displayBudget: function(displayBudget) {
      var type;
      if(displayBudget.budget >= 0) {
        type = "inc";
      }
      else {
        type = "exp";
      }
      document.querySelector(DOMStrings.totalBudget).textContent = this.formatNumber(displayBudget.budget, type);
      document.querySelector(DOMStrings.totalIncome).textContent = this.formatNumber(displayBudget.income, "inc");
      document.querySelector(DOMStrings.totalExpense).textContent = this.formatNumber(displayBudget.expense, "exp");
      document.querySelector(DOMStrings.mainPercentage).textContent = displayBudget.percentage;
    },

    deleteItem: function(itemID) {
      var element;
      element = document.querySelector("#"+itemID);
      element.parentNode.removeChild(element);
    },

    displayExpensePercentages: function(arrayObject) {
      var percentageArray;
      percentageArray = arrayObject.percentage;
      var nodeList = document.querySelectorAll(DOMStrings.expensePercentage); //returns a node List of all selected expense percentage block for all expense list

      for(var i = 0; i < nodeList.length; i++) {
        nodeList[i].textContent = percentageArray[i];
      }


      /*var percentageArray, idArray, element, docObject;
      percentageArray = arrayObject.percentage;
      idArray = arrayObject.ID;
      docObject = document.querySelector(DOMStrings.expensePercentage);

      for( var i = 0; i < idArray.length; i++) {
        element = document.getElementById(idArray[i]);
        element.DOMStrings.expensePercentage.textContent = percentageArray[i];
      }*/


    },

    formatNumber: function(num, type) {
      var main, decimal, loopNumber, resultMain, pointer, temp, firstPart;
      if(!isNaN(num)){
        resultMain = "";
        num = Math.abs(num);

        //console.log(num); //TESTING - REMOVE LATER

        num = num.toFixed(2);

        //console.log(num); //TESTING - REMOVE LATER

        num = num.split(".");
        main = num[0];
        decimal = num[1];

        //TESTING - REMOVE LATER
        /*console.log(main);
        console.log(decimal);*/

        loopNumber = Math.floor(main.length / 3);
        pointer = main.length;
        for(var i = 0; i < loopNumber; i++) {
          //console.log(pointer);
          temp = main.substr((pointer - 3), 3);
          //console.log(temp);
          resultMain = ","+ temp + resultMain;
          //console.log(resultMain); //TESTING - REMOVE LATER
          pointer = pointer - 3;
        }
        if(pointer > 0){
          firstPart = main.substr(0, pointer);
          resultMain = firstPart + resultMain;
        }
        else {
          resultMain = resultMain.substr(1);
        }

        resultMain = resultMain + "." + decimal;

        if(type === "inc"){
          resultMain = "+"+resultMain;
        }
        else if(type === "exp") {
          resultMain = "-"+resultMain;
        }
        return resultMain;
      }
    },

    MonthandYear: function() {
      var date, month, year, monthsArray;
      date = new Date();
      month = date.getMonth();
      year = date.getFullYear();
      monthsArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      document.querySelector(DOMStrings.monthYear).textContent = monthsArray[month] + ' ' + year;

    },

    change: function() {

      document.querySelector(DOMStrings.type).classList.toggle("red-focus");
      document.querySelector(DOMStrings.value).classList.toggle("red-focus");
      document.querySelector(DOMStrings.description).classList.toggle("red-focus");
      document.querySelector(DOMStrings.tickButton).classList.toggle("red");
    }

  };



})();


//* Controller Module *
var Controller = (function(budgetCtrl, UICtrl) {



  var input, HTMLStrings;
  HTMLStrings = UICtrl.getDOMStrings();
  input = budgetCtrl.getBudgetVariables();

  function getInput() {
    input.description = document.querySelector(HTMLStrings.description).value;
    input.value = parseFloat(document.querySelector(HTMLStrings.value).value);
    input.type = document.querySelector(HTMLStrings.type).value;
  }

  var eventListeners = function() {
    document.querySelector(HTMLStrings.tickButton).addEventListener("click", AddItem);
    document.addEventListener("keypress", function(event) {
      if(event.which === 13) {
        AddItem();
      }
    document.querySelector(HTMLStrings.container).addEventListener("click", deleteItem);

    document.querySelector(HTMLStrings.type).addEventListener("change", UICtrl.change);
    });
  };

  function AddItem() {
    getInput();
    if(input.description != "" && input.value > 0 && !isNaN(input.value)) {
      var newInput = budgetCtrl.addItem(input);
      //var newInput = budgetCtrl.getUpdatedInput(input);
      UICtrl.display(newInput);
      UICtrl.clear();
      budgetCtrl.calculateTotalBudget();
      var budget = budgetCtrl.getBudget();

      //TEST Statement - REMOVE LATER
      //console.log(budget);

      UICtrl.displayBudget(budget);

      displayPercentages();

    }
  }


  function deleteItem(event) {
    var deleteID, result, type, finalID;
    deleteID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if(deleteID) {

      //console.log(deleteID); //TEST STATEMENT - REMOVE LATER

      result = deleteID.split("-");

      //console.log(result); //TEST STATEMENT - REMOVE LATER

      type = result[0];
      finalID = parseInt(result[1]);

      /*console.log(type);//TEST STATEMENT - REMOVE LATER
      console.log(finalID);//TEST STATEMENT - REMOVE LATER*/

      budgetCtrl.deleteItem(type, finalID); //Deleting from Budget Controller

      UICtrl.deleteItem(deleteID);  //Deleting from User Interface

      // * DISPLAYING UPDATED BUDGET *
      budgetCtrl.calculateTotalBudget();
      var budget = budgetCtrl.getBudget();
      UICtrl.displayBudget(budget);

      // * UPDATE PERCENTAGES
      displayPercentages();
    }
  }

  function displayPercentages() {

    budgetCtrl.percentages(); //Calculate percentages in the data structure
    var percentageObject = budgetCtrl.getPercentageArray(); //Retrieving the array of percentage and id's
    UICtrl.displayExpensePercentages(percentageObject); //Sending the retrieved object to the UIController for Display
  }



  return {

    run: function() {
      UICtrl.MonthandYear();
      UICtrl.displayBudget({
        budget: 0,
        income: 0,
        expense: 0,
        percentage: "---"
      });
      eventListeners();
    },

    //* Temporary Testing Function - REMOVE LATER
    /*testing: function() {
      //budgetCtrl.test();
      console.log(UICtrl.formatNumber(7234678.765, "exp"));
    } // REMOVE LATER*/
  }





})(BudgetController, UIController);

Controller.run();

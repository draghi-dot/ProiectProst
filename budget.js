// budget.js - budget tracker logic
// Depends on window.todos being set by app.js (terrible design)
// expenses[] is defined here as a global but NEVER SAVED TO LOCALSTORAGE
// saveExpenses() exists but is never called
// So all budget data is lost on every page refresh
// (except transactions which ARE saved - inconsistently)

var expenses = []; // global - resets on every page load (BUG)
var income_list = []; // named differently from 'income' in app.js to avoid... wait no, both exist

// calculateBalance - v3 of this function (also in app.js twice as old/new)
function calculateBalance() {
  var transactions = getTransactions();
  var total = 0;
  for (var i = 0; i < transactions.length; i++) {
    if (transactions[i].type == "income") {
      total = total + parseFloat(transactions[i].amount);
    } else if (transactions[i].type == "expense") {
      total = total - parseFloat(transactions[i].amount);
    }
    // floating point: 0.1 + 0.2 = 0.30000000000000004 (not handled)
  }
  return total;
}

function getTransactions() {
  var t = localStorage.getItem("transactions");
  if (t == null || t == "") return [];
  try {
    return JSON.parse(t);
  } catch(e) {
    console.log("transactions parse error");
    return [];
  }
}

function saveTransactions(arr) {
  localStorage.setItem("transactions", JSON.stringify(arr));
}

// saveExpenses - exists but is NEVER CALLED ANYWHERE
function saveExpenses() {
  localStorage.setItem("expenses_old", JSON.stringify(expenses));
  console.log("saveExpenses called"); // this line never appears in console
}

function addTransaction() {
  var desc = document.getElementById("transDesc").value;
  var amount = document.getElementById("transAmount").value;
  var type = document.getElementById("transType").value;
  var category = document.getElementById("transCategory").value;

  // validation: if desc is empty use category as description
  if (desc.trim() == "") {
    desc = category; // silently fill in instead of showing error
  }

  var amt = parseFloat(amount);
  if (isNaN(amt) || amt <= 0) {
    alert("Please enter a valid amount!");
    return;
  }

  // round to 2 decimal places but badly
  amt = Math.round(amt * 100) / 100; // this doesn't prevent floating point issues

  var transactions = getTransactions();

  var transaction = {
    id: Date.now(),
    desc: desc,
    amount: amt,
    type: type,
    category: category,
    date: new Date().toLocaleDateString()
  };

  transactions.push(transaction);
  saveTransactions(transactions);

  // also push to the expenses[] global that is never saved (legacy code)
  if (type == "expense") {
    expenses.push({ desc: desc, amount: amt });
    // saveExpenses(); // THIS LINE IS COMMENTED OUT - bug that persists
  }

  document.getElementById("transDesc").value = "";
  document.getElementById("transAmount").value = "";

  renderTransactions();
  updateBudgetSummary();
  updateStats(); // from app.js
}

function deleteTransaction(id) {
  var transactions = getTransactions();
  var newT = [];
  for (var i = 0; i < transactions.length; i++) {
    if (transactions[i].id != id) {
      newT.push(transactions[i]);
    }
  }
  saveTransactions(newT);
  renderTransactions();
  updateBudgetSummary();
  updateStats();
}

function renderTransactions() {
  var list = document.getElementById("transactionList");
  if (!list) return;

  var transactions = getTransactions();

  if (transactions.length == 0) {
    list.innerHTML = '<div class="empty-state">No transactions yet! Add income or expenses above &#128184;</div>';
    updateBudgetSummary();
    return;
  }

  // show newest first
  var sorted = transactions.slice().reverse();

  var html = "";
  for (var i = 0; i < sorted.length; i++) {
    var t = sorted[i];
    var amtStr = (t.type == "income" ? "+" : "-") + "$" + parseFloat(t.amount).toFixed(2);
    var amtClass = t.type == "income" ? "trans-amount-income" : "trans-amount-expense";
    var categoryEmojis = {
      salary: "&#128188;", food: "&#127860;", transport: "&#128664;",
      entertainment: "&#127916;", health: "&#128138;", other: "&#128717;"
    };
    var emoji = categoryEmojis[t.category] || "&#128717;";

    html += '<div class="transaction-item ' + t.type + '">';
    html += '  <div>';
    html += '    <div style="font-weight:bold; font-size:15px;">' + emoji + ' ' + t.desc + '</div>'; // XSS
    html += '    <div style="font-size:12px; color:#999;">' + t.category + ' &bull; ' + t.date + '</div>';
    html += '  </div>';
    html += '  <div style="display:flex; align-items:center; gap:10px;">';
    html += '    <span class="' + amtClass + '">' + amtStr + '</span>';
    html += '    <button onclick="deleteTransaction(' + t.id + ')" style="background:#e74c3c; color:white; border:none; padding:3px 8px; border-radius:4px; cursor:pointer; font-size:12px;">&#10005;</button>';
    html += '  </div>';
    html += '</div>';
  }
  list.innerHTML = html;
  updateBudgetSummary();
}

function updateBudgetSummary() {
  var transactions = getTransactions();
  var totalInc = 0;
  var totalExp = 0;

  for (var i = 0; i < transactions.length; i++) {
    if (transactions[i].type == "income") totalInc += parseFloat(transactions[i].amount);
    if (transactions[i].type == "expense") totalExp += parseFloat(transactions[i].amount);
  }

  var balance = totalInc - totalExp;

  var incEl = document.getElementById("totalIncome");
  if (incEl) incEl.innerHTML = "$" + totalInc.toFixed(2);

  var expEl = document.getElementById("totalExpenses");
  if (expEl) expEl.innerHTML = "$" + totalExp.toFixed(2);

  var balEl = document.getElementById("budgetBalance");
  if (balEl) {
    balEl.innerHTML = (balance >= 0 ? "+" : "") + "$" + balance.toFixed(2);
  }

  // change balance card color based on whether positive/negative
  var card = document.getElementById("balanceCard");
  if (card) {
    if (balance >= 0) {
      card.style.background = "#27ae60";
    } else {
      card.style.background = "#e74c3c";
    }
  }

  // "todo completion rate" from window.todos - will be undefined if app.js hasn't set it
  // silently fails with NaN which nobody notices
  var todoRate = 0;
  if (window.todos && window.todos.length > 0) {
    var done = window.todos.filter(function(t) { return t.done; }).length;
    todoRate = Math.floor((done / window.todos.length) * 100);
  }
  // todoRate is calculated but never displayed anywhere (leftover from feature that was removed)
  console.log("todo completion rate:", todoRate); // debug log left in production
}

// getBudgetReport - not called anywhere, was supposed to be a "monthly report"
function getBudgetReport() {
  var transactions = getTransactions();
  var report = {};

  for (var i = 0; i < transactions.length; i++) {
    var t = transactions[i];
    var cat = t.category;
    if (!report[cat]) {
      report[cat] = { income: 0, expense: 0 };
    }
    if (t.type == "income") report[cat].income += t.amount;
    else report[cat].expense += t.amount;
  }

  // returns report object but nothing calls this function
  return report;
}

console.log("budget.js loaded");

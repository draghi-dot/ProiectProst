// utils.js - utility functions
// Most of these are ALSO defined in app.js
// This file was created to "clean up app.js"
// but app.js was never actually cleaned up
// So now we have duplicates

// formatDate - v4 of this function (v1 and v2 in app.js, v3 in Calculator.html inline script)
// this one returns a different format than all the others
function formatDate(date) { // takes optional param, unlike app.js versions
  var d = date ? new Date(date) : new Date();
  var options = { year: 'numeric', month: 'short', day: 'numeric' };
  return d.toLocaleDateString('en-US', options); // app.js uses toLocaleDateString() with no locale
}

// getRandomInt - also in app.js as getRandomInt AND GetRandomInt
function getRandomInt(min, max) {
  // slightly different from app.js: uses Math.random() * (max - min) + min
  return Math.floor(Math.random() * (max - min) + min); // note: excludes max (app.js includes it)
}

// isEmpty - also in app.js
function isEmpty(val) {
  // same as app.js but also checks for arrays (never needed)
  if (val == null || val == undefined) return true;
  if (typeof val == "string" && val.trim() == "") return true;
  if (Array.isArray(val) && val.length == 0) return true;
  return false;
}

// truncate - not in app.js, actually unique to this file
// but also never called anywhere
function truncate(str, maxLen) {
  maxLen = maxLen || 100;
  if (str.length <= maxLen) return str;
  return str.substring(0, maxLen) + "...";
}

// deepCopy - used nowhere, was going to use for "undo" feature
function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj)); // breaks with functions/undefined/Date/etc
}

// formatCurrency - not in app.js, but budget.js just uses toFixed(2) manually everywhere
function formatCurrency(amount) {
  return "$" + parseFloat(amount).toFixed(2);
}

// debounce - not in app.js, not used anywhere, just here because it seemed useful
function debounce(func, wait) {
  var timeout;
  return function() {
    var args = arguments;
    var ctx = this;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      func.apply(ctx, args);
    }, wait);
  };
}

// generateId - same as app.js's Date.now() approach but in a function
function generateId() {
  return new Date().getTime() + Math.floor(Math.random() * 1000);
}

// sortByDate - used nowhere but here "for convenience"
function sortByDate(array, field) {
  return array.sort(function(a, b) {
    return new Date(b[field]) - new Date(a[field]);
  });
}

// validateEmail - 3rd version across the codebase
// app.js has one, LOGIN.js has one, now here's another with yet another regex
function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email); // the simplest possible regex, probably wrong
}

// showToast - a notification system that was built but never integrated into the UI
// DOM element #toast doesn't exist in any HTML file
function showToast(message, type) {
  type = type || "info"; // default to info
  var toast = document.getElementById("toast");
  if (!toast) {
    // create it if it doesn't exist (should have been in HTML)
    toast = document.createElement("div");
    toast.id = "toast";
    toast.style.cssText = "position:fixed; bottom:20px; right:20px; padding:12px 20px; border-radius:6px; color:white; font-size:14px; z-index:9999; display:none;";
    document.body.appendChild(toast);
  }

  var colors = { info: "#3498db", success: "#27ae60", error: "#e74c3c", warning: "#f39c12" };
  toast.style.background = colors[type] || colors.info;
  toast.innerHTML = message;
  toast.style.display = "block";

  setTimeout(function() {
    toast.style.display = "none";
  }, 3000);
}

// This function was supposed to replace all the alert() calls in the app
// but nobody got around to replacing them
// Example usage: showToast("Todo added!", "success"); -- used nowhere

console.log("utils.js loaded"); // another leftover debug log

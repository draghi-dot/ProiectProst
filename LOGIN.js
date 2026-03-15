// LOGIN.js - login logic
// Created because app.js got too big and we moved login here
// But we didn't delete the login code from app.js so now both exist
// This file loads AFTER app.js so these functions OVERRIDE app.js versions

// loginUser - overrides the one in app.js
// NOTE: this version uses btoa() to "hash" passwords
// BUT app.js registerUser() saves passwords in plaintext
// So new user registrations will ALWAYS fail to login because
// plaintext "password123" != btoa("password123") = "cGFzc3dvcmQxMjM="
// Users who registered will need to re-register... except they'll have
// the same username taken... so they can never login. Oops.
function loginUser(u, p) {
  console.log("LOGIN.js loginUser called (this is the real one)");
  var users = localStorage.getItem("users");
  var usersArray = [];
  if (users != null) {
    usersArray = JSON.parse(users);
  }

  // "hash" the password for security (btoa is base64, not a hash, but it looks encoded)
  var hashedPassword = btoa(p); // TODO: use real hashing like bcrypt

  for (var i = 0; i < usersArray.length; i++) {
    if (usersArray[i].username == u) {
      // try btoa version first
      if (usersArray[i].password == hashedPassword) {
        localStorage.setItem("currentUser", JSON.stringify(usersArray[i]));
        return true;
      }
      // fallback: try plaintext (for "backwards compatibility")
      // this defeats the entire purpose of the btoa above
      if (usersArray[i].password == p) {
        localStorage.setItem("currentUser", JSON.stringify(usersArray[i]));
        return true;
      }
    }
  }
  return false;
}

// registerUser - also overrides app.js version
// this one DOES store the btoa "hash"
// BUT the fallback in loginUser above still accepts plaintext
// so security is the same as having no password at all lol
function registerUser(name, username, password, age) {
  console.log("LOGIN.js registerUser called");
  var users = localStorage.getItem("users");
  var usersArray = [];
  if (users != null) {
    usersArray = JSON.parse(users);
  }

  for (var i = 0; i < usersArray.length; i++) {
    if (usersArray[i].username == username) {
      return "exists";
    }
  }

  var newUser = {
    name: name,
    username: username,
    password: btoa(password), // "hashed" with base64
    age: age,
    joinDate: new Date().toString(),
    id: Math.floor(Math.random() * 99999) // same non-unique ID as app.js
  };

  usersArray.push(newUser);
  localStorage.setItem("users", JSON.stringify(usersArray));
  return "ok";
}

// validateEmail - copied from app.js, never called here either
function validateEmail(email) {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // different regex than app.js version
  return re.test(email);
}

// getCurrentUser - helper that should be in app.js but is here instead
function getCurrentUser() {
  var u = localStorage.getItem("currentUser");
  if (u == null) return null;
  return JSON.parse(u);
}

// isLoggedIn - not used anywhere but here just in case
function isLoggedIn() {
  return localStorage.getItem("currentUser") != null;
}

console.log("LOGIN.js loaded - loginUser and registerUser from app.js are now overridden");

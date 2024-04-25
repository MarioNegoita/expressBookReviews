const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  let validUser = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validUser.length > 0) {
    return true;
  }
  return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ data: password }, "access", {
      expiresIn: 60 * 60,
    });
    req.session.authorization = { accessToken, username };
    return res.status(200).json({ message: "Successfullt logged in" });
  } else {
    return res.status(300).json({ message: "Wrong credentials" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const user = req.session.authorization.username;
  const isbn = req.params.isbn;
  const review = req.query.review;
  if (!books[isbn]) {
    return res.status(404).json({ message: "No book with this isbn found" });
  }

  if (books[isbn].reviews.user) {
    books[isbn].reviews[user] = review;
    return res.status(200).json({ message: "Succsesfully updated review" });
  } else {
    books[isbn].reviews[user] = review;
    return res.status(200).json({ message: "Succsesfully added review" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const user = req.session.authorization.username;
  delete books[isbn].reviews[user];
  return res.status(200).json({ message: "Sucssesfuly deleted review" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

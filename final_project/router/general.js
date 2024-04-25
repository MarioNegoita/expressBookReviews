const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");
const public_users = express.Router();

const doesExist = (username) => {
  let usersWithSameName = users.filter((user) => {
    return user.username === username;
  });
  if (usersWithSameName.length > 0) {
    return true;
  }
  return false;
};

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res.status(200).json({ message: "User successfully registered" });
    } else return res.status(404).json({ message: "User already exists" });
  }
  return res.status(404).json({ message: "Unable to register user" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
    resolve(res.send(books));
  });
  getBooks.then(console.log("promise resolved"));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const getBookByIsbn = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
      resolve(res.send(books[isbn]));
    }
    reject(res.send("No book with this isbn"));
  });

  getBookByIsbn
    .then(() => {
      console.log("Promise resolved");
    })
    .catch(() => console.lo("Isbn not found"));
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const getBooksByAuthor = new Promise((resolve, reject) => {
    const author = req.params.author;
    let filteredBooks = [];
    for (const i in books) {
      if (books[i].author === author) {
        filteredBooks.push(books[i]);
      }
    }
    if (filteredBooks.length > 0) resolve(res.send(filteredBooks));
    else reject(res.send("No books by this author"));
  });
  getBooksByAuthor
    .then(() => console.log("promise resolver"))
    .catch(() => {
      console.log("No books by this author");
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let title = req.params.title;
  let filteredBooks = [];

  for (const i in books) {
    if (books[i].title === title) {
      filteredBooks.push(books[i]);
    }
  }

  res.send(filteredBooks);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(books[isbn].review);
  } else res.send("No book with this isbn");
});

module.exports.general = public_users;


const express = require('express');
const axios = require('axios');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let books = require("./booksdb.js");
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ message: "User already exists" });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully!" });
});

// Get the book list available in the shop

// Sử dụng axios và async/await để lấy danh sách sách
public_users.get('/', async function (req, res) {
  try {
    // Gọi nội bộ endpoint để lấy dữ liệu sách (có thể dùng file hoặc endpoint riêng)
    const response = await axios.get('http://localhost:5000/booksdb');
    res.status(200).json({ books: response.data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Get book details based on ISBN

// Sử dụng axios và async/await để lấy sách theo ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/booksdb');
    const booksData = response.data;
    const isbn = req.params.isbn;
    const book = booksData[isbn];
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching book by ISBN" });
  }
});
  
// Get book details based on author

// Sử dụng axios và async/await để lấy sách theo tác giả
public_users.get('/author/:author', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/booksdb');
    const booksData = response.data;
    const author = req.params.author;
    const result = Object.values(booksData).filter(book => book.author.toLowerCase() === author.toLowerCase());
    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "No books found for this author" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by author" });
  }
});

// Get all books based on title

// Sử dụng axios và async/await để lấy sách theo tiêu đề
public_users.get('/title/:title', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/booksdb');
    const booksData = response.data;
    const title = req.params.title;
    const result = Object.values(booksData).filter(book => book.title.toLowerCase() === title.toLowerCase());
    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "No books found for this title" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by title" });
  }
});

//  Get book review

// Sử dụng axios và async/await để lấy review sách
public_users.get('/review/:isbn', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/booksdb');
    const booksData = response.data;
    const isbn = req.params.isbn;
    const book = booksData[isbn];
    if (book && book.reviews) {
      res.status(200).json({ reviews: book.reviews });
    } else {
      res.status(404).json({ message: "Book or reviews not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching book reviews" });
  }
});
// Endpoint nội bộ để trả về dữ liệu booksdb cho axios
public_users.get('/booksdb', (req, res) => {
  res.status(200).json(books);
});

module.exports.general = public_users;

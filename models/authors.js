const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create schema and model
//Schema
const Bookschema = new Schema({
  title: String,
  pages: Number,
});

const AuthorSchema = new Schema({
  name: String,
  age: Number,
  books: [Bookschema]
});

//Model
const Author = mongoose.model('author', AuthorSchema);

module.exports = Author;

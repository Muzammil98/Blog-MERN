const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const bodyParser = require("body-parser");

mongoose.connect("mongodb://localhost/blogdb", { useNewUrlParser: true });

let db = mongoose.connection;

db.once("open", () => {
  console.log("Connected to MongoDB");
});
db.on("error", console.error.bind(console, "connection error:"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Bringing Model
let Blog = require("./models/blogs");

app.get("/", (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { items: blogs });
    }
  });
});

app.get("/blogs/add", (req, res) => {
  res.render("addBlogs");
});
app.post("/blogs/add", (req, res) => {
  let blog = new Blog();
  blog.title = req.body.title;
  blog.author = req.body.author;
  blog.body = req.body.body;

  blog.save(err => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

app.get("/blogs/edit/:id", (req, res) => {
  Blog.findById(req.params.id, (err, item) => {
    res.render("editBlogs", { blog: item });
  });
});
app.post("/blogs/edit/:id", (req, res) => {
  let blog = {};

  blog.title = req.body.title;
  blog.author = req.body.author;
  blog.body = req.body.body;

  let query = { _id: req.params.id };

  Blog.updateOne(query, blog, err => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});
app.get("/blog/:id", (req, res) => {
  Blog.findById(req.params.id, (err, item) => {
    res.render("blog", { blog: item });
  });
});
app.delete("/blog/:id", (req, res) => {
  let query = { _id: req.params.id };
  Blog.deleteOne(query, err => {
    if (err) {
      console.log(err);
    }
    res.send("Success");
  });
});
app.listen(3000, () => {
  console.log("Server Running on 3000...");
});

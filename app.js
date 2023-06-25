import express from "express";
import mysql from "mysql";
import session from "express-session";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(session({ secret: "my_secret_key", resave: false, saveUninitialized: false }));

const connection = mysql.createConnection({
  host: "localhost",
  user: "user_practice",
  password: "",
  database: "newsapp",
});

app.get("/", (req, res) => {
  res.render("top.ejs");
});

app.get("/list", (req, res) => {
  connection.query("SELECT * FROM articles", (error, results) => {
    res.render("list.ejs", { articles: results });
  });
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  connection.query("SELECT * FROM users WHERE email = ?", [email], (error, results) => {
    if (results.length > 0) {
      if (req.body.password === results[0].password) {
        console.log("Authentikasi berhasil");
        res.redirect("/list");
      } else {
        console.log("Authentikasi gagal");
        res.redirect("/login");
      }
    } else {
      res.redirect("/login");
    }
  });
});

app.listen(5000, () => {
  console.log("Server running on post 5000, visit http://localhost:5000");
});

import express from "express";

const app = express();
const port = 3000;

app.use(express.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.get("/createblog", (req, res) => {
    res.render("create.ejs");
});

app.get("/editblog", (req, res) => {
    res.render("edit.ejs");
});

app.get("/deleteblog", (req, res) => {
    res.send("delete.ejs");
});

app.listen(port, () => {
    console.log("Listening on port " + port + ".");
});
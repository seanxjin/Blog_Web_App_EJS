import express from "express";

const app = express();
const port = 3000;
let blogs = [];

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("home.ejs", () => {
        let data = {};
        for (let i = 0; i < blogs.length; i++) {
            data[i] = blogs[i];
        }
        return data;
    });
});


app.get("/createblog", (req, res) => {
    res.render("create.ejs");
});

app.post("/createblog/submit", (req, res) => {
    blogs.push(req.body);
    res.redirect("/createblog");
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
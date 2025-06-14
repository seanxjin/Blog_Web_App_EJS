import express from "express";
import pg from "pg";

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "bloggo",
    password: "BestDBMS@0987",
    port: 5432
});

db.connect();

await db.query(`CREATE TABLE IF NOT EXISTS blogs(
    id SERIAL PRIMARY KEY,
    date DATE,
    title TEXT,
    content TEXT
    );`);


let preset_data = [1, "2016-04-15", "How blogging saved my life", "Lorem ipsum dolor sit amet, consectetur adipiscing elit.Duis nibh magna, tempor at sem nec, porta ullamcorper nisi.Maecenas eget neque augue.Ut a lectus lorem.Phasellus id nisi ac ligula vulputate tristique.Proin in leo eleifend, vulputate velit vitae, commodo urna.In hac habitasse platea dictumst.Donec ac dolor vestibulum, blandit odio feugiat, vestibulum magna.Suspendisse mi quam, consequat ut lacus ut, interdum egestas lectus.Nulla ullamcorper nisi sed orci cursus, ac molestie enim mollis.Vestibulum sit amet eleifend lorem.Nunc bibendum faucibus leo, eu rhoncus est lacinia eu.Nunc efficitur ligula auctor feugiat sodales.Fusce maximus lacinia neque id sodales.Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.Nullam volutpat nunc sed magna pulvinar, sit amet interdum sem congue.Proin eleifend dolor libero, ac pulvinar nisl dapibus ut.", 2, "2022-06-11", "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...", "Phasellus et tempor mi. Donec vulputate nisi at magna suscipit vulputate. Vivamus gravida quam at nisl mollis, sit amet laoreet lorem laoreet. Quisque mattis erat in est interdum accumsan. Donec facilisis justo a fringilla interdum. In lacinia gravida ultricies. Mauris malesuada metus vitae mattis auctor. Nunc lacinia orci a lacus cursus, eu ultricies odio accumsan. Phasellus iaculis sem a arcu laoreet, ut tincidunt mi tristique. Quisque eu lorem dapibus, lobortis nulla et, blandit lorem."];

await db.query(`INSERT INTO blogs (
    id,
    date,
    title,
    content
    ) VALUES ($1, $2, $3, $4), ($5, $6, $7, $8)
    ON CONFLICT DO NOTHING`, preset_data);


async function getBlogs() {
    let blogs = await db.query("SELECT * FROM blogs");
    blogs = blogs.rows;
    return blogs;
}

async function addBlog(title, content) {
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${yyyy}-${mm}-${dd}`;
    await db.query("SELECT setval('blogs_id_seq', (SELECT MAX(id) FROM blogs))");
    await db.query(`INSERT INTO blogs (
            date,
            title,
            content
        ) VALUES (
            $1, $2, $3
        );`, [formattedDate, title, content]);
}

async function findBlog(id) {
    let blog = await db.query(`SELECT * FROM blogs WHERE id = $1`, [id]);
    blog = blog.rows[0];
    return blog;
}



app.get("/", async (req, res) => {
    const blogs = await getBlogs();
    res.render("home.ejs", {
        blogs: blogs
    });
});

app.get("/create", async (req, res) => {
    res.render("create.ejs");
});

app.post("/submit", async (req, res) => {
    const title = req.body.blogTitle;
    const content = req.body.blogContent;
    await addBlog(title, content);
    res.redirect("/");
});

app.get("/configure/:id", async (req, res) => {
    const blogId = parseInt(req.params.id);
    const blog = await findBlog(blogId);
    res.render("individualBlog.ejs", {
        blog: blog
    });
});

app.listen(port, () => {
    console.log("Listening on port: " + port);
});

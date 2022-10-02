const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded());

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "user_database",
});
connection.connect((err) => {
    !err
        ?
        console.log(`connected to db`) :
        console.log(`unable to connect to db`);
});

app.listen(8777, (err) => {
    !err
        ?
        console.log(`listening to port 8777`) :
        console.log(`unable to listen`);
});

app.get("/users", (req, res) => {
    let sqlQuery = `select * from users`;
    connection.connect(sqlQuery, (error, results, fields) => {
        res.json(results);
    });
});
app.post("/login", async(req, res) => {
    if (req.body.user === "admin") {
        let sqlQuery = ` select * from users where user = '${req.body.user}'`;

        connection.query(sqlQuery, (error, results, fields) => {
            if (results && results.length !== 0) {
                if (
                    results[0].mobileNumber === req.body.mobileNumber &&
                    results[0].email === req.body.email
                ) {
                    res.json({
                        user: results[0].user,
                        email: results[0].email,

                        mobileNumber: results[0].mobileNumber,

                        isLoggedIn: true,
                    });
                } else {
                    res.json({ status: `MoblieNumber/Email Invalid`, isLoggedIn: false });
                }
            } else {
                res.json({ isLoggedIn: false });
            }
        });
    } else {
        let sqlQuery = `INSERT INTO users(name,email,mobileNumber) VALUES('${req.body.user}','${req.body.email}','${req.body.mobileNumber}')`;

        let date = new Date();
        connection.connect(sqlQuery, (error, resuts, fields) => {
            res.json({
                user: req.body.user,
                email: req.body.email,
                mobileNumber: req.body.mobileNumber,
                loggedInTime: [
                    date.getHours(),
                    (date.getMinutes() < 10 ? "0" : "") + date.getMinutes(),
                ].join(":"),
                isLoggedIn: true,
            });
        });
    }
});
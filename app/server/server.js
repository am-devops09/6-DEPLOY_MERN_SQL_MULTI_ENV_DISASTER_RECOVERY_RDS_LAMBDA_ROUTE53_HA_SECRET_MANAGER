const express = require("express");
// const mysql = require("mysql");
const cors = require("cors");
const path = require("path");
const app = express();
// var aws = require("aws-sdk")

// secret manager
const mysql = require('mysql2/promise');
const SecretsManager = require('./secretsmanager.js')

async function connect() {
    // set and get secret manager
    const secretName = process.env.SECRET_NAME
    const region = process.env.REGION
    let secret_value = await SecretsManager.getSecret(secretName, region);
    secret_value = JSON.parse(secret_value)

    try {
        // set db config
        const config = {
            host: process.env.DB_HOST,
            port: '3306',
            user: secret_value.username,
            password: secret_value.password,
            database: process.env.DB_NAME
        }
        console.log(config)
        const connection = await mysql.createConnection(config);
        return connection

    } catch (err) {
        console.log(`MySQL connection error: ${err}`)
    }

}




//path.resolve()
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

const port = 5000;
// const db = mysql.createConnection({
//   host: "student.cji7g8uzyidp.us-east-1.rds.amazonaws.com",
//   user: "admin",
//   password: "password",
//   // database: "students",
// });
// db.connect((err)=>{
//   if(err) throw err;
//   console.log("DB connected");
// });


app.post("/add_user", (req, res) => {
  const sql =
    "INSERT INTO student_details (`name`,`email`,`age`,`gender`) VALUES (?, ?, ?, ?)";
  const values = [req.body.name, req.body.email, req.body.age, req.body.gender];
  db.query(sql, values, (err, result) => {
    if (err)
      return res.json({ message: "Something unexpected has occured" + err });
    return res.json({ success: "Student added successfully" });
  });
});

app.get("/students", (req, res) => {
  const sql = "SELECT * FROM student_details";
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
  });
});

app.get("/get_student/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM student_details WHERE `id`= ?";
  db.query(sql, [id], (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
  });
});

app.post("/edit_user/:id", (req, res) => {
  const id = req.params.id;
  const sql =
    "UPDATE student_details SET `name`=?, `email`=?, `age`=?, `gender`=? WHERE id=?";
  const values = [
    req.body.name,
    req.body.email,
    req.body.age,
    req.body.gender,
    id,
  ];
  db.query(sql, values, (err, result) => {
    if (err)
      return res.json({ message: "Something unexpected has occured" + err });
    return res.json({ success: "Student updated successfully" });
  });
});

app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM student_details WHERE id=?";
  const values = [id];
  db.query(sql, values, (err, result) => {
    if (err)
      return res.json({ message: "Something unexpected has occured" + err });
    return res.json({ success: "Student updated successfully" });
  });
});

app.listen(port, () => {
  console.log(`listening on port ${port} `);
});

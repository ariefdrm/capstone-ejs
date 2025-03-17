/** @format */

import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      console.log(res.status(500).send("Error reading data.json"));
    }
    const users = JSON.parse(data);
    res.render("index.ejs", { users });
  });
});

app.post("/submit", (req, res) => {
  fs.readFile("data.json", "utf-8", (err, data) => {
    if (err) {
      console.log(res.status(500).send("Error reading data.json"));
    }
    const users = JSON.parse(data);

    const newUser = {
      id: users.length + 1,
      userName: req.body["userName"],
      age: parseInt(req.body["age"]),
    };

    users.push(newUser);

    fs.writeFile("data.json", JSON.stringify(users, null, 2), (err) => {
      if (err) {
        console.log(res.status(500).send("Error sending user"));
      }

      res.redirect("/");
    });
  });
});

app.listen(port, () => {
  console.log(`app running on port: ${port}`);
});

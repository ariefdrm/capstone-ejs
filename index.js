/** @format */

import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const readUser = () => {
  const data = fs.readFileSync("data.json", "utf-8");
  return JSON.parse(data);
};

const writeUser = (user) => {
  fs.writeFileSync("data.json", JSON.stringify(user, null, 2), "utf-8");
};

app.get("/", (req, res) => {
  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      console.log(res.status(500).send("Error reading data.json"));
    }
    const users = JSON.parse(data);
    res.render("index.ejs", { users });
  });
});

app.get("/users", (req, res) => {
  fs.readFile("data.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read data" });
    }

    const dataObj = JSON.parse(data);
    res.json(dataObj);
  });
});

app.get("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const dataObj = readUser();
  const result = dataObj.find((item) => item.id == id);

  res.json(result);
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

// Route to delete user
app.post("/user/delete/:id", (req, res) => {
  const id = parseInt(req.params.id); // Convert ID to integer
  let users = readUser();

  users = users.filter((user) => user.id !== id);
  writeUser(users);

  res.redirect("/"); // Redirect back to homepage
});

app.post("/user/update/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let users = readUser();

  users = users.map((user) => {
    if (user.id === id) {
      return {
        ...user,
        userName: req.body.userName,
        age: parseInt(req.body.age),
      };
    }
    return user;
  });

  writeUser(users);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`app running on port: ${port}`);
});

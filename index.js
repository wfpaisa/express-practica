const express = require("express");
const server = express();
const port = 3000;
const uuid = require("uuid");

const db = require("./db");

let users = db;

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.get("/", (req, res) => {
  res.send("API test");
});

// API REST Listar
server.get("/api/users", (req, res) => {
  res.json(users);
});

// API REST CRUD -> R
server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;

  const user = users.filter((user) => user.id === id);

  res.json(user);
});

// API REST CRUD -> C
server.post("/api/users", (req, res) => {
  const user = {
    id: uuid.v4(), // hash unico
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    edad: req.body.edad,
    gustaHamburguesas: req.body.gustaHamburguesas,
    fechaCreado: new Date().toISOString(),
    fechaEditado: new Date().toISOString(),
  };

  users.push(user);

  res.json(user);
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// CRUD
// post    /user
// get     /user
// put     /user
// delete  /user

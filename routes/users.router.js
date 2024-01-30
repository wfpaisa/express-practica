const express = require("express");

const db = require("../db");
const uuid = require("uuid");

let users = db;

const router = express.Router();

router.get("/", (req, res) => {
  res.json(users);
});

router.get("/:id", (req, res) => {
  const id = req.params.id;

  const user = users.filter((user) => user.id === id);

  res.json(user);
});

router.post("/", (req, res) => {
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

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const body = req.body;

  users = users.map((user) => {
    if (user.id === id) {
      // ? FORMA 1
      // return {
      //   ...user,
      //   nombre: body.nombre,
      //   apellido: body.apellido,
      //   edad: body.edad,
      //   gustaHamburguesas: body.gustaHamburguesas,
      //   fechaEditado: new Date().toISOString(),
      // };

      // ? FORMA 2
      let updateUser = {
        ...user,
      };
      updateUser.nombre = body.nombre;
      updateUser.apellido = body.apellido;
      updateUser.edad = body.edad;
      updateUser.gustaHamburguesas = body.gustaHamburguesas;
      updateUser.fechaEditado = new Date().toISOString();
      return updateUser;
    }
    return user;
  });

  // console.log("holasadasd : ", users);

  res.json({
    message: `update product with id ${id}`,
    data: {
      id,
      ...body,
    },
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  // ?FORMA 1
  // users = users.filter((user) => {
  //   if (user.id !== id) {
  //     return true;
  //   }
  //   return false;
  // });
  // ?FORMA 1 COMPRIMIDA
  users = users.filter((user) => user.id !== id);

  // console.log("holasadasd : ", users);

  res.json({
    mesage: `Deleted product with id ${id}`,
  });
});

module.exports = router;

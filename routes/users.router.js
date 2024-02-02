const express = require("express");

const db = require("../db");
const uuid = require("uuid");

var mysql = require("mysql2");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "danielito",
  database: "practica_db",
});

let users = db;

const router = express.Router();

router.get("/", (req, res) => {
  // desestructuración de objetos
  const { size } = req.query;
  const limit = size ? `LIMIT ${size}` : "";

  const query = `SELECT * FROM users ${limit}`;
  connection.query(query, (err, results) => {
    if (err) {
      return next(err);
    }
    // console.log("RESULTS: ->", results);
    return res.json(results);
  });
});

// ? /users?filter[nombre]=

router.get("/filter/:nombre", (req, res, next) => {
  const nombre = req.params.nombre;
  const query = `SELECT * FROM users WHERE nombre LIKE "%${nombre}%"`;

  connection.query(query, (err, results) => {
    if (err) {
      return next(err);
    }

    if (results && results.length > 0) {
      // res.json(results);
      return res.json(results);
    } else {
      // res.status(404).json({
      //   message: "Product not found",
      // });
      return res.status(404).json({
        message: `Nombres con esta coincidenia: (${nombre}) no encontrados`,
      });
    }
  });
});

// router.get("/:id", (req, res, next) => {
//   const id = req.params.id;
//   const query = `SELECT * FROM users WHERE id IN (${id})`;

//   connection.query(query, (err, results) => {
//     if (err) throw err;

//     res.json(results);
//     next();
//   });
// });

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  const query = `SELECT * FROM users WHERE id IN (${id})`;

  connection.query(query, (err, results) => {
    // if (err) throw err;
    if (err) {
      return next(err);
    }

    // console.log(Array.isArray(results));

    // if (results) {
    // if (results.length > 0) {
    // if (Object.keys(results).length > 0) {
    if (results && results?.length) {
      // res.json(results);
      return res.json(results);
    } else {
      // res.status(404).json({
      //   message: "Product not found",
      // });
      // return res.status(404).json({
      //   message: `usuario con ${id} not found`,
      // });
    }
  });
});

// // FORMA EN LOCAL
// router.get("/:id", (req, res) => {
//   const id = req.params.id;
//   const user = users.filter((user) => user.id === id);
//   res.json(user);
// });

router.post("/", (req, res) => {
  const user = {
    id: uuid.v4(), // hash unico
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    edad: req.body.edad,
    gustaHamburguesas: req.body.gustaHamburguesas,
    fechaCreado: new Date(),
    fechaEditado: new Date(),
  };

  const query = `INSERT INTO users (id, nombre, apellido, edad, gustaHamburguesas, fechaCreado, fechaEditado) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  connection.query(
    query,
    [
      user.id,
      user.nombre,
      user.apellido,
      user.edad,
      user.gustaHamburguesas,
      user.fechaCreado,
      user.fechaEditado,
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error al insertar usuario en la base de datos");
      } else {
        console.log("Usuario insertado correctamente en la base de datos");
        res.json(user);
      }
    }
  );
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

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
      return res.json(results);
    } else {
      return res.status(404).json({
        message: `Nombres con esta coincidenia: (${nombre}) no encontrados`,
      });
    }
  });
});

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  const query = `SELECT * FROM users WHERE id IN (${id})`;

  connection.query(query, (err, results) => {
    // if (err) throw err;
    if (err) {
      return next(err);
    }

    if (results && results?.length) {
      // res.json(results);
      return res.json(results);
    } else {
    }
  });
});

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
  const user = {
    id: uuid.v4(),
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    edad: req.body.edad,
    gustaHamburguesas: req.body.gustaHamburguesas,
    fechaEditado: new Date(),
  };

  const query = `UPDATE users SET id = ?, nombre = ?, apellido = ?, edad = ?, gustaHamburguesas = ?, fechaEditado = ? WHERE id = ?`;

  connection.query(
    query,
    [
      user.id,
      user.nombre,
      user.apellido,
      user.edad,
      user.gustaHamburguesas,
      user.fechaEditado,
      id,
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error al actualizar usuario en la base de datos");
      } else {
        console.log("Usuario actualizado correctamente en la base de datos");
        res.json(user);
      }
    }
  );
});

router.delete("/:id", (req, res) => {
  const { id } = req.params; // // FORMA EN LOCAL
  // router.get("/:id", (req, res) => {
  //   const id = req.params.id;
  //   const user = users.filter((user) => user.id === id);
  //   res.json(user);
  // });

  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error al eliminar usuario de la base de datos");
    } else {
      if (result.affectedRows > 0) {
        console.log("Usuario eliminado correctamente de la base de datos");
        res.status(204).send();
      } else {
        res.status(404).send("Usuario no encontrado");
      }
    }
  });
});

module.exports = router;

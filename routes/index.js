const express = require('express');


const usersRouter = require('./users.router');

function routerApi(server) {
  const router = express.Router();

  server.use('/api/v1', router);
  router.use('/users', usersRouter);

  // app.get('/categories/:categoryId//:productsId', (req, res) => {
  //   const { categoryId, productsId } = req.params;
  //   res.json({
  //     productsId,
  //     categoryId,
  //   });
  // });
}

module.exports = routerApi;

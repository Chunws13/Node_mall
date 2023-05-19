const express = require("express");
const usersRouter = require('./routes/users.js');
const sellersRouter = require('./routes/sellers.js');
const swaggerUi = require('swagger-ui-express'); // swagger
const swaggerDocs = require('./swagger.js');
const app = express();
const port = 3000;
/**
 *  @swagger
 *  tag :
 *      name: api/join
 *      description : 회원가입
 */
app.use(express.json());
app.use('/docs-api', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api', [usersRouter, sellersRouter]);

app.listen(port, () => {
    console.log(`Server listen at ${port}`)
})
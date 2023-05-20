const express = require("express");
const usersRouter = require('./routes/users.js');
const sellersRouter = require('./routes/sellers.js');
const swaggerUi = require('swagger-ui-express'); // swagger
const swaggerDocs = require('./swagger.js');
const cors = require('cors');
const app = express();
const port = 3000;

const corsOption = {
    origin: ['https://hanghae-shop-git-main-zadragon.vercel.app/', '*'],
    credentials: true
}

app.use(express.json());
// app.use(cors());
app.use('/docs-api', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api', [usersRouter, sellersRouter]);

app.get('/', async(req, res) => {
    return res.send(`Use '/docs-api' Page`);
})

app.listen(port, () => {
    console.log(`Server listen at ${port}`)
})
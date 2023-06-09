const express = require("express");
const usersRouter = require('./routes/users.js');
const sellersRouter = require('./routes/sellers.js');
const buyersRouter = require('./routes/buyers.js');

const swaggerUi = require('swagger-ui-express'); // swagger
const swaggerDocs = require('./swagger.js');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({
    origin: "*",
    methods: "GET, HEAD, POST, PUT, DELETE"
}));

app.use('/docs-api', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api', [usersRouter, sellersRouter, buyersRouter]);

app.get('/', async(req, res) => {
    return res.send(`Use '/docs-api' Page`);
})

app.listen(port, () => {
    console.log(`Server listen at ${port}`);
})
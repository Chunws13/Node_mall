const express = require("express");
const usersRouter = require('./routes/users.js');
const sellersRouter = require('./routes/sellers.js');
const app = express();
const port = 3000;

app.use(express.json());
app.use('/api', [usersRouter, sellersRouter]);

app.listen(port, () => {
    console.log(`Server listen at ${port}`)
})
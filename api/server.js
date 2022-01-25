const express = require('express');
const cors = require('cors');

let PORT = process.env.PORT || 3000;

const routes = require('./routes/routes');
const app = express();

app.use(cors());
app.use(express.json())
app.use(routes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({ error: error.message })
})

app.listen(PORT, () => console.log(`Servidor está rodando na porta ${PORT}`))
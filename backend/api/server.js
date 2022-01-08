const express = require('express');

let PORT = process.env.PORT || 3000;

const routes = require('./routes/rountes');
const app = express();

app.use(routes);

app.listen(PORT, () => console.log(`Servidor está rodando na porta ${PORT}`))
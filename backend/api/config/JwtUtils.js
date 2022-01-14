require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = {

    verificarToken(req, res, next){
        let authToken = req.headers["authorization"]
        if (!authToken) {
            res.status(401).json({ message: 'Token de acesso requerida' })
        }
        else {
            let token = authToken.split(' ')[1]
            req.token = token
        }
        jwt.verify(req.token, process.env.SECRET_KEY, (err, decodeToken) => {
            if (err) {
                res.status(401).json({ message: 'Acesso negado' })
                return
            }
            req.usuarioId = decodeToken.id
            next()
        })
    },
    gerarToken(id){
        return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: process.env.EXPIRE } )
    }

}

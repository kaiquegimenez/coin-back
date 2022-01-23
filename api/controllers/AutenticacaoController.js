require('dotenv').config()
const knex = require("../database")
const bcrypt = require("bcryptjs")
const tokenUtil = require('../config/JwtUtils')

module.exports = {
    async index(req, res, next) {
        const { email, senha } = req.body;
        knex
        .select('*').from('usuario').where({ email })
        .then(usuarios => {
            if (usuarios.length) {
                let usuario = usuarios[0]
                let checkSenha = bcrypt.compareSync(senha, usuario.senha)
                if (checkSenha) {
                    var tokenJWT = tokenUtil.gerarToken(usuario.id);
                    res.status(200).json({
                        success: true,
                        user: {
                            id: usuario.id,
                            login: usuario.email,
                            nome: usuario.nome,
                            roles: usuario.perfil,
                            token: tokenJWT
                        }
                    })
                    return
                }else{
                    res.status(200).json({ success: false, message: 'Login ou senha incorretos' })
                }
            }else {
                res.status(200).json({ success: false, message: 'Login ou senha incorretos' })
            }
        })
        .catch(error => next(error))
    },
    async checkToken(req, res, next){
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
    }

}
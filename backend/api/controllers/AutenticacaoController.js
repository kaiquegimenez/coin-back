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
                }
                res.status(200).json({
                    id: usuario.id,
                    login: usuario.email,
                    nome: usuario.nome,
                    roles: usuario.perfil,
                    token: tokenJWT
                })
                return
            }else {
                res.status(200).json({ message: 'Login ou senha incorretos' })
            }
        })
        .catch(error => next(error))
    }
}
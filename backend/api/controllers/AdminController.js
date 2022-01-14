const knex = require("../database")

module.exports = {

    async listarUsuarios(req, res, next) {
        try {
            const result = knex('usuario')
            return res.json(result)
        } catch (error) {
            next(error)
        }
    },
    async listarProduto(req, res, next) {
        const result = knex('produto')
        return res.json('produto')
    },
    async adicionarProduto(req, res, next) {

    },
    async atualizaProduto(req, res, next) {

    },
    async excluirProduto(req, res, next) {

    },
    async excluirUsuario(req, res, next){
        try {
            const { id } = req.body;
            await knex('usuario')
            .where({id}).del();

            return res.send()
        } catch (error) {
            next(error)
        }
    },
    async creditarCoin(req, res, next){

    },
    async isAdmin(req, res, next) {
        const { id } = req.usuarioId
        await knex('usuario').where({ id })
            .then((usuarios) => {
                if (usuarios.length) {
                    let usuario = usuarios[0]
                    let roles = usuario.perfil.split(';')
                    let adminRole = roles.find(i => i === 'ADMIN')
                    if (adminRole === 'ADMIN') {
                        next()
                        return
                    }
                    else {
                        res.status(403).json({ message: 'Role de ADMIN requerida' })
                        return
                    }
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: 'Erro ao verificar roles de usuário - ' + err.message
                })
            })
    }
}
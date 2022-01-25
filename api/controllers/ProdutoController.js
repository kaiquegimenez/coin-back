const knex = require("../database")
const bcrypt = require('bcryptjs');
const constants = require("../config/Constants");

module.exports = {
    async index(req, res, next) {
        try {
            const result = await knex('produto')
            .select('id', 'nome', 'descricao', 'valor')
            .where('deletado_em', null)

            res.json(result)
        } catch (error) {
            next(error)
        }
    }
}


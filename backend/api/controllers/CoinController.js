const { query } = require("express");
const knex = require("../database");
const UserController = require("./UserController");

module.exports = {
    async index(req, res, next) {
        try {
            const {usuario_id} = req.query;

            const query = knex('coin')

            if(usuario_id){
                query
                    .where({usuario_id})
                    .join('usuario', 'usuario.id', '=', 'coin.usuario_id')
                    .select('coin.*', 'usuario.nome')
            }
            const results = await query;

            return res.json(results);

        } catch (error) {
            next(error)
        }
    },
    async criarCoin(req, res, next) {
        try {
            const {saldo, usuario_id} = req.body;
            await knex('coin').insert({ saldo, usuario_id });
            return res.status(201).send();
        } catch (error) {
            next(error)
        }
    },
    async atualizaCoin(req, res, next) {
        try {
            const {id, nome, senha} = req.body;
            await knex('coin')
            .update({ nome, senha })
            .where({id})

            return res.send()
        } catch (error) {
            next(error)
        }
    },
    async deletaCoin(req, res, next){
        try {
            const { id } = req.body;
            await knex('coin')
            .where({id}).del()

            return res.send()
        } catch (error) {
            next(error)
        }
    }
}
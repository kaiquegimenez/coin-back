const knex = require("../database")
const constants = require('../config/constants');

module.exports = {

    async listarUsuarios(req, res, next) {
        try {
            const result = await knex('usuario')
            .select('usuario.id', 'usuario.email', 'usuario.nome', 'usuario.perfil', 'coin.saldo','usuario.deletado_em' )
            .innerJoin('coin', {'coin.usuario_id':'usuario.id'});
            return res.status(200).json(result);
        } catch (error) {
            error.message = "Usuário não encontrado.";
            error.status = 404;
            next(error)
        }
    },
    async listarProduto(req, res, next) {
        try {
            const result = await knex('produto')
            return res.status(200).json(result)
        } catch (error) {
            next(error)
        }
    },
    async adicionarProduto(req, res, next) {
        try {
            const { nome, valor, descricao } = req.body;
            knex('produto').insert({nome, valor, descricao}).catch(err => next(err));
    
            return res.status(200).json({success: true, message: constants.PRODUTO_CRIADO_SUCESSO});
        } catch (error) {
            next(error)
        }
    },
    async atualizaProduto(req, res, next) {
        try {
            const {id, nome, valor, descricao} = req.body;
            if(nome){
                await knex('produto')
                .update({ nome }).where({id})
            }
            if(valor){
                await knex('produto')
                .update({ valor }).where({id})
            }
            if(descricao){
                await knex('produto')
                .update({ descricao }).where({id})
            }

            return res.status(200).json({success: true, message: constants.PRODUTO_ATUALIZADO_SUCESSO})
        } catch (error) {
            error.success= false;
            error.message = constants.PRODUTO_NAO_ENCONTRADO;
            error.status = 404;
            next(error)
        }
    },
    async excluirProduto(req, res, next) {
        try {
            // console.log(req)
            console.log(req.body)
            const { id } = req.body;
            await knex('produto')
            .update('deletado_em', new Date())
            .where({ id })
            .catch(err => next(err));

            return res.status(200).json({success: true, message: constants.PRODUTO_EXCLUIDO_SUCESSO});
        } catch (error) {
            next(error)
        }
    },
    async excluirUsuario(req, res, next){
        try {
            const { id } = req.body;
            await knex('usuario')
            .where({id}).del();

            return res.status(200).json({success: true, message: constants.USUARIO_EXLUIDO_SUCESSO})
        } catch (error) {
            next(error)
        }
    },
    async creditarCoin(req, res, next){
        try {
            const {id, saldo } = req.body;

            await knex('coin').update({saldo: saldo}).where({usuario_id: id});
    
            return res.status(200).json({success: true, message: constants.CREDITAR_COIN_SUCESSO})
        } catch (error) {
            next(error)
        }
    },
    async isAdmin(req, res, next) {
        const id = req.usuarioId
        await knex('usuario').where({ id })
            .then((usuarios) => {
                if (usuarios.length) {
                    let usuario = usuarios[0]
                    let roles = usuario.perfil.split(';')
                    let adminRole = roles.find(i => i === 'ADM')
                    if (adminRole === 'ADM') {
                        next()
                        return
                    }
                    else {
                        res.status(403).json({ message: constants.FUNCIONALIDADE_INDISPONIVEL })
                        return
                    }
                }
            })
            .catch(err => {
                err.status = 403
                err.message = constants.FUNCIONALIDADE_INDISPONIVEL;
                next(err)
            })
    }
}
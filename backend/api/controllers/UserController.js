const knex = require("../database")
const bcrypt = require('bcryptjs')

module.exports = {
    async index(req, res, next) {
        try {
            const { id } = req.params;
            const result = await knex('usuario')
            .where('id', '=', id)
            .andWhere('deletado_em', null);
            return res.json(result);
        } catch (error) {
            error.message = "Usuário não encontrado.";
            error.status = 404;
            next(error)
        }
    },
    async criarUsuario(req, res, next) {
        try {
            const {nome, senha, email } = req.body;
            if(nome && senha && email ){
                await knex('usuario').insert({ 
                    nome, 
                    senha: bcrypt.hashSync(senha, 8), 
                    email,
                    perfil: 'COMUM'})
                    .returning('id')
                    .then(id => 
                        knex('coin')
                        .insert({ saldo: 0, usuario_id: parseInt(id)})
                        .catch(err => next(err))
                    )
                    .catch(err => next(err));
                    
            }else{
                throw new Error('Dados obrigatórios não informados.')
            }
            return res.status(201).send();
        } catch (error) {
            next(error)
        }
    },
    async atualizaUsuario(req, res, next) {
        try {
            const {id, nome, senha} = req.body;
            if(nome){
                await knex('usuario')
                .update({ nome }).where({id})
            }
            if(senha){
                await knex('usuario')
                .update({ senha }).where({id})
            }

            return res.send()
        } catch (error) {
            error.message = "Usuário não encontrado.";
            error.status = 404;
            next(error)
        }
    },
    async deletaUsuario(req, res, next){
        try {
            const { id } = req.body;
            await knex('usuario')
            .update('deletado_em', new Date())
            .where({ id })
            .catch(err => console.log(err));

            return res.send()
        } catch (error) {
            error.message = "Usuário não encontrado.";
            error.status = 404;
            next(error)
        }
    },
    async trocarCoin(req, res, next){
        const { idProduto, idUsuario } = req.body;
        var saldoUsuario;
        var valorProduto;
        try {
            saldoUsuario = await getSaldoUsuario(idUsuario).then(user => user[0].saldo);
            valorProduto = await getValorProduto(idProduto).then(product => product[0].valor);
            
            if(valorProduto > saldoUsuario){
                throw new Error('Saldo insuficiente para esse produto');
            }

            saldoUsuario -= valorProduto;
    
            await knex('coin').update({saldo: saldoUsuario}).where({usuario_id: idUsuario});
    
            await knex('troca').insert({
                id_usuario: idUsuario,
                id_produto: idProduto
            }).catch(err => new Error(err))
    
            return res.send()
        } catch (error) {
            error.status = 400;
            next(error)
        }

    }
}

function getValorProduto(idProduto) {
    if (idProduto) {
        return knex('produto').where({ id: idProduto }).select('valor');
    }
    throw new Error('Produto inválido.');
}

function getSaldoUsuario(idUsuario) {
    if (idUsuario) {
        return knex('coin').where({ usuario_id: idUsuario }).select('saldo');
    }
    throw new Error('Usuário inválido.');
}

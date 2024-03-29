const knex = require("../database")
const bcrypt = require('bcryptjs');
const constants = require("../config/constants");

module.exports = {
    async index(req, res, next) {
        try {
            const id = req.usuarioId;
            const result = await knex('usuario')
            .select('usuario.id', 'usuario.nome', 'usuario.email', 'usuario.bairro', 'usuario.cidade', 'usuario.numero', 'usuario.cep', 'usuario.telefone', 'usuario.estado', 'usuario.rua', 'produto.nome as produtos', 'coin.saldo')
            .leftJoin('troca', {'troca.id_usuario':'usuario.id'})
            .leftJoin('produto', {'produto.id': 'troca.id_produto'})
            .innerJoin('coin', {'coin.usuario_id':'usuario.id'})
            .where('usuario.id', '=', id)
            .then(result => {
                return result.reduce((prod, prodEntry) => {
                    if (!prod.produtos) {
                        prod.id = prodEntry.id;
                        prod.email = prodEntry.email;
                        prod.nome = prodEntry.nome;
                        prod.saldo = prodEntry.saldo;
                        prod.rua = prodEntry.rua;
                        prod.cidade = prodEntry.cidade;
                        prod.bairro = prodEntry.bairro;
                        prod.numero = prodEntry.numero;
                        prod.cep = prodEntry.cep;
                        prod.telefone = prodEntry.telefone;
                        prod.estado = prodEntry.estado;
                        prod.produtos = [];
                    }
                    prod.produtos.push(prodEntry.produtos);
                    return prod;
            }, {})})
            // .andWhere('usuario.deletado_em', null);
            // if(result.length == 0){
            //     throw new Error()
            // }
            return res.status(200).json(result);
        } catch (error) {
            error.message = constants.USUARIO_NAO_ENCONTRADO;
            error.status = 404;
            next(error)
        }
    },
    async criarUsuario(req, res, next) {
        try {
            const {nome, senha, email, cidade, bairro, numero, cep, estado, telefone, rua } = req.body;
            if(nome && senha && email ){
                await knex('usuario').insert({ 
                    nome, 
                    senha: bcrypt.hashSync(senha, 8), 
                    email,
                    cidade,
                    bairro,
                    numero,
                    cep,
                    rua,
                    telefone,
                    estado,
                    perfil: 'COMUM'})
                    .returning('id')
                    .then(id => 
                        knex('coin')
                        .insert({ saldo: 0, usuario_id: parseInt(id)})
                        .catch(err => next(err))
                    )
                    .catch(err => next(err));
                    
            }else{
                return res.status(200).json({success: false, message:'Dados obrigatórios não informados.'})
            }
            return res.status(201).json({success: true, message: constants.USUARIO_CRIADO_SUCESSO});
        } catch (error) {
            next(error)
        }
    },
    async atualizaUsuario(req, res, next) {
        try {

            const { id, nome, senha, email, cidade, rua, telefone, estado, cep, numero, bairro } = req.body;
            if(nome){
                await knex('usuario')
                .update({ nome }).where({id})
            }
            if(senha){
                await knex('usuario')
                .update({ senha: bcrypt.hashSync(senha, 8) }).where({id})
            }
            if(email){
                await knex('usuario')
                .update({ email }).where({id})
            }
            if(cidade){
                await knex('usuario')
                .update({ cidade }).where({id})
            }
            if(rua){
                await knex('usuario')
                .update({ rua }).where({id})
            }
            if(telefone){
                await knex('usuario')
                .update({ telefone }).where({id})
            }
            if(estado){
                await knex('usuario')
                .update({ estado }).where({id})
            }
            if(cep){
                await knex('usuario')
                .update({ cep }).where({id})
            }
            if(numero){
                await knex('usuario')
                .update({ numero }).where({id})
            }
            if(bairro){
                await knex('usuario')
                .update({ bairro }).where({id})
            }
            return res.status(200).json({success: true, message: constants.USUARIO_ATUALIZADO_SUCESSO});
        } catch (error) {
            error.message = constants.USUARIO_NAO_ENCONTRADO;
            error.status = 500;
            next(error)
        }
    },
    async deletaUsuario(req, res, next){
        try {
            const {id} = req.body;
            await knex('usuario')
            .update({'deletado_em': new Date()})
            .where({ id })
            .catch(err => console.log(err));

            return res.status(200).json({success:true, message: 'Usuário deletado com sucesso'})
        } catch (error) {
            error.message = "Usuário não encontrado.";
            error.status = 404;
            error.success = false;
            next(error)
        }
    },
    async trocarCoin(req, res, next){
        const { idProduto, idUsuario, enviadoEm } = req.body;
        var saldoUsuario;
        var valorProduto;
        try {
            saldoUsuario = await getSaldoUsuario(idUsuario).then(user => user[0].saldo);
            valorProduto = await getValorProduto(idProduto).then(product => product[0].valor);
            nomeProduto = await getNomeProduto(idProduto).then(product => product[0].nome);
            if(valorProduto > saldoUsuario){
                return res.json({ message:'Saldo insuficiente para esse produto', success: false });
            }

            saldoUsuario -= valorProduto;
    
            await knex('coin').update({saldo: saldoUsuario}).where({usuario_id: idUsuario});
            await knex('troca').insert({
                id_usuario: idUsuario,
                id_produto: idProduto
            }).catch(err => new Error(err))
            await knex('transferencias').insert({
                notificacao: nomeProduto, 
                valor: valorProduto,
                id_recebeu: 17,
                id_enviou: idUsuario,
                enviado_em: enviadoEm
            }).catch(err => next(err));
            return res.status(200).json({ message: 'Produto comprado', success: true })
        } catch (error) {
            error.status = 400;
            next(error)
        }

    },
    async transferirCoin(req, res, next){

        const id = req.usuarioId;
        const { idDestino, valor, idUser, notificacao, enviadoEm } = req.body;
        try {            
            saldoUsuario = await getSaldoUsuario(idUser).then(user => user[0].saldo);
            
            if(saldoUsuario < valor){
                return res.status(200).json({success: false, message: 'Saldo insuficiente para realizar a transferência.'});
            }
            saldoUsuario -= valor;
    
            await knex('coin').update({saldo: saldoUsuario}).where({usuario_id: idUser});
    
            saldoUsuarioDestino = await getSaldoUsuario(idDestino).then(user => user[0].saldo);
    
            saldoUsuarioDestino += valor;
    
            await knex('coin').update({saldo: saldoUsuarioDestino}).where({usuario_id: idDestino});
            
            await knex('transferencias').insert({notificacao, valor, id_recebeu: idDestino, id_enviou: idUser, enviado_em: enviadoEm}).catch(err => next(err));
    
            return res.status(200).json({success: true, message: 'Transferência realizada com sucesso.'});
        } catch (error) {
            error.status = 400;
            next(error);
        }
    },

    async getNotificacoes(req, res, next) {
        try {
            const {id, page = 1} = req.query
            const result = await knex('transferencias')
            .select('transferencias.*', 'usuario.*' )
            .innerJoin('usuario', {'usuario.id':'transferencias.id_enviou'})
            .where({id_recebeu: id})
            .limit(10)
            .offset((page - 1) * 10)
            return res.status(200).json({success: true, notifications: result});
        } catch (error) {
            error.message = "Usuário não encontrado.";
            error.status = 404;
            next(error)
        }
    },

    async getExtrato(req, res, next) {
        try {
            const {id, page = 1} = req.query
            const result = await knex('transferencias')
            .select('transferencias.*', 'usuario.*' )
            .innerJoin('usuario', {'usuario.id':'transferencias.id_enviou'})
            .where({id_recebeu: id})
            .orWhere({id_enviou: id})
            .limit(20)
            .offset((page - 1) * 10)
            return res.status(200).json({success: true, notifications: result});
        } catch (error) {
            error.message = "Usuário não encontrado.";
            error.status = 404;
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

function getNomeProduto(idProduto) {
    if (idProduto) {
        return knex('produto').where({ id: idProduto }).select('nome');
    }
    throw new Error('Produto inválido.');
}

function getSaldoUsuario(idUsuario) {
    if (idUsuario) {
        return knex('coin').where({ usuario_id: idUsuario }).select('saldo');
    }
    throw new Error('Usuário inválido.');
}

function getTransferencias(idUser) {
    if (idUser) {
        return knex.select('*').from('transferencias').where({ id_recebeu: idUser })
    }
    throw new Error('Usuário inválido.');
}

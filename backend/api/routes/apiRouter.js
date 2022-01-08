require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')
let apiRouter = express.Router()
const bcrypt = require('bcryptjs')
const endpoint = '/'

const knex = require('knex')({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    }
})
let checkToken = (req, res, next) => {
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

let isAdmin = (req, res, next) => {
    knex
        .select('*').from('usuario').where({ id: req.usuarioId })
        .then((usuarios) => {
            if (usuarios.length) {
                let usuario = usuarios[0]
                let roles = usuario.roles.split(';')
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

apiRouter.post(endpoint + 'seguranca/register', (req, res) => {
    knex('usuario')
        .insert({
            nome: req.body.nome,
            login: req.body.login,
            senha: bcrypt.hashSync(req.body.senha, 8),
            email: req.body.email
        }, ['id'])
        .then((result) => {
            let usuario = result[0]
            res.status(200).json({ "id": usuario.id })
            return
        })
        .catch(err => {
            res.status(500).json({
                message: 'Erro ao registrar usuario - ' + err.message
            })
        })
})

apiRouter.post(endpoint + 'seguranca/login', (req, res) => {
    knex
        .select('*').from('usuario').where({ login: req.body.login })
        .then(usuarios => {
            if (usuarios.length) {
                let usuario = usuarios[0]
                let checkSenha = bcrypt.compareSync(req.body.senha, usuario.senha)
                if (checkSenha) {
                    var tokenJWT = jwt.sign({ id: usuario.id },
                        process.env.SECRET_KEY, {
                        expiresIn: 3600
                    })
                    res.status(200).json({
                        id: usuario.id,
                        login: usuario.login,
                        nome: usuario.nome,
                        roles: usuario.roles,
                        token: tokenJWT
                    })
                    return
                }
            }
            res.status(200).json({ message: 'Login ou senha incorretos' })
        })
        .catch(err => {
            res.status(500).json({
                message: 'Erro ao verificar login - ' + err.message
            })
        })
})


// ---------------

apiRouter.get(endpoint + 'produtos', checkToken, function (req, res) {
    knex
        .select('*')
        .from('produto')
        .then(produtos => res.status(200).json(produtos))
})


apiRouter.get(endpoint + 'produtos/:id', checkToken, (req, res) => {
    knex
        .select('*')
        .from('produto')
        .where({ id: req.params.id })
        .then(produtos => {
            if (produtos.length) {
                let produto = produtos[0]
                res.status(200).json(produto)
            } else {
                res.status(404).json({ message: 'Produto não encontrado.' })
            }
        }
        ).catch(err => res.status(500).json('Erro no servidor.'));
});

apiRouter.post(endpoint + 'produtos', checkToken, (req, res) => {
    let novoProduto = {
        descricao: req.body.descricao,
        valor: req.body.valor,
        marca: req.body.marca
    };
    knex('produto')
        .insert(novoProduto, ['id'])
        .then(resut => {
            let { id } = resut[0];
            res.status(201).json({ id });
            return
        }).catch(err => res.status(500).json('Erro do servidor.'))
})

apiRouter.put(endpoint + 'produtos/:id', checkToken, (req, res) => {
    let updateProduto = {
        descricao: req.body.descricao,
        valor: req.body.valor,
        marca: req.body.marca
    };
    console.log(updateProduto)
    knex('produto')
        .where({ id: req.params.id })
        .update(updateProduto)
        .then(resut => {
            let produto = resut[0];
            res.status(200).json(produto);
            return
        }).catch(err => res.status(500).json('Erro do servidor.'))
})

apiRouter.delete(endpoint + 'produtos/:id', checkToken, isAdmin, (req, res) => {
    knex
        .where({ id: req.params.id })
        .del()
        .then(() => {
            res.status(200).json({ message: 'Produto excluído com sucesso.' })
        }).catch(err => res.status(500).json('Erro no servidor.'))
});

module.exports = apiRouter;
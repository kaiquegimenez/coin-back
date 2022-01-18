const express = require('express');
const routes = express.Router();

const UserController = require('../controllers/UserController')
const AdmController = require('../controllers/AdminController')
const AuthController = require('../controllers/AutenticacaoController')

routes
    //Autenticação
    .post('login', AuthController.index)
    //usuários
    .get('/users/:id', UserController.index)
    .post('/users', UserController.criarUsuario)
    .put('/users', UserController.atualizaUsuario)
    .delete('/users', UserController.deletaUsuario)
    //coins
    .post('/coins/changes', UserController.trocarCoin)
    //admin
    .post('/adm/product', AdmController.adicionarProduto)


module.exports = routes;
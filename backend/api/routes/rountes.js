const express = require('express');
const routes = express.Router();

const UserController = require('../controllers/UserController')
const AdmController = require('../controllers/AdminController')
const AuthController = require('../controllers/AutenticacaoController')
const tokenUtil = require('../config/JwtUtils')

routes
    //Autenticação
    .post('/login', AuthController.index)
    //usuários
    .post('/users', UserController.criarUsuario)
    .get('/users', tokenUtil.verificarToken, UserController.index)
    .put('/users', tokenUtil.verificarToken,UserController.atualizaUsuario)
    .delete('/users', tokenUtil.verificarToken, UserController.deletaUsuario)
    //coins
    .post('/coins/changes', tokenUtil.verificarToken, UserController.trocarCoin)
    //admin
    .get('/adm/users', tokenUtil.verificarToken, AdmController.isAdmin, AdmController.listarUsuarios)
    .delete('/adm/users', tokenUtil.verificarToken, AdmController.excluirUsuario)
    .put('/adm/users/coins', tokenUtil.verificarToken, AdmController.creditarCoin)
    .get('/adm/product', tokenUtil.verificarToken, AdmController.listarProduto)
    .delete('/adm/product', tokenUtil.verificarToken, AdmController.excluirProduto)
    .put('/adm/product', tokenUtil.verificarToken, AdmController.atualizaProduto)
    .post('/adm/product', tokenUtil.verificarToken, AdmController.adicionarProduto)


module.exports = routes;
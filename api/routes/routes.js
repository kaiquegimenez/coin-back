const express = require('express');
const routes = express.Router();

const userController = require('../controllers/UserController')
const admController = require('../controllers/AdminController')
const authController = require('../controllers/AutenticacaoController')
const produtoController = require('../controllers/ProdutoController')
const tokenUtil = require('../config/JwtUtils')

routes
    //Autenticação
    .post('/login', authController.index)
    //usuários
    .post('/users', userController.criarUsuario)
    .get('/users', tokenUtil.verificarToken, userController.index)
    .put('/users', tokenUtil.verificarToken,userController.atualizaUsuario)
    .put('/users/delete', tokenUtil.verificarToken, userController.deletaUsuario)
    //coins
    .post('/coins/transfer', tokenUtil.verificarToken, userController.transferirCoin)
    .post('/coins/changes', tokenUtil.verificarToken, userController.trocarCoin)
    //produtos
    .get('/products', tokenUtil.verificarToken, produtoController.index)
    //admin
    .get('/list/users', tokenUtil.verificarToken, admController.listarUsuarios)
    .delete('/adm/users', tokenUtil.verificarToken, admController.excluirUsuario)
    .put('/adm/users/coins', tokenUtil.verificarToken, admController.creditarCoin)
    .get('/adm/product', tokenUtil.verificarToken, admController.listarProduto)
    .put('/delete/product', tokenUtil.verificarToken, admController.excluirProduto)
    .put('/adm/product', tokenUtil.verificarToken, admController.atualizaProduto)
    .post('/adm/product', tokenUtil.verificarToken, admController.adicionarProduto)


module.exports = routes;
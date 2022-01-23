# Backend - COIN-BACK

Para rodar o projeto localmente é necessário ter instalado o Node e npm e um banco de dados postgres na máquina do usuário.

Após baixar o projeto entre na pasta '/backend' e executo o comando:
``` npm install ```

Configure as credenciais do banco de dados no arquivo knexfile.

Informe no arquivo .env qual será o secret do token de acesso e qual o prazo de expiração. 

Alterada as configurações de conexão com o banco de dados execute o comando para gerar as tabelas no banco. 
```npx knex migrate:latest```

Criada as tabelas o backend pode ser iniciado com o comando:
``` npm start ```


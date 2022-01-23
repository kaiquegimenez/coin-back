
exports.up = knex => knex.schema.createTable('troca', tabela => {

    tabela.integer('id_produto')
        .references('produto.id')
        .notNullable()

    tabela.integer('id_usuario')
        .references('usuario.id')
        .notNullable()

    tabela.timestamps(true, true);
});

exports.down = knex => knex.schema.dropTable('troca');
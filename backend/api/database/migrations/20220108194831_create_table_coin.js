
exports.up = knex => knex.schema.createTable('coin', tabela => {
    tabela.increments('id')
    tabela.integer('saldo')
    
    tabela.integer('usuario_id')
        .references('usuario.id')
        .notNullable()
        .onDelete('CASCADE')

    tabela.timestamps(true, true);
});

exports.down = knex => knex.schema.dropTable('coin');

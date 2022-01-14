
exports.up = knex => knex.schema.createTable('produto', tabela => {
    tabela.increments('id')
    tabela.text('nome').notNullable();
    tabela.integer('valor').notNullable();
    

    tabela.timestamps(true, true);
});

exports.down = knex => knex.schema.dropTable('produto');


exports.up = knex => knex.schema.createTable('produto', tabela => {
    tabela.increments('id')
    tabela.text('nome').notNullable();
    tabela.integer('valor').notNullable();
    tabela.text('descricao');
    
    tabela.timestamps(true, true);
    tabela.timestamp('deletado_em');
});

exports.down = knex => knex.schema.dropTable('produto');

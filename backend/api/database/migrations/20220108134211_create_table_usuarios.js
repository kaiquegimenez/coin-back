
exports.up = knex => knex.schema.createTable('usuario', tabela => {
        tabela.increments('id')
        tabela.text('nome').notNullable()
        tabela.text('senha').notNullable()

        tabela.timestamp('criado_em').defaultTo(knex.fn.now())
        tabela.timestamp('atualizado_em').defaultTo(knex.fn.now())
});


exports.down = knex => knex.schema.dropTable('usuario');

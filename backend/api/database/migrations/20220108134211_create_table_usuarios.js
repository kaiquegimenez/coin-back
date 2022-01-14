
exports.up = knex => knex.schema.createTable('usuario', tabela => {
        tabela.increments('id')
        tabela.text('email').unique().notNullable()
        tabela.text('nome').notNullable();
        tabela.text('senha').notNullable();
        tabela.text('perfil').notNullable();

        tabela.timestamp('criado_em').defaultTo(knex.fn.now())
        tabela.timestamp('atualizado_em').defaultTo(knex.fn.now())
        tabela.timestamp('deletado_em')
});


exports.down = knex => knex.schema.dropTable('usuario');

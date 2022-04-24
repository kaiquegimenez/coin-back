
exports.up = knex => knex.schema.createTable('transferencias', tabela => {
  tabela.increments('id')
  tabela.text('notificacao').unique().notNullable()
  tabela.integer('valor').notNullable();
  tabela.integer('id_recebeu')
    .references('usuario.id')
    .notNullable()
  tabela.integer('id_enviou')
    .references('usuario.id')
    .notNullable()
  tabela.timestamp('enviado_em').defaultTo(knex.fn.now())

});


exports.down = knex => knex.schema.dropTable('notificacoes');


exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('produto').del()
    .then(function () {
      // Inserts seed entries
      return knex('produto').insert([
        {id: 1, nome: 'Cafeteira', valor: 10000, descricao: 'Cafeteira de café em capsula'},
        {id: 2, nome: 'adesivo', valor: 100, descricao: 'Adesivos com temática da empresa'},
        {id: 3, nome: 'Garrafa', valor: 500, descricao: 'Garrafa 500ml'}
      ]);
    });
};

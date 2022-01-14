
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('coin').del()
    .then(function () {
      // Inserts seed entries
      return knex('coin').insert([
        { saldo: 2, usuario_id: 1},
        { saldo: 10, usuario_id: 2}
      ]);
    });
};

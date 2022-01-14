
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('usuario').del()
    .then(function () {
      // Inserts seed entries
      return knex('usuario').insert([
        { nome: 'Fulano', senha: '$2a$08$tvcDXh3fVNOLNnrg/DY7UuJaLs57LC.u6xGcJAHSeUKkXCqgYwnRu', email: 'fulano@email.com', perfil: 'COMUM'},
        { nome: 'adm', senha: '$2a$08$Ci5QtkqQ6CZpIUeXfkAq1uPr2PwlvuEXVsLI699C8na3etmDoZALC', email: 'adm@email.com', perfil: 'COMUM;ADM' }
      ]);
    });
};

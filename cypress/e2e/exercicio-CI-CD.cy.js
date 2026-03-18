/// <reference types="cypress" />;

let token

describe('Testes da Funcionalidade Usuários', () => {

  it('Deve validar contrato de usuários', () => {
    cy.api({
      method: 'GET',
      url: 'usuarios',
      headers: { Authorization: token }
    }).should((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('quantidade');
      expect(response.body).to.have.property('usuarios');
      expect(response.body.usuarios[0]).to.include.all.keys(
        'nome',
        'email',
        'password',
        'administrador',
        '_id'
      );
    });
  });

  it('Deve listar usuários cadastrados', () => {
    cy.api({
      method: 'GET',
      url: 'usuarios',
      headers: { Authorization: token }
    }).should((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.usuarios).to.be.an('array');
    });
  });

  it('Deve cadastrar um usuário com sucesso', () => {
    let email = `fulano${Date.now()}@email.com`;

    cy.api({
      method: 'POST',
      url: 'usuarios',
      headers: { Authorization: token },
      body: {
        nome: "Fulano da Silva",
        email: email,
        password: "teste",
        administrador: "true"
      }
    }).should((response) => {
      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal("Cadastro realizado com sucesso");
    });
  });

  it('Deve validar um usuário com email inválido', () => {
    cy.api({
      method: 'POST',
      url: 'usuarios',
      body: {
        nome: "Fulano da Silva",
        email: "beltranoqa.com.br",
        password: "teste",
        administrador: "true"
      },
      failOnStatusCode: false
    }).should((response) => {
      expect(response.status).to.equal(400);
      expect(response.body.email).to.equal('email deve ser um email válido');
    });
  });

  it('Deve editar um usuário previamente cadastrado ', () => {
    let email = `fulano${Date.now()}@email.com`;

    cy.editarUsuario('Novo Fulano', email, 'senha123').then((userid) => {
      cy.api({
        method: 'PUT',
        url: `usuarios/${userid}`,
        headers: { Authorization: token },
        body: {
          nome: "Novo Fulano",
          email: email,
          password: "testealterada",
          administrador: "true"
        }
      }).should((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal("Registro alterado com sucesso");
      });
    });
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
    const uniqueEmail = `delete_${Date.now()}_${Math.random()}@qa.com`;

    cy.log(`Using email: ${uniqueEmail}`);

    cy.api({
      method: 'POST',
      url: 'usuarios',
      headers: { Authorization: token },
      body: {
        nome: "Novo Fulano",
        email: uniqueEmail,
        password: "teste",
        administrador: "true"
      }
    }).then((createResponse) => {
      expect(createResponse.status).to.equal(201);
      const userId = createResponse.body._id;
      cy.log(`User created with ID: ${userId}`);

      cy.api({
        method: 'DELETE',
        url: `usuarios/${userId}`,
        headers: { Authorization: token }
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal("Registro excluído com sucesso");
        
      });
    });
  });

});

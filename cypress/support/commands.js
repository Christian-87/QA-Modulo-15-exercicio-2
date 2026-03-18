Cypress.Commands.add('token', (email, senha) => {
    cy.request({
        method: 'POST',
        url: 'login',
        body: {
            "email": email,
            "password": senha
        }
    }).then((response) => {
        expect(response.status).to.equal(200)
        return response.body.authorization
    })
})

Cypress.Commands.add('cadastrarProduto', (token, produto, preco, descricao, quantidade) => {
    cy.request({
        method: 'POST',
        url: 'produtos',
        headers: { authorization: token },
        body: {
            "nome": produto,
            "preco": preco,
            "descricao": descricao,
            "quantidade": quantidade
        },
        failOnStatusCode: false
    })
})

Cypress.Commands.add('editarUsuario', (nome, email, senha) => {
    cy.api({
        method: 'POST',
        url: 'usuarios',

        body: {
            nome: nome,
            email: email,
            password: senha,
            administrador: "true"
        }

    }).then(response => {
        expect(response.status).to.equal(201)
        return response.body._id
    })
})

Cypress.Commands.add('criarUsuario', (nome, email, senha) => {
    return cy.api({
        method: 'POST',
        url: 'usuarios',
        body: {
            nome: nome,
            email: email,  // ← Must use the parameter!
            password: senha,
            administrador: "true"
        }
    }).then(response => {
        expect(response.status).to.equal(201)
        return response.body._id
    })
})

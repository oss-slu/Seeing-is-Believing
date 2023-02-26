export {};

describe('template spec', () => {
  it('passes', () => {
    cy.visit('localhost:3000')
    cy.get('[name="email"]').type('carlossalinas615@gmail.com')
    cy.get('[name="password"]').type('seeingisbelieving')
    cy.get('[type="submit"]').click()
  })
})
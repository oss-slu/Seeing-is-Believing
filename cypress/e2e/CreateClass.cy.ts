export {};

describe('template spec', () => {
  it('passes', () => {
    //open SIB
    cy.visit('localhost:3000')

    //login to teacher
    // cy.get('[name="email"]').type('carlossalinas615@gmail.com')
    // cy.get('[name="password"]').type('seeingisbelieving')
    // cy.get('[type="submit"]').click()

    //go to manage classes
    cy.get('[data-testid="MenuIcon"').click()
    cy.get('.css-1rxv3c6-MuiButtonBase-root-MuiButton-root > .MuiBox-root').click()
    cy.get('.MuiCollapse-wrapperInner > .MuiList-root > :nth-child(2) > .MuiButton-root > .MuiBox-root').click()

    //fill out 'add a class' form
    cy.get('#mui-4').type("Cypress Test Class")
    cy.get(':nth-child(6) > .MuiSelect-select').click()
    cy.get('[data-value="1L01SO2D8wv1WzkavXd4"]').click()
    cy.get(':nth-child(9) > .MuiSelect-select').click()
    cy.get('[data-value="v2FwTit1M5kMibOSx9RX"]').click()
    cy.get('#mui-6').click()
    cy.get('#mui-6-option-34').click()
    cy.get('#mui-7').click()

    
  });


})
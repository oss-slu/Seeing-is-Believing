export {};

describe('template spec', () => {
  it('passes', () => {
    cy.visit('localhost:3000')
    cy.get('[name="email"]').type('carlossalinas615@gmail.com')
    cy.get('[name="password"]').type('seeingisbelieving')
    cy.get('[type="submit"]').click()
    cy.get('[data-testid="MenuIcon"').click()
    cy.get('[class="MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium MuiButton-disableElevation MuiButtonBase-root  css-1rxv3c6-MuiButtonBase-root-MuiButton-root"]').click()
    cy.get('[href="/teacher/addHomework"]').click()
    cy.get('[class="MuiOutlinedInput-root MuiInputBase-root MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl css-wgqd7e-MuiInputBase-root-MuiOutlinedInput-root"]').type('Cypress Test Homework')
    cy.get('[id="mui-8"]').type('Test class 1')
    cy.get('[id="mui-8-option-0"]').click()
    cy.get('[class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"]').type('This is the description for Cypress Test Homework.')
    cy.get('[id="mui-10"]').click()
    cy.get('[id="mui-10-option-3"]').click()
    cy.get('[id="mui-10"]').click()
    cy.get('[id="mui-10-option-4"]').click()
    cy.get('[id="mui-10"]').click()
    cy.get('[id="mui-10-option-5"]').click()
    cy.get('[id="mui-10"]').click()
    cy.get('[id="mui-10-option-6"]').click()
    cy.get('[id="mui-10"]').click()
    cy.get('[id="mui-10-option-7"]').click()
    cy.get('[data-testid="CalendarIcon"]').click()
    cy.get('[aria-label="calendar view is open, switch to year view"]').click()
    cy.contains('button', '2099').click()
    cy.get('[id="mui-14"]').click()
    
  });


})


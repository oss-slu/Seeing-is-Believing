export {};

describe('template spec', () => {
  it('passes', () => {
    //open SIB
    cy.visit('localhost:3000')

    //login to teacher
    cy.get('[name="email"]').type('carlossalinas615@gmail.com')
    cy.get('[name="password"]').type('seeingisbelieving')
    cy.get('[type="submit"]').click()

    //
    cy.get('[data-testid="MenuIcon"').click()
    cy.get('[class="MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium MuiButton-disableElevation MuiButtonBase-root  css-1rxv3c6-MuiButtonBase-root-MuiButton-root"]').click()
    cy.get('[href="/teacher/addHomework"]').click()
    cy.get('[class="MuiOutlinedInput-root MuiInputBase-root MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl css-wgqd7e-MuiInputBase-root-MuiOutlinedInput-root"]').type('Cypress Test Homework')
    cy.get('[id="mui-8"]').type('Test Class')
    cy.get('[id="mui-8-option-1"]').click()
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
    cy.get('[aria-label="Mar 1, 2099"]').click()
    //save hw
    cy.get('[id="mui-14"]').click().wait(1000)

    //logout
    cy.get('.css-1cllrxs-MuiButtonBase-root-MuiIconButton-root').click()
    cy.get(':nth-child(2) > :nth-child(1) > .MuiButton-root').click()
    cy.get('.css-i4tgmu-MuiButtonBase-root > .MuiAvatar-root').click()
    cy.get('li.MuiMenuItem-root').click()

    //login to student and open hw
    cy.get('[name="email"]').type('carlos.salinas@slu.edu')
    cy.get('[name="password"]').type('seeingisbelieving')
    cy.get('[type="submit"]').click()
    cy.get('.MuiTableBody-root > :nth-child(2) > :nth-child(1)').click().wait(1000)
    cy.get('.MuiTableBody-root > :nth-child(1) > :nth-child(1) > .MuiTypography-root').click().wait(1000)

    //logout
    cy.get('.css-1cllrxs-MuiButtonBase-root-MuiIconButton-root').click()
    cy.get(':nth-child(2) > :nth-child(1) > .MuiButton-root').click()
    cy.get('.css-i4tgmu-MuiButtonBase-root > .MuiAvatar-root').click()
    cy.get('li.MuiMenuItem-root').click()

    //login to teacher
    cy.get('[name="email"]').type('carlossalinas615@gmail.com')
    cy.get('[name="password"]').type('seeingisbelieving')
    cy.get('[type="submit"]').click()
    
    //open hw's
    cy.get('[data-testid="MenuIcon"]').click()
    cy.get(':nth-child(2) > :nth-child(2) > .MuiButton-root').click()
    cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(1)').click()
    cy.get('.MuiTableRow-root > :nth-child(1) > .MuiTypography-root').click()

    //delete hw
    cy.get(':nth-child(1) > .css-7uue70-MuiTableCell-root > [aria-label="delete"]').click()

  


    
  });


})


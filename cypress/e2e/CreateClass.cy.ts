export {};

describe('template spec', () => {
  it('passes', () => {
    //open SIB
    cy.clearAllCookies()
    cy.clearAllLocalStorage()
    cy.clearAllSessionStorage()
    cy.visit('localhost:3000')

    // //login to student
    // cy.get('[name="email"]').type('carlos.salinas@slu.edu')
    // cy.get('[name="password"]').type('seeingisbelieving')
    // cy.get('[type="submit"]').click()

    // cy.get('.css-1cllrxs-MuiButtonBase-root-MuiIconButton-root').click()
    // cy.get(':nth-child(2) > .MuiButton-root').click()
    // cy.get(':nth-child(1) > .css-7uue70-MuiTableCell-root > .MuiButtonBase-root > [data-testid="DotsHorizontalIcon"]').click()
    // cy.get('[tabindex="0"] > .MuiListItemText-root > .MuiTypography-root').click()

    // //logout
    // //cy.get('.css-1cllrxs-MuiButtonBase-root-MuiIconButton-root').click()
    // //cy.get(':nth-child(2) > :nth-child(1) > .MuiButton-root').click()
    // cy.get('.css-i4tgmu-MuiButtonBase-root > .MuiAvatar-root').click()
    // cy.get('li.MuiMenuItem-root').click()

    //login to teacher
    cy.get('[name="email"]').type('carlossalinas615@gmail.com')
    cy.get('[name="password"]').type('seeingisbelieving')
    cy.get('[type="submit"]').click()

    //go to manage classes -> edit class
    cy.get('[data-testid="MenuIcon"').click()
    cy.get('.css-1rxv3c6-MuiButtonBase-root-MuiButton-root > .MuiBox-root').click()
    cy.get('.MuiCollapse-wrapperInner > .MuiList-root > :nth-child(2) > .MuiButton-root > .MuiBox-root').click()
    cy.get('.MuiTabs-flexContainer > :nth-child(2)').click().wait(1000)

    //select Cypress Test Class
    cy.get('[aria-hidden="false"] > .MuiGrid-root > :nth-child(1) > .css-0 > .MuiAutocomplete-root > .MuiFormControl-root > .MuiOutlinedInput-root > .MuiAutocomplete-endAdornment > .MuiButtonBase-root > [data-testid="ArrowDropDownIcon"]').click()
    cy.get('ul[role="listbox"] li').filter(':contains("Cypress Test Class")').click();

    //Kick Carlos out of Cypress Test Class
    cy.get('[data-tag-index="1"] > [data-testid="CancelIcon"]').click()

    //Submit Changes
    cy.contains('Save Changes').click()

    //logout
    cy.get('.css-i4tgmu-MuiButtonBase-root > .MuiAvatar-root').click()
    cy.get('li.MuiMenuItem-root').click()

    //login to student
    cy.get('[name="email"]').type('carlos.salinas@slu.edu')
    cy.get('[name="password"]').type('seeingisbelieving')
    cy.get('[type="submit"]').click()

    cy.get('.css-1cllrxs-MuiButtonBase-root-MuiIconButton-root').click()
    cy.get(':nth-child(2) > .MuiButton-root').click()
    cy.get(':nth-child(1) > .css-7uue70-MuiTableCell-root > .MuiButtonBase-root > [data-testid="DotsHorizontalIcon"]').click()
    cy.get('[tabindex="0"] > .MuiListItemText-root > .MuiTypography-root').click()

    //logout
    //cy.get('.css-1cllrxs-MuiButtonBase-root-MuiIconButton-root').click()
    //cy.get(':nth-child(2) > :nth-child(1) > .MuiButton-root').click()
    cy.get('.css-i4tgmu-MuiButtonBase-root > .MuiAvatar-root').click()
    cy.get('li.MuiMenuItem-root').click()

    //login to teacher
    cy.get('[name="email"]').type('carlossalinas615@gmail.com')
    cy.get('[name="password"]').type('seeingisbelieving')
    cy.get('[type="submit"]').click()

    //go to manage classes -> edit class
    cy.get('[data-testid="MenuIcon"').click()
    cy.get('.css-1rxv3c6-MuiButtonBase-root-MuiButton-root > .MuiBox-root').click()
    cy.get('.MuiCollapse-wrapperInner > .MuiList-root > :nth-child(2) > .MuiButton-root > .MuiBox-root').click()
    cy.get('.MuiTabs-flexContainer > :nth-child(2)').click().wait(1000)

    //select Cypress Test Class
    cy.get('[aria-hidden="false"] > .MuiGrid-root > :nth-child(1) > .css-0 > .MuiAutocomplete-root > .MuiFormControl-root > .MuiOutlinedInput-root > .MuiAutocomplete-endAdornment > .MuiButtonBase-root > [data-testid="ArrowDropDownIcon"]').click()
    cy.get('ul[role="listbox"] li').filter(':contains("Cypress Test Class")').click();

    //add Carlos to Class
    cy.get('[aria-hidden="false"] > .MuiGrid-root > :nth-child(1) > .css-0 > :nth-child(12) > .MuiFormControl-root > .MuiOutlinedInput-root').type("Carlos Salinas{Enter}", )



    //fill out 'add a class' form
    // cy.get('#mui-4').type("Cypress Test Class")
    // cy.get(':nth-child(6) > .MuiSelect-select').click()
    // cy.get('[data-value="1L01SO2D8wv1WzkavXd4"]').click()
    // cy.get(':nth-child(9) > .MuiSelect-select').click()
    // cy.get('[data-value="v2FwTit1M5kMibOSx9RX"]').click()
    // cy.get('#mui-6').click()
    // cy.get('#mui-6-option-34').click()
    // cy.get('#mui-7').click()

  });


})
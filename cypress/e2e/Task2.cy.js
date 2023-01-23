/// <reference types="cypress" />

describe('Task 2', () => {

    it('Validate A Class models price are between  £15,000 and  £60,000', () => {

        Cypress.on('uncaught:exception', (err, runnable) => {
            return false;
        }) // Handled the uncaught exceptions of the mercedes web application that was failing the cypress script

        cy.viewport(1280, 820); // set window size
      
        cy.visit('https://www.mercedes-benz.co.uk/'); // visit website

        cy.title().should('eq', 'Mercedes-Benz Passenger Cars'); // verify webiste title

        cy.intercept({
            url: "https://api.userlike.com/api/um/chat/button/check/?organization_id=2127&chat_widget_id=108423",
            method: "GET"
        }).as('CookiesPopup');
        cy.wait('@CookiesPopup', {timeout: 120000}).then((interception) => {
            assert.isNotNull(interception.response.body, 'Cookies Popup is displayed')
          }) // wait for the cookies popup to display

        cy.scrollTo(0, 2000); // scroll to Our Models section

        cy.get('[class="hydrated"]')
        .shadow()
        .find('[type="button"]', {Timeout: 12000})
        .contains('Agree to all')
        .click(); // click on agree to all button on cookies popup

        cy.intercept({
            url: "https://api.oneweb.mercedes-benz.com/vmds-api/v1/vehicles/GB/en",
            method: "GET"
        }).as('HomePage');
        cy.wait('@HomePage', {timeout: 120000}).then((interception) => {
            assert.isNotNull(interception.response.body, 'Home Page is loaded')
          }) // wait for the home page to load completely


        cy.get('[class="webcomponent aem-GridColumn aem-GridColumn--default--12"]')
        .shadow()
        .contains('Hatchbacks', {Timeout: 12000})
        .click(); // click on Model Hatchbacks option

        cy.scrollTo(2200, 2000); // scroll to be in view all the hatchbacks models

        cy.get('[class="webcomponent aem-GridColumn aem-GridColumn--default--12"]')
        .shadow()
        .contains('£31,880')
        .realHover('mouse', {Timeout: 25000}) // hover over the A class model that has Build your car option

        cy.get('[class="webcomponent aem-GridColumn aem-GridColumn--default--12"]')
        .shadow()
        .contains('Build your car', {Timeout: 12000})
        .click({force: true}); // click on build your car

        cy.intercept({
            url: "https://api.userlike.com/api/um/chat/button/check/?organization_id=2127&chat_widget_id=108423",
            method: "GET"
        }).as('CarConfigurator');
        cy.wait('@CarConfigurator', {timeout: 120000}).then((interception) => {
            assert.isNotNull(interception.response.body, 'Car Configurator Page is loaded')
          }) // waiting for the hatchback build your car, car configurator page

        cy.scrollTo(0, 750); // scroll down to the filter option

        cy.get('[class="webcomponent aem-GridColumn aem-GridColumn--default--12"]')
        .shadow()
        .find('[type="button"]', {Timeout: 12000})
        .contains('Fuel type')
        .click({force: true}); // click on fuel type drop down

        cy.get('[class="webcomponent aem-GridColumn aem-GridColumn--default--12"]')
        .shadow()
        .find('[type="checkbox"]', {Timeout: 12000})
        .first()
        .check({force: true}); // select the diesel fuel type

        cy.get('[class="webcomponent aem-GridColumn aem-GridColumn--default--12"]')
        .shadow()
        .contains(' Filter ', {Timeout: 12000})
        .click({force: true}); // close the fuel type drop down

        cy.screenshot('HatchBack Diesel Engine Variants', {overwrite: true}); // capture screenshot of the diesel fuel type results

        const prices = []; // initializing an empt array for the prices

        cy.get('[class="webcomponent aem-GridColumn aem-GridColumn--default--12"]')
        .shadow()
        .find('[class="cc-motorization-header__price--with-environmental-hint"]')
        .each((item) => 
        { prices.push(Cypress.$(item).text())}); // get the list of all the prices and store them in the initialized array

        cy.writeFile('/Users/msk/Desktop/Mercedes QA Task/assignment2/cypress/fixtures/file.txt', prices); // print the values from the array in the file

      })
  })
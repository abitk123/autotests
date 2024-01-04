/// <reference types="cypress" />

describe('Test suite', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080);
    });

    it('test case 1', () => {
        const expectedNumb = 164;
        const request = 'https://skillbox.ru/api/v6/ru/sales/skillbox/directions/all/nomenclature/profession/?page=1&limit=10&type=profession';

        cy.visit('https://skillbox.ru/');
        cy.get('.catalog__item--reverse > .catalog-card > .catalog-card__wrapper > .ui-stretched-link > .catalog-card__button').as('blocProf');
        cy.get('@blocProf').should('contain.text', expectedNumb);

        cy.intercept('GET', request).as('apiResponse');
        cy.get('@blocProf').click();
        cy.wait('@apiResponse').then((interception) => {
            const requestUrl = interception.request.url;
            const responseBody = interception.response.body;
            expect(requestUrl).to.include(request);
            expect(responseBody.meta.total).to.equal(expectedNumb);
        });

        cy.get('.ui-load-more').should('contain.text', expectedNumb - 10);
    });

    it('test case 2', () => {
        const expectedNumb = 164;
        const expectedArticles = 20;

        const request = 'https://skillbox.ru/api/v6/ru/sales/skillbox/directions/all/nomenclature/profession/?page=1&limit=20&type=profession';

        cy.visit('https://skillbox.ru/');
        cy.get('.catalog__item--reverse > .catalog-card > .catalog-card__wrapper > .ui-stretched-link > .catalog-card__button').as('blocProf');

        cy.get('@blocProf').click();

        cy.intercept('GET', request).as('apiRequest');

        cy.wait('@apiRequest', { timeout: 10000 }).then((interception) => {
            const requestUrl = interception.request.url;
            expect(requestUrl).to.include(request);
        });
        cy.get('.ui-load-more').click();

        cy.get('.ui-load-more').should('contain.text', expectedNumb - expectedArticles);

        cy.get('div.card-list article').should('have.length', expectedArticles);
    });
});

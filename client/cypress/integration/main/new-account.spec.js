/// <reference types="cypress" />

describe("New account", function () {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit("/");

    cy.get("#test-user-login").type(Cypress.env("login"));
    cy.get("#test-user-password").type(Cypress.env("password")).blur();
    cy.get("#test-login-button").click();
  });

  it("should be success created", () => {
    cy.wait(500);
    const oldLength = Cypress.$('[data-testid="test-account-profile"]').length;

    cy.get("#test-new-account").click();

    cy.wait(500);
    cy.get('[data-testid="test-account-profile"]').its('length').should('be.gte', oldLength)
  });
});

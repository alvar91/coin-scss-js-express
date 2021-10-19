/// <reference types="cypress" />

describe("New transaction", function () {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit("/");

    cy.get("#test-user-login").type(Cypress.env("login"));
    cy.get("#test-user-password").type(Cypress.env("password")).blur();
    cy.get("#test-login-button").click();

    cy.visit(`/account/${Cypress.env("testAccountFrom")}`);
  });

  it("should be success created", () => {
    cy.get('[data-testid="test-transaction-dropdown"]').type(
      Cypress.env("testAccountTo")
    );
    cy.get('[data-testid="test-transaction-input"]').type(1).blur();

    cy.wait(500);
    cy.get("#test-new-transaction").click();
    cy.url().should("include", "/accounts");
  });
});

/// <reference types="cypress" />

describe("New currency", function () {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit("/");

    cy.get("#test-user-login").type(Cypress.env("login"));
    cy.get("#test-user-password").type(Cypress.env("password")).blur();
    cy.get("#test-login-button").click();

    cy.visit("/currency");
  });

  it("should be fail", () => {
    cy.wait(500);
    cy.get("#test-new-currency").type("сто").blur();

    cy.wait(500);
    cy.get("#test-new-transaction-button").should("be.disabled");
  });

  it("should be success created", () => {
    cy.wait(500);
    cy.get("#test-new-currency").type(1).blur();

    cy.wait(500);
    cy.get("#test-new-transaction-button").click();
    cy.url().should("include", "/accounts");
  });
});

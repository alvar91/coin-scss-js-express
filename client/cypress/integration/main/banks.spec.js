/// <reference types="cypress" />

describe("Banks", function () {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit("/");

    cy.get("#test-user-login").type(Cypress.env("login"));
    cy.get("#test-user-password").type(Cypress.env("password")).blur();
    cy.get("#test-login-button").click();

    cy.visit("/banks");
  });

  it("should be success redirected", () => {
    cy.url().should("include", "/banks");
  });
});

/// <reference types="cypress" />

describe("Logout", function () {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit("/");

    cy.get("#test-user-login").type(Cypress.env("login"));
    cy.get("#test-user-password").type(Cypress.env("password")).blur();
    cy.get("#test-login-button").click();
  });

  it("should be success redirected", () => {
    cy.visit("/logout");

    cy.url().should("include", "/");
  });
});

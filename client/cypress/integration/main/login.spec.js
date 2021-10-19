/// <reference types="cypress" />

describe("Login", function () {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit("/");

  });

  it("should be fail", () => {
    cy.wait(500);
    cy.get("#test-user-login").type("incorrectLogin");
    cy.get("#test-user-password").type("incorrectPassword").blur();
    cy.get("#test-login-button").click();
    cy.url().should("include", "/");
    // cy.get("#test-user-login").clear();
    // cy.get("#test-user-password").clear();
  });

  it("should be success", () => {


    cy.get("#test-user-login").type(Cypress.env("login"));
    cy.get("#test-user-password").type(Cypress.env("password")).blur();

    cy.get("#test-login-button").click();
    cy.url().should("include", "/accounts");
  });
});

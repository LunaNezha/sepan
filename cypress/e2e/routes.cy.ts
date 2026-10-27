describe("Application routes", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/prescriptions", { body: [] });
  });

  it("renders the dashboard", () => {
    cy.viewport(1280, 900);
    cy.visit("/");
    cy.get("ion-menu").should("be.visible");
    cy.get('a[href="/prescriptions/new"]:visible').should("exist");
    cy.title().should("eq", "سپان | سامانه پذیرش الکترونیک نسخه");
    cy.get(".care-brand img").should("be.visible");
  });

  it("renders prescription tracking", () => {
    cy.visit("/prescription-tracking");
    cy.get('input[name="idTracking"]').should("be.visible");
    cy.get('button[type="submit"]').should("be.visible");
  });

  it("continues from username to password", () => {
    cy.visit("/auth/login/username");
    cy.get('input[name="username"]').type("1234567890");
    cy.get('button[type="submit"]').click();
    cy.location("pathname").should("eq", "/auth/login/password");
    cy.get('input[name="username"]:visible').should("have.value", "1234567890");
    cy.get('input[name="password"]').should("be.visible");
  });

  for (const route of ["register", "verify-code", "change-phone-number"]) {
    it(`renders /auth/${route}`, () => {
      cy.visit(`/auth/${route}`);
      cy.get("form").should("be.visible");
      cy.get('button[type="submit"]').should("be.visible");
    });
  }
  it("handles unknown routes and returns home", () => {
    cy.visit("/missing-page");
    cy.get("#not-found-title").should("be.visible");
    cy.get('.care-not-found-actions a[href="/"]').contains("بازگشت").click();
    cy.location("pathname").should("eq", "/");
    cy.get('a[href="/prescriptions/new"]:visible').should("exist");
  });

  it("preserves browser back navigation between login steps", () => {
    cy.visit("/auth/login/username");
    cy.get('input[name="username"]').type("1234567890");
    cy.get('button[type="submit"]').click();
    cy.get('input[name="password"]').should("be.visible");
    cy.go("back");
    cy.location("pathname").should("eq", "/auth/login/username");
    cy.get('.ion-page:not(.ion-page-hidden) input[name="username"]').should(
      "be.visible",
    );
  });

  it("renders the mobile tab bar", () => {
    cy.viewport(390, 844);
    cy.visit("/");
    cy.get("ion-tab-bar").should("be.visible");
    cy.get("ion-tab-button").should("have.length", 4);
  });

  it("persists the selected theme", () => {
    cy.visit("/");
    cy.get("body").should("not.have.class", "dark");
    cy.get('[data-testid="theme-toggle"]:visible').click();
    cy.get("body").should("have.class", "dark");
    cy.reload();
    cy.get("body").should("have.class", "dark");
  });

  it("changes language and document direction", () => {
    cy.visit("/");
    cy.get(".care-language select:visible").select("en");
    cy.get("body").should("have.attr", "dir", "ltr");
    cy.get("ion-menu").contains("Overview").should("exist");
    cy.title().should("eq", "Sepan | Electronic Prescription Admission System");
    cy.reload();
    cy.get("html")
      .should("have.attr", "lang", "en")
      .and("have.attr", "dir", "ltr");
  });

  it("accepts and validates the complete verification code", () => {
    cy.visit("/auth/verify-code");
    cy.get('input[aria-label="Digit 1"]').type("123456");
    cy.get('input[aria-label="Digit 6"]').should("have.value", "6");
    cy.get('button[type="submit"]').last().click();
    cy.get(".fi-rr-exclamation").should("not.exist");
  });
});

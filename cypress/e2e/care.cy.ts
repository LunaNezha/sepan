const switchToEnglish = () =>
  cy.get(".care-language select:visible").select("en");
const attachPdf = () =>
  cy.get('[data-testid="prescription-files"]').selectFile(
    {
      contents: Cypress.Buffer.from(
        "%PDF-1.4\nSample prescription for interface testing only.",
      ),
      fileName: "sample-prescription.pdf",
      mimeType: "application/pdf",
    },
    { force: true },
  );
const proceed = () =>
  cy.get('[data-testid="request-continue"]:visible').click();
const assertNoOverflow = () =>
  cy.get("main:visible, .care-header-inner:visible").each(($element) => {
    expect($element[0].scrollWidth).to.be.at.most($element[0].clientWidth + 1);
  });

describe("Sepan care experience", () => {
  beforeEach(() => cy.intercept("GET", "**/prescriptions", { body: [] }));

  it("creates a request and reflects staff status changes in the patient view", () => {
    cy.viewport(1440, 1000);
    cy.visit("/prescriptions/new");
    switchToEnglish();
    proceed();
    cy.get("#file-error").should("contain", "at least one");
    attachPdf();
    cy.contains("sample-prescription.pdf").should("be.visible");
    cy.screenshot("care-upload-files", { capture: "viewport" });
    proceed();
    cy.get('input[value="delivery"]').check();
    proceed();
    cy.get(".care-error-summary")
      .should("be.focused")
      .and("contain", "contact name");
    cy.get("#contact-name").type("Sample Patient");
    cy.get("#contact-phone").type("09123456789");
    cy.get("#contact-address").type("12 Sample Street, Sample City");
    proceed();
    cy.contains("Everything look right?").should("be.visible");
    cy.screenshot("care-request-review", { capture: "viewport" });
    cy.get("main:visible").contains("button", "Back").click();
    cy.get("#contact-name").should("have.value", "Sample Patient");
    proceed();
    cy.get("#contact-consent").check();
    proceed();
    cy.get('[data-testid="created-request-id"]')
      .invoke("text")
      .then((id) => {
        cy.get("main:visible").contains("a", "Follow this request").click();
        cy.get("main:visible").should("contain", id);
        cy.get('.care-workspaces a[href="/pharmacy"]:visible')
          .should("have.length", 1)
          .click();
        cy.get("#queue-search").type("Sample Patient");
        cy.get(`[data-testid="queue-${id}"]`).click();
        cy.get(".care-order-detail").should(
          "contain",
          "sample-prescription.pdf",
        );
        cy.screenshot("care-pharmacy-order", { capture: "viewport" });
        cy.get('[data-testid="advance-status"]').click();
        cy.get(".care-live-announcement").should("contain", "Being prepared");
        cy.get('.care-workspaces a[href="/"]:visible')
          .should("have.length", 1)
          .click();
        cy.get("main:visible").contains("a", "View progress").click();
        cy.get('main:visible .care-timeline [aria-current="step"]').should(
          "contain",
          "Being prepared",
        );
      });
  });

  it("supports a mobile pickup request with Persian phone digits", () => {
    cy.viewport(375, 812);
    cy.visit("/prescriptions/new");
    attachPdf();
    proceed();
    cy.get("#contact-name").type("بیمار نمونه");
    cy.get("#contact-phone").type("۰۹۱۲۳۴۵۶۷۸۹");
    cy.get("#contact-address").should("not.exist");
    proceed();
    cy.get("#contact-consent").should("be.visible");
    proceed();
    cy.get(".care-error-summary").should("be.focused");
    cy.get("#contact-consent").check();
    proceed();
    cy.get('[data-testid="created-request-id"]').should("be.visible");
    assertNoOverflow();
  });

  it("rejects unsupported files and removes selected files", () => {
    cy.visit("/prescriptions/new");
    switchToEnglish();
    cy.get('[data-testid="prescription-files"]').selectFile(
      {
        contents: Cypress.Buffer.from("executable"),
        fileName: "invalid.exe",
        mimeType: "application/octet-stream",
      },
      { force: true },
    );
    cy.get("#file-error").should("contain", "photos or PDFs");
    attachPdf();
    cy.get('button[aria-label="Remove sample-prescription.pdf"]').click();
    cy.get(".care-attached-file").should("not.exist");
    proceed();
    cy.get("#file-error").should("be.visible");
  });

  it("filters the pharmacy queue and handles empty results", () => {
    cy.visit("/pharmacy");
    switchToEnglish();
    cy.get(".care-filters").contains("button", "Awaiting review").click();
    cy.get(".care-queue-list > li").should("have.length", 1);
    cy.get('[data-testid="queue-SP-1049"]').click();
    cy.get('[data-testid="advance-status"]').click();
    cy.get(".care-queue-panel").should("contain", "No requests match");
    cy.get(".care-filters").contains("button", "All requests").click();
    cy.get("#queue-search").type("does-not-exist");
    cy.get(".care-queue-panel").should("contain", "No requests match");
  });

  it("finds requests and presents a useful empty state", () => {
    cy.visit("/prescription-tracking");
    switchToEnglish();
    cy.get("#tracking-search").type("UNKNOWN");
    cy.get('button[type="submit"]').click();
    cy.get("main:visible").should("contain", "No requests found");
    cy.get("#tracking-search").clear().type("sp-1048");
    cy.get('button[type="submit"]').click();
    cy.get("#tracking-title").should("have.text", "SP-1048");
  });

  it("keeps analytics available in the pharmacy workspace", () => {
    cy.visit("/pharmacy/analytics");
    cy.get(".recharts-wrapper").should("exist");
  });

  it("navigates with the mobile tabs and keeps controls touch friendly", () => {
    cy.viewport(375, 812);
    cy.visit("/");
    cy.get('ion-tab-button[href="/prescription-tracking"]').click();
    cy.location("pathname").should("eq", "/prescription-tracking");
    cy.get(".care-timeline").should("be.visible");
    cy.get('ion-tab-button[href="/help"]').click();
    cy.location("pathname").should("eq", "/help");
    cy.get("main:visible .care-details summary").first().should("be.visible");
    cy.get(
      ".care-header-inner:visible .care-icon-button, .care-workspaces:visible a",
    ).each(($control) => {
      const bounds = $control[0].getBoundingClientRect();
      expect(bounds.height).to.be.at.least(44);
      expect(bounds.width).to.be.at.least(44);
    });
  });

  for (const [width, height] of [
    [375, 812],
    [768, 1024],
    [1024, 768],
    [1440, 1000],
  ]) {
    it(`renders without overflow at ${width}×${height} in both directions`, () => {
      cy.viewport(width, height);
      cy.visit("/");
      cy.get("html").should("have.attr", "dir", "rtl");
      cy.get("main:visible h1").should("be.visible");
      assertNoOverflow();
      cy.screenshot(`care-dashboard-rtl-${width}`, { capture: "viewport" });
      switchToEnglish();
      cy.get("html").should("have.attr", "dir", "ltr");
      assertNoOverflow();
      cy.screenshot(`care-dashboard-ltr-${width}`, { capture: "viewport" });
    });
  }

  it("supports keyboard navigation, readable text scaling, and dark mode", () => {
    cy.viewport(1024, 900);
    cy.visit("/");
    switchToEnglish();
    cy.get(".care-workspaces a:visible").first().focus();
    cy.press(Cypress.Keyboard.Keys.TAB);
    cy.focused().should("have.attr", "href", "/pharmacy");
    cy.get('[data-testid="theme-toggle"]:visible').click();
    cy.get("body").should("have.class", "dark");
    cy.document().then((doc) => (doc.documentElement.style.fontSize = "32px"));
    assertNoOverflow();
    cy.screenshot("care-large-text-dark", { capture: "viewport" });
  });

  it("respects reduced motion and keeps navigation usable on a small landscape screen", () => {
    cy.viewport(812, 375);
    cy.then(() =>
      Cypress.automation("remote:debugger:protocol", {
        command: "Emulation.setEmulatedMedia",
        params: {
          features: [{ name: "prefers-reduced-motion", value: "reduce" }],
        },
      }),
    );
    cy.visit("/");
    cy.get("main:visible .care-button")
      .first()
      .should("have.css", "transition-duration", "0s");
    cy.get("ion-tab-bar").should("be.visible");
    assertNoOverflow();
    cy.then(() =>
      Cypress.automation("remote:debugger:protocol", {
        command: "Emulation.setEmulatedMedia",
        params: { features: [] },
      }),
    );
  });
});

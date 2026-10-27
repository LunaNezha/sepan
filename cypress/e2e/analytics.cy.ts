const analyticsMain = () => cy.get("main.care-analytics:visible");
const metric = (name: string) =>
  cy.get(`[data-testid="analytics-${name}"] .care-analytics-number`);
const useEnglish = () => cy.get(".care-language select:visible").select("en");
const noAnalyticsOverflow = () => {
  cy.get(
    "main.care-analytics:visible, main.care-analytics:visible .care-card",
  ).each(($element) => {
    expect($element[0].scrollWidth).to.be.at.most($element[0].clientWidth + 1);
  });
};

describe("Pharmacy activity reports", () => {
  it("summarizes the queue and switches the reporting period with keyboard controls", () => {
    cy.viewport(1440, 1000);
    cy.visit("/pharmacy/analytics");
    useEnglish();
    metric("total").should("have.text", "3");
    metric("reviewing").should("have.text", "1");
    metric("inProgress").should("have.text", "2");
    metric("completed").should("have.text", "0");
    cy.get(".care-analytics-data summary").click();
    cy.get(".care-analytics-data tbody tr").should("have.length", 7);
    cy.get(".care-analytics-period button")
      .last()
      .scrollIntoView()
      .focus()
      .should("be.focused");
    cy.window().then((win) => win.focus());
    cy.press(Cypress.Keyboard.Keys.SPACE);
    cy.get(".care-analytics-period button")
      .last()
      .should("have.attr", "aria-pressed", "true");
    cy.get(".care-analytics-data tbody tr").should("have.length", 30);
    cy.get(".care-analytics-data tbody td").then(($cells) => {
      const sum = Array.from($cells).reduce(
        (value, cell) => value + Number(cell.textContent),
        0,
      );
      expect(sum).to.eq(3);
    });
    cy.get(".care-analytics-data summary").click();
    noAnalyticsOverflow();
    cy.screenshot("analytics-desktop-ltr", { capture: "fullPage" });
  });

  it("reflects status updates made in the pharmacy queue", () => {
    cy.visit("/pharmacy");
    useEnglish();
    cy.get('[data-testid="queue-SP-1049"]').click();
    cy.get('[data-testid="advance-status"]').click();
    cy.get(".care-live-announcement").should("contain", "Being prepared");
    cy.get('[data-testid="queue-SP-1050"]').click();
    cy.get('[data-testid="advance-status"]').click();
    cy.get(".care-live-announcement").should("contain", "Completed");
    cy.get('main:visible a[href="/pharmacy/analytics"]').click();
    metric("reviewing").should("have.text", "0");
    metric("inProgress").should("have.text", "2");
    metric("completed").should("have.text", "1");
    cy.get('[data-testid="analytics-completed"]').should("contain", "33%");
    metric("total").should("have.text", "3");
    analyticsMain().find('a[href="/pharmacy"]').first().click();
    cy.get(".care-queue-panel").should("be.visible");
  });

  it("shows an honest empty period and restores counts for a wider date range", () => {
    cy.visit("/pharmacy/analytics");
    useEnglish();
    cy.clock(Date.now() + 8 * 24 * 60 * 60 * 1000, ["Date"]);
    cy.get(".care-analytics-period button").last().click();
    metric("total").should("have.text", "3");
    cy.get(".care-analytics-period button").first().click();
    metric("total").should("have.text", "0");
    cy.get(".care-analytics-chart--empty").should(
      "contain",
      "No requests were created",
    );
    cy.get('[data-testid="analytics-completed"]').should("contain", "0%");
    analyticsMain().should("not.contain", "NaN");
  });

  for (const [width, height] of [
    [375, 812],
    [768, 1024],
    [812, 375],
    [1440, 1000],
  ]) {
    it(`keeps charts and labels readable in RTL/LTR and dark mode at ${width}px`, () => {
      cy.viewport(width, height);
      cy.visit("/pharmacy/analytics");
      cy.get("html").should("have.attr", "dir", "rtl");
      metric("total").should("have.text", "۳");
      cy.get(".recharts-bar-rectangle").should("exist");
      cy.get(".care-analytics-period button").each(($button) =>
        expect($button[0].getBoundingClientRect().height).to.be.at.least(48),
      );
      noAnalyticsOverflow();
      cy.screenshot(`analytics-rtl-${width}`, { capture: "fullPage" });
      useEnglish();
      cy.get("html").should("have.attr", "dir", "ltr");
      cy.get('[data-testid="theme-toggle"]:visible').click();
      cy.get("body").should("have.class", "dark");
      noAnalyticsOverflow();
      cy.screenshot(`analytics-ltr-dark-${width}`, { capture: "fullPage" });
      cy.document().then((doc) => {
        doc.documentElement.style.fontSize = "32px";
      });
      cy.get(".care-analytics-data summary")
        .scrollIntoView()
        .click({ scrollBehavior: "center" });
      noAnalyticsOverflow();
    });
  }
});

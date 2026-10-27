const checkOverflow = () =>
  cy.get("main:visible").should(($main) => {
    expect($main[0].scrollWidth).to.be.at.most($main[0].clientWidth + 1);
  });
const english = () => cy.get(".care-language select:visible").select("en");

describe("Care typography, search, and recovery", () => {
  beforeEach(() => cy.intercept("GET", "**/prescriptions", { body: [] }));

  for (const width of [375, 1440]) {
    it(`keeps request search full width and usable in both directions at ${width}px`, () => {
      cy.viewport(width, 1000);
      cy.visit("/prescription-tracking");
      cy.get(".care-search-toolbar").should(($toolbar) => {
        const main = $toolbar[0].parentElement!;
        const style = getComputedStyle(main);
        const available =
          main.clientWidth -
          parseFloat(style.paddingLeft) -
          parseFloat(style.paddingRight);
        expect($toolbar[0].getBoundingClientRect().width).to.be.closeTo(
          available,
          2,
        );
      });
      checkOverflow();
      cy.screenshot(`tracking-rtl-${width}`, { capture: "viewport" });
      english();
      cy.get("#tracking-status").select("completed");
      cy.get("main:visible").should("contain", "No requests found");
      cy.contains(".care-search-reset", "Show all requests").click();
      cy.get("#tracking-title").should("have.text", "SP-1048");
      cy.get("#tracking-status").should("have.value", "all");
      cy.get("#tracking-search").type("sp-1048");
      cy.get('.care-search-form button[type="submit"]').click();
      cy.get("#tracking-title").should("have.text", "SP-1048");
      cy.get(
        ".care-search-form input, .care-search-form select, .care-search-form button",
      ).each(($control) => {
        expect($control[0].getBoundingClientRect().height).to.be.at.least(44);
      });
      checkOverflow();
      cy.screenshot(`tracking-ltr-${width}`, { capture: "viewport" });
    });
  }

  it("provides translated 404 recovery without clipping at enlarged text sizes", () => {
    cy.viewport(375, 812);
    cy.visit("/a-missing-page");
    cy.get("#not-found-title").should("contain", "مراقبت");
    cy.get('.care-not-found-actions a[href="/"]').should("be.visible");
    checkOverflow();
    cy.screenshot("not-found-rtl-mobile", { capture: "viewport" });
    english();
    cy.get('[data-testid="theme-toggle"]:visible').click();
    cy.document().then((doc) => {
      doc.documentElement.style.fontSize = "32px";
    });
    checkOverflow();
    cy.get('.care-not-found-actions a[href="/"]').click();
    cy.location("pathname").should("eq", "/");
    cy.viewport(1440, 1000);
    cy.visit("/a-missing-page");
    cy.get("#not-found-title").should("contain", "back to care");
    cy.screenshot("not-found-ltr-dark-desktop", { capture: "viewport" });
  });

  it("uses IranYekan in both languages and inside Ionic shadow controls and a modal", () => {
    cy.viewport(375, 812);
    cy.visit("/");
    cy.get("body, .care-shell:visible, .care-language select:visible").each(
      ($element) => {
        expect(getComputedStyle($element[0]).fontFamily).to.include(
          "iranyekan",
        );
      },
    );
    english();
    cy.get('ion-tab-button[href="/prescription-tracking"]')
      .shadow()
      .find("a")
      .should("have.css", "font-family")
      .and("include", "iranyekan");
    cy.document().then(async (doc) => {
      const loaded = await doc.fonts.load('400 16px "iranyekan"');
      expect(loaded.length).to.be.greaterThan(0);
    });
    cy.visit("/auth/register");
    cy.get('input[name="firstName"], input[name="username"]').each(($input) => {
      expect(getComputedStyle($input[0]).fontFamily).to.include("iranyekan");
    });
    cy.get("ion-datetime-button").shadow().find("button").first().click();
    cy.get("ion-modal")
      .should("be.visible")
      .and("have.css", "font-family")
      .and("include", "iranyekan");
    cy.get("ion-datetime")
      .shadow()
      .find("button")
      .first()
      .should("have.css", "font-family")
      .and("include", "iranyekan");
  });

  it("keeps navigation and overscroll surfaces on the care palette in both themes", () => {
    cy.viewport(1024, 900);
    cy.visit("/");
    const assertBackgrounds = (expected: string) => {
      cy.get(
        "body, #root, ion-app, ion-split-pane, ion-router-outlet, ion-tabs, .ion-page:visible",
      ).each(($element) => {
        expect(getComputedStyle($element[0]).backgroundColor).to.equal(
          expected,
        );
      });
      cy.get("ion-content.care-content:visible")
        .shadow()
        .find('[part="background"]')
        .should("have.css", "background-color", expected);
    };
    for (const [dark, background] of [
      [false, "rgb(245, 248, 246)"],
      [true, "rgb(16, 35, 30)"],
    ] as const) {
      if (dark) cy.get('[data-testid="theme-toggle"]:visible').click();
      assertBackgrounds(background);
      cy.get('.care-workspaces:visible a[href="/pharmacy"]').click();
      cy.location("pathname").should("eq", "/pharmacy");
      cy.get(".care-header:visible").should("have.length", 1);
      assertBackgrounds(background);
      cy.get("ion-content.care-content:visible")
        .shadow()
        .find('[part="scroll"]')
        .scrollTo("bottom", { ensureScrollable: false });
      cy.get('.care-workspaces:visible a[href="/"]').click();
      cy.location("pathname").should("eq", "/");
      cy.get(".care-header:visible").should("have.length", 1);
      assertBackgrounds(background);
    }
  });
});

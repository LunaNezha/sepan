import fa from "../../public/locales/fa/translations.json";
import en from "../../public/locales/en/translations.json";

// Set appBase=/sepan when testing the production build through vite preview.
const appBase = Cypress.expose("appBase") ?? "";
const appPath = (path = "/") => `${appBase}${path}`;

describe("Deployment routing and translations", () => {
  it("loads translations under the app base and preserves desktop navigation", () => {
    cy.viewport(1280, 900);
    cy.intercept("GET", appPath("/locales/fa/translations.json")).as("persian");
    cy.visit(appPath());
    cy.wait("@persian").its("response.statusCode").should("eq", 200);
    cy.get(`.care-workspaces a[href="${appPath("/pharmacy")}"]:visible`).click();
    cy.location("pathname").should("eq", appPath("/pharmacy"));
    cy.get("main:visible h1").should("have.text", fa.care.queueTitle);
    cy.get(`.care-nav a[href="${appPath("/pharmacy/help")}"]:visible`).click();
    cy.location("pathname").should("eq", appPath("/pharmacy/help"));
    cy.go("back");
    cy.location("pathname").should("eq", appPath("/pharmacy"));
    cy.get("main:visible h1").should("have.text", fa.care.queueTitle);
    cy.go("forward");
    cy.location("pathname").should("eq", appPath("/pharmacy/help"));
  });

  it("keeps mobile Ionic tab transitions under the app base", () => {
    cy.viewport(390, 844);
    cy.visit(appPath());
    cy.get('ion-tab-button[tab="tracking"]').click();
    cy.location("pathname").should("eq", appPath("/prescription-tracking"));
    cy.get('input[name="idTracking"]').should("be.visible");
    cy.get('ion-tab-button[tab="home"]').click();
    cy.location("pathname").should("eq", appPath());
    cy.get('ion-tab-button[tab="new"]').click();
    cy.location("pathname").should("eq", appPath("/prescriptions/new"));
    cy.get('[data-testid="prescription-files"]').should("exist");
  });

  it("loads English and preserves the translated language after refresh", () => {
    cy.visit(appPath("/pharmacy"));
    cy.get("main:visible h1").should("have.text", fa.care.queueTitle);
    cy.intercept("GET", appPath("/locales/en/translations.json")).as("english");
    cy.get(".care-language select:visible").select("en");
    cy.wait("@english").its("response.statusCode").should("eq", 200);
    cy.get("main:visible h1").should("have.text", en.care.queueTitle);
    cy.get("html").should("have.attr", "lang", "en").and("have.attr", "dir", "ltr");
    cy.reload();
    cy.get("main:visible h1").should("have.text", en.care.queueTitle);
    cy.get(".care-language select:visible").select("fa");
    cy.get("main:visible h1").should("have.text", fa.care.queueTitle);
    cy.get("html").should("have.attr", "lang", "fa").and("have.attr", "dir", "rtl");
  });

  if (appBase) {
    it("renders a direct nested URL from the GitHub Pages 404 app shell", () => {
      cy.request(appPath("/404.html")).then(({ body }) => {
        cy.intercept("GET", appPath("/pharmacy?source=bookmark"), {
          statusCode: 404,
          headers: { "content-type": "text/html" },
          body,
        });
      });
      cy.visit(appPath("/pharmacy?source=bookmark"), { failOnStatusCode: false });
      cy.get("main:visible h1").should("have.text", fa.care.queueTitle);
      cy.location("pathname").should("eq", appPath("/pharmacy"));
      cy.location("search").should("eq", "?source=bookmark");
    });
  }
});

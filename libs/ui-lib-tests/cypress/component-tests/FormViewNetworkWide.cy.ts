import { staticIpPage } from "../views/staticIpPage";

describe('Network wide configuration component test', () => {
  beforeEach(() => {
    cy.visit(
      'http://localhost:6006/iframe.html?args=&id=networkwide--network-wide&viewMode=story',
    );
    cy.wait(3000);
  });
  it('ipv6 fields should only appear after clicking on dual stack', () => {
    staticIpPage.networkWideMachineNetwork('ipv6').should("not.exist");
    staticIpPage.networkWideMachineGateway('ipv6').should("not.exist");
    staticIpPage.dualStackNetworking().click();
    cy.wait(3000);
    staticIpPage.networkWideMachineNetwork('ipv6').should("exist");
    staticIpPage.networkWideMachineGateway('ipv6').should("exist");
    cy.wait(2000);
  });

});

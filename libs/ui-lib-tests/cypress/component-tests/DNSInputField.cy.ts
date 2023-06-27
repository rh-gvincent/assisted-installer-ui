import { commonActions } from "../views/common";
import { staticIpPage } from "../views/staticIpPage";

describe('DNS Field', () => {
  beforeEach(() => {
    cy.visit(`http://localhost:6006/iframe.html
?args=&id=dnsfield--dns-input-field-wrapper
&viewMode=story`);
  });

  it('nrt Can use IPv4 and IPv6 on DNS when dual stack', () => {
    cy.fixture('data/ipv4-and-ipv6-addresses.json').then((addresses) => {
      addresses.forEach((dnsEntry) => {
        staticIpPage.networkWideDns().type(dnsEntry);
        commonActions.getDNSErrorMessage().should('not.exist');
        staticIpPage.networkWideDns().clear();
      });
    });
  });
});

import { commonActions } from "../views/common";
import { staticIpPage } from "../views/staticIpPage";

describe('Network wide configuration component test', () => {
  beforeEach(() => {
    cy.visit(
      `http://localhost:6006/iframe.html?
args=&id=networkwide--network-wide&viewMode=story`,
    );    
  });
  it('mixed ipv4 and ipv6 should only be enabled in dual stack', () => {
    const dns = "192.168.1.46,cf72:7c8c:484d:033d:37d1:1696:8f89:632f";
    staticIpPage.networkWideDns().type(dns);    
    commonActions.getDNSErrorMessage().should("exist");        
    staticIpPage.dualStackNetworking().click();    
    commonActions.getDNSErrorMessage().should("not.exist");        
  });
});

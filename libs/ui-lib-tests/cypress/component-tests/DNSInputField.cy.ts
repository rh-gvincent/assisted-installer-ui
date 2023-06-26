describe('NameField', () => {
  beforeEach(() => {
    cy.visit(
      'http://localhost:6006/iframe.html?args=&id=dnsinputfieldwrapper--dns-input-field-wrapper&viewMode=story',
    );
  });

  it('nrt Can use IPv4 and IPv6 on DNS when dual stack', () => {
    cy.fixture('data/ipv4-and-ipv6-addresses.json').then((addresses) => {
      addresses.forEach((dnsEntry) => {
        cy.findByRole('textbox', { name: /dns/i , timeout: 12_000}).type(dnsEntry);
        cy.get('#form-input-dns-field-helper-error').should('not.exist');
        cy.findByRole('textbox', { name: /dns/i , timeout: 12_000}).clear();
      });
    });
  });
});

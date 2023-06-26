describe('NameField', () => {
  beforeEach(() => {
    cy.visit(
      'http://localhost:6006/iframe.html?args=&id=richinputfielstory--rich-input-fiel-story&viewMode=story',
    );
  });

  it('Type invalid character should show two errors in the popover', () => {
    cy.findByRole('textbox', { name: /name/i , timeout: 12_000}).type('&&&');
    cy.findByRole('dialog', { name: /validation popover/i }).should('exist');
    cy.findByRole('alert', {
      name: 'ai:Start and end with a lowercase letter or a number.',
    }).should('exist');
    cy.findByRole('alert', {
      name: 'ai:Use lowercase alphanumeric characters or hyphen (-)',
    }).should('exist');
  });
});

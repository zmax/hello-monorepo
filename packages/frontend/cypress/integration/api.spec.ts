describe('Frontend Testing', () => {
  it('API server works', () => {
    cy.visit('http://localhost:4001');
    cy.contains('Hello World!');
  })
});
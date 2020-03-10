describe('Frontend Testing', () => {
  it('next.js works', () => {
    cy.visit('http://localhost:4000');
    cy.contains('Welcome to Next.js!');
  })
});
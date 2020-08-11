/* eslint-disable */
describe('My First Test', () => {
  it('Visit Lukis Lukis', () => {
    cy.visit('http://localhost:3001');
  });

  it('Check if hero background image is loaded properly', () => {
    cy.get('img').then(($img) => {
      expect($img[0].naturalWidth).to.be.greaterThan(0)
      expect($img[0].naturalHeight).to.be.greaterThan(0)
    });
  });

  it('Check if main screen labels are correct', () => {
    cy.get('label').contains('Please Enter Your Name');
    cy.get('h1').contains('Lukis');
  });
});

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

  it('Try to log in without username -> alert', () => {
    const stub = cy.stub()
    cy.on('window:alert', stub);
    cy
      .get('button')
      .click()
      .then(() => expect(stub.getCall(0)).to.be.calledWith('must enter a name'));
  });

  it(`Log in as 'Bello'`, () => {
    cy.get('input')
      .then(($input) => {
        const className = $input[0].classList[0];
        expect(className.includes('formElement')).to.be.true;
        expect($input.attr('name')).to.equal('login');
        expect($input.val()).to.equal('');
      });
    cy.get('input').type('Bello');
    cy.get('button')
      .then(($button) => {
        expect($button.text()).to.equal('Enter');
        $button.click();
      });
  });

  it('Toggle drawing mode button', () => {
    cy
      .get('#toggleDraw')
      .click()
      .contains('Start drawing mode')
      .click()
      .contains('Exit drawing mode')
  });
});

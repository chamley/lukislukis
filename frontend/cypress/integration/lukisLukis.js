/* eslint-disable */
describe('My First Test', () => {
  it('Visit Lukis Lukis, check title', () => {
    cy.visit('http://localhost:3001');
    cy.title().should('equal', 'Lukis-Lukis');
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
      .then(() => expect(stub.getCall(0)).to.be.calledWith('You have to enter a username!'));
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

  it('Check if spinner is loaded', () => {
    cy.get('[data-testid="Loader"]');
  });

  it('Check if canvas is loaded', () => {
    cy.get('[data-testid="Canvas"]')
    cy.get('#main-canvas')
  });

  it('Toggle drawing mode button', () => {
    cy
      .get('#toggleDraw')
      .click()
      .contains('Start drawing mode')
      .click()
      .contains('Exit drawing mode')
  });

  it('Check range input element properties', () => {
    cy.get('#rangeInput')
      .then(($range) => {
        expect(Number($range.attr('min'))).to.equal(1);
        expect(Number($range.attr('max'))).to.equal(100);
        expect(Number($range.val())).to.equal(5);
    });
  });

  it('Check color picker render', () => {
    cy.get('[type="color"]').click();
  });

  it('Check bubbles button render, on click', () => {
    cy.get('#toggleDraw')
      .then(($toggle) => {
        $toggle.click();
        expect($toggle.text()).to.equal('Start drawing mode');
        cy.get('#bubblesBtn')
          .then(($button) => {
            $button.click();
            expect($toggle.text()).to.equal('Exit drawing mode');
          });
      });
  });

  it('Check spray button render, on click', () => {
    cy.get('#toggleDraw')
      .then(($toggle) => {
        $toggle.click();
        expect($toggle.text()).to.equal('Start drawing mode');
        cy.get('#sprayBtn')
          .then(($button) => {
            $button.click();
            expect($toggle.text()).to.equal('Exit drawing mode');
          });
      });
  });

  it('Check pencil button render, on click', () => {
    cy.get('#toggleDraw')
      .then(($toggle) => {
        $toggle.click();
        expect($toggle.text()).to.equal('Start drawing mode');
        cy.get('#pencilBtn')
          .then(($button) => {
            $button.click();
            expect($toggle.text()).to.equal('Exit drawing mode');
          });
      });
  });

  it('Check square button render, on click', () => {
    cy.get('#toggleDraw')
      .then(($toggle) => {
        $toggle.click();
        expect($toggle.text()).to.equal('Start drawing mode');
        cy.get('#squareBtn')
          .then(($button) => {
            $button.click();
            expect($toggle.text()).to.equal('Start drawing mode');
            $toggle.click();
          });
      });
  });

  it('Check triangle button render, on click', () => {
    cy.get('#toggleDraw')
      .then(($toggle) => {
        $toggle.click();
        expect($toggle.text()).to.equal('Start drawing mode');
        cy.get('#triangleBtn')
          .then(($button) => {
            $button.click();
            expect($toggle.text()).to.equal('Start drawing mode');
            $toggle.click();
          });
      });
  });

  it('Check circle button render, on click', () => {
    cy.get('#toggleDraw')
      .then(($toggle) => {
        $toggle.click();
        expect($toggle.text()).to.equal('Start drawing mode');
        cy.get('#circleBtn')
          .then(($button) => {
            $button.click();
            expect($toggle.text()).to.equal('Start drawing mode');
          });
      });
  });
});

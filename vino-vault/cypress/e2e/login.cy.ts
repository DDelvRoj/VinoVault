describe('Pruebas de Inicio de Sesión', () => {

  it('Inicio de sesión fallido', ()=>{
    cy.visit('/login');
    cy.clearAllLocalStorage();
    cy.reload();
    cy.get('#ion-input-0').type('Un usuario fallando');
    cy.get('#ion-input-1').type('Una contraseña mala');
    cy.screenshot("Entradas de Login Incorrectas",{capture:"fullPage", overwrite:true});
    cy.get('.ion-color-dark').click();
    cy.get('#ion-overlay-1').screenshot('Login incorrecto', {capture:"fullPage", overwrite:true});
  });

  it('Inicio de sesión éxitoso', () => {
    cy.visit('/login');
    cy.clearAllLocalStorage();
    cy.reload();
    cy.get('#ion-input-0').type('David');
    cy.get('#ion-input-1').type('David');
    cy.screenshot("Entradas de Login Correctas",{capture:"fullPage", overwrite:true});
    cy.get('.ion-color-dark').click();
    cy.get('.title-default').should('have.text', 'Productos');
    cy.screenshot("Inicio de sesión éxitoso con vista a productos",{capture:"fullPage", overwrite:true});
  });

});
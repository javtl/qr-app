const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server'); // Importa el servidor activo
const should = chai.should();

chai.use(chaiHttp);

describe('Suite de Pruebas: Módulo de Contacto (Sesión 2)', () => {
  
  /**
   * TEST 1: Envío exitoso
   * Valida que el flujo principal (Happy Path) funciona y devuelve el UUID.
   */
  describe('POST /api/contact - Éxito', () => {
    it('Debe retornar 201 y un messageId con datos válidos', (done) => {
      const validData = {
        name: 'Alan Turing',
        email: 'alan@bletchleypark.org',
        subject: 'Consultoría',
        message: 'Esta es una prueba de mensaje con longitud válida.'
      };

      chai.request(server)
        .post('/api/contact')
        .send(validData)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.success.should.equal(true);
          res.body.should.have.property('messageId');
          // Validamos que el ID tenga formato UUID (v4)
          res.body.messageId.should.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
          done();
        });
    });
  });

  /**
   * TEST 2: Email mal formado
   * Valida que la política Zero-Trust bloquea formatos de correo inválidos.
   */
  describe('POST /api/contact - Fallo por Email', () => {
    it('Debe retornar 400 si el email no es válido', (done) => {
      const invalidEmail = {
        name: 'John Doe',
        email: 'correo-no-valido',
        subject: 'Soporte',
        message: 'Mensaje de prueba estándar.'
      };

      chai.request(server)
        .post('/api/contact')
        .send(invalidEmail)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.success.should.equal(false);
          res.body.should.have.property('errors');
          done();
        });
    });
  });

  /**
   * TEST 3: Intento de Buffer Overflow
   * Valida que el servidor rechaza mensajes que exceden el límite de 1000 caracteres.
   */
  describe('POST /api/contact - Fallo por Longitud (Buffer Overflow)', () => {
    it('Debe retornar 400 si el mensaje supera los 1000 caracteres', (done) => {
      const excessiveData = {
        name: 'Attacker',
        email: 'test@example.com',
        subject: 'Otros',
        message: 'A'.repeat(1001) // Creamos un string de 1001 caracteres
      };

      chai.request(server)
        .post('/api/contact')
        .send(excessiveData)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.success.should.equal(false);
          // Verificamos que el error sea específicamente por el campo 'message'
          const messageError = res.body.errors.find(e => e.field === 'message');
          should.exist(messageError);
          done();
        });
    });
  });
});
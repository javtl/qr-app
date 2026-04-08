const { expect } = require('chai');
const { convertCurrency } = require('../../src/api/currencyHandler');

describe('Currency Converter Unit Tests', () => {
  it('Should convert 100 USD to 92 EUR (Happy Path)', async () => {
    const req = { query: { from: 'USD', to: 'EUR', amount: '100' } };
    const res = {
      status: function(code) { this.statusCode = code; return this; },
      json: function(data) { this.body = data; return this; }
    };

    await convertCurrency(req, res);

    expect(res.statusCode).to.equal(200);
    expect(res.body.data.convertedAmount).to.equal(92.00);
  });
});
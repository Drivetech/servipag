"use strict"

var config = {};

config.rutallaveprivada = process.env.RUTALLAVEPRIVADA || './test/llaves/privadaprueba.key';
config.rutallavepublica = process.env.RUTALLAVEPUBLICA || './test/llaves/publicaprueba.key';
config.ordenfirma = process.env.ORDENFIRMA || ['Boleta', 'CodigoCanalPago', 'FechaPago', 'FechaVencimiento', 'Identificador', 'IdSubTx', 'Monto', 'MontoTotalDeuda', 'NumeroBoletas'];
config.ordennodoxml2 = process.env.ORDENNODOXML2 || ['IdTrxServipag', 'IdTxCliente', 'Monto'],
config.ordennodoxml4 = process.env.ORDENNODOXML4 || ['IdTrxServipag', 'IdTxCliente'];

module.exports = config;
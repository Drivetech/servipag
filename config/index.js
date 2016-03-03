"use strict"

var config = {};

config.rutallaveprivada = process.env.RUTALLAVEPRIVADA || './test/llaves/privadaprueba.key';
config.rutallavepublica = process.env.RUTALLAVEPUBLICA || './test/llaves/publicaprueba.key';
config.ordenfirma = process.env.ORDENFIRMA || ['Boleta', 'CodigoCanalPago', 'FechaPago', 'FechaVencimiento', 'Identificador', 'IdSubTx', 'Monto', 'MontoTotalDeuda', 'NumeroBoletas'];
config.ordencomfirPago = process.env.ORDENCOMFIRMPAGO || ['IdTrxServipag', 'IdTxCliente'];

module.exports = config;
'use strict';

import config from './config';
import fs from 'fs';
import {parseString, Builder} from 'xml2js';
import {pick} from 'lodash';
import ursa from 'ursa';

const builderOptions = {
  rootName: 'Servipag',
  renderOpts: {pretty: false},
  xmldec: {encoding: 'ISO-8859-1', standalone: null}
};
const builder = new Builder(builderOptions);

class Servipag {
  /**
   * Constructor
   */
  constructor() {
    this.rutaLlavePrivada = config.rutallaveprivada;
    this.rutaLlavePublica = config.rutallavepublica;
    this.ordenfirma = config.ordenfirma;
    this.ordennodoxml2 = config.ordennodoxml2;
    this.ordenodoxml4 = config.ordennodoxml4;
    this.firma = '';
    this.xml1 = [];
    this.xml1 = {
      cabeceras: ['FirmaEPS', 'CodigoCanalPago', 'IdTxPago', 'EmailCliente', 'NombreCliente', 'RutCliente', 'FechaPago', 'MontoTotalDeuda', 'NumeroBoletas', 'Version'],
      documentos: ['IdSubTx', 'Identificador', 'Boleta', 'Monto', 'FechaVencimiento']
    };
    this.xml2 = ['FirmaServipag', 'IdTrxServipag', 'IdTxCliente', 'FechaPago', 'CodMedioPago', 'FechaContable', 'CodigoIdentificador', 'Boleta', 'Monto'];
    this.xml3 = ['CodigoRetorno', 'MensajeRetorno'];
    this.xml4 = ['FirmaServipag', 'IdTrxServipag', 'IdTxCliente', 'EstadoPago', 'MensajePago'];
  }

  /**
   * Genera el primer xml para ser enviado a servipag.
   * @param  {Object} data {Boleta: 123456, EmailCliente: 'ejemplo@ejemplo.cl' ...}
   * @return {String}       xml como string concatenado
   */
  generarXml1(data) {
    const concatenados = this.concatFirma(data);
    this.encripta(concatenados);
    const header = pick(data, this.xml1.cabeceras);
    const docs = pick(data, this.xml1.documentos);
    const newData = {Header: header, Documentos: docs};
    return builder.buildObject(newData);
  }

  /**
   * Validar xml2.
   * @param {String} xml
   * @return {Json}
   */
  validarXml2(xml, cb) {
    parseString(xml, (err, obj) => {
      if (err) return cb(err);
      const cadena = this.ordennodoxml2.map(x => {
        if (obj.Servipag.hasOwnProperty(x)) {
          return obj.Servipag[x];
        }
      }).join('');
      if (this.desencriptar(cadena, obj.Servipag.FirmaServipag)) {
        cb(null, {exito: true, mensaje: obj});
      } else {
        cb(null, {exito: false, mensaje: 'Firma no valida'});
      }
    });
  }

  /**
   * Generear xml3
   * @param  {Object} data {CodigoRetorno: valor, MensajeRetorno: valor}
   * @return {String}       [description]
   */
  generarXml3(data) {
    return builder.buildObject(data);
  }

  /**
   * Valida el xml
   * @param  {String} xml
   * @return {Json}
   */
  validarXml4(xml, cb) {
    parseString(xml, (err, obj) => {
      if (err) return cb(err);
      const cadena = this.ordenodoxml4.map(x => {
        if (obj.Servipag.hasOwnProperty(x)) {
          return obj.Servipag[x];
        }
      }).join('');
      if (this.desencriptar(cadena, obj.Servipag.FirmaServipag)) {
        cb(null, {exito: true, mensaje: obj});
      } else {
        cb(null, {exito: false, mensaje: 'Firma no valida'});
      }
    });
  }
  /**
   * Encripta y firma la cadena enviada.
   * @param  {String}
   * @return {String}
   */
  encripta(cadena) {
    const llave = ursa.createPrivateKey(fs.readFileSync(this.rutaLlavePrivada));
    const firma = llave.sign('md5', cadena, 'utf8', 'base64');

    return firma;
  }

  /**
   * Desencripta el mensaje firmado
   * @param  {String} cadena
   * @param  {String} firma
   * @return {[type]}
   */
  desencriptar(cadena, firma) {
    const llave = ursa.createPublicKey(fs.readFileSync(this.rutaLlavePublica));
    const hash = new Buffer(cadena).toString('base64');
    const resultado = llave.verify('md5', hash, firma, 'base64');

    return resultado;
  }
  /**
   * Concatena los datos
   * @param  {[type]}
   * @return {[type]}
   */
  concatFirma(data) {
    return this.ordenfirma.map(x => {
      if (data.hasOwnProperty(x)) {
        return data[x];
      }
    }).join('');
  }
}

/**
 * Time out predefinido.
 * @type {Number}
 */
exports.timeout = 10000;

/**
 * Exportar objeto Servipag.
 * @type {Object}
 */
module.exports = Servipag;

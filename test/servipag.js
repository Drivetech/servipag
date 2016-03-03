"use strict"

var assert = require("assert");
var ursa = require("ursa");
var Servipag = require("../lib/servipag.js");
var config = require("../config/");
var fs = require('fs');
var data = {
			FirmaEPS: "PjywWBrcmIScfe82NUwNiHSzhVs0CwtHGwlRBOiQiNONLpsHz1jvhhU9T20aZxhVJD4waPa5hXlX95FYUdDwsSm6lDguLk5JDWxQHlwkVMenqrhJ+2HDXGqg8DNqNXD0JtAoba0eh56Krs2H2Y1q2WJgF38JidcchekdoTXIvlw=",
			Boleta: 1,
			CodigoCanalPago: 2,
			FechaPago: 23012016,
			FechaVencimiento: 31122016,
			Identificador: 1231,
			IdSubTx: 6786,
			Monto: 23000,
			MontoTotalDeuda: 23000,
			NumeroBoletas: 1,
			IdTxPago: 23,
			EmailCliente: "jp@test.com",
			NombreCliente: "Juan Perez",
			RutCliente: "11111111-1",
			Version: 2			
		};
var xml4ficticio = '<?xml version="1.0" encoding="ISO8859-1"?><Servipag><FirmaServipag>asdhbasduasdkasdnasd</FirmaServipag><IdTrxServipag>123456</IdTrxServipag><IdTxCliente>78910</IdTxCliente><EstadoPago>1</EstadoPago><MensajePago>Completado</MensajePago></Servipag>' ;
var resultadoxml4ficticio = {FirmaServipag : '12345678910', IdTrxServipag: '123456', IdTxCliente: '78910', EstadoPago: '1', MensajePago: 'Completado'};

describe("Test Servipag", function(){
	it("Valida el concatenar para la firma", function (done){
		var servipag = Servipag.create();		
		var concatenado = servipag.concatFirma(data);
		assert.equal(concatenado, "1223012016311220161231678623000230001");
		done();
	});

	it("Firma y comprueba el firmado", function (done){
		var servipag = Servipag.create();		
		var concatenado = servipag.concatFirma(data);
		var firma = servipag.encripta(concatenado);		
		assert.ok(firma);
		done();
	});

	it("Comprueba generar el primer xml", function (done) {
		var servipag = Servipag.create();
		var xml1 = servipag.generarXml1(data);
		assert.equal(xml1, "<?xml version='1.0' encoding='ISO-8859-1'?><Servipag><Header><FirmaEPS>PjywWBrcmIScfe82NUwNiHSzhVs0CwtHGwlRBOiQiNONLpsHz1jvhhU9T20aZxhVJD4waPa5hXlX95FYUdDwsSm6lDguLk5JDWxQHlwkVMenqrhJ+2HDXGqg8DNqNXD0JtAoba0eh56Krs2H2Y1q2WJgF38JidcchekdoTXIvlw=</FirmaEPS><CodigoCanalPago>2</CodigoCanalPago><IdTxPago>23</IdTxPago><EmailCliente>jp@test.com</EmailCliente><NombreCliente>Juan Perez</NombreCliente><RutCliente>11111111-1</RutCliente><FechaPago>23012016</FechaPago><MontoTotalDeuda>23000</MontoTotalDeuda><NumeroBoletas>1</NumeroBoletas><Version>2</Version></Header><Documentos><IdSubTx>6786</IdSubTx><Identificador>1231</Identificador><Boleta>1</Boleta><Monto>23000</Monto><FechaVencimiento>31122016</FechaVencimiento></Documentos></Servipag>");
		done();
	});

	it("Comprueba generar el tercer xml", function (done) {
		var servipag = Servipag.create();
		var xml3 = servipag.generarXml3({CodigoRetorno: 0, MensajeRetorno: 'Transacción OK'});
		assert.equal(xml3, "<?xml version='1.0' encoding='ISO-8859-1'?><Servipag><CodigoRetorno>0</CodigoRetorno><MensajeRetorno>Transacción OK</MensajeRetorno></Servipag>");
		done();
	})

	// it("Comprueba xml4", function (done) {
	// 	var servipag = Servipag.create();
	// 	var xml4 = servipag.validarXml4(xml4ficticio);
	// 	console.log(xml4.mensaje);		
	// 	assert.deepEqual(xml4.mensaje, resultadoxml4ficticio);
	// 	done();
	// });

	it("Comprueba desencriptar llave publica", function (done) {
		//cadena para firmar que se formaria con los valores que llegarían en resultadoxml4ficticio
		var cadena = '12345678910';
		//firma que haría servipag		
		var llavepublica = ursa.createPublicKey(fs.readFileSync(config.rutallavepublica));
		var firma = llavepublica.sign('md5', cadena, 'utf8', 'base64');
		console.log(fima);
		//verificación que haría el comercio		
		var servipag = Servipag.create();
		var resultado = servipag.desencriptar(cadena, firma);

		assert.ok(resultado);
		done();
	})
});

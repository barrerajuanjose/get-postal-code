var express = require('express');
var router = express.Router();
var downloader = require('../services/downloader')
var cheerio = require("cheerio");
var STREET = "##STREET##"
var BLOCK = "##BLOCK##"
var baseUrl = "http://www.oca.com.ar/contenidos_dinamicos/cpa_step3.asp?provincia=C&calle="+STREET+"&altura="+BLOCK

/* GET users listing. */
router.get('/', function(req, res, next) {
	var street = req.query.street
	var block = req.query.block

	if(!street || !block) {
		res.send('/postalCode?street=Forest&block=1155');
		return
	}
  	
	var url = baseUrl.replace(STREET, street);
	url = url.replace(BLOCK, block);

	getPostalCode(url, function(postalCode) {
			res.send(postalCode);
	});
});

function getPostalCode(url, callback) {
	downloader.download(url, function(data) {
		var postalCode = 'no lo encontré';
	  if (data) {
	    var $ = cheerio.load(data);
	    $("body").each(function(i, e) {
	      postalCode = $(e).find("td font b").text()
	    });
	  }

	  callback(postalCode);
	});
}

module.exports = router;

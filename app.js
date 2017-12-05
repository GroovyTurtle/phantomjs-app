const phantom = require('phantom');
const asleep = require('asleep');

// Path to screenshot folder or false (to turn off screenshots)
const screenshots = __dirname + '/phantom-screenshots/';

async function runScraper(){

	const instance = await phantom.create();

	const page = await instance.createPage();

	async function waitForPageLoad() {
		while(! await page.evaluate(function() {

			if (!window.$) {
				return false;
			}

			$(function() {
				window.domLoaded = true;
			});

			return window.domLoaded;
		})) {
			await asleep(100);
		}
	}

	await page.property('viewportSize', {width: 1024, height: 2000});

  	await page.open('http://www.dmi.dk/vejr/til-lands/byvejr/by/vis/SE/2662149/Ystad,%20Sverige').catch((err)=>console.log(err))

  	let content = await page.property('content');

  	page.evaluate(function(){
		$('#ui-id-3').click();
  	});

  	screenshots && page.render(screenshots + 'weather.jpg');

  	await waitForPageLoad();

  	let searchResult = await page.evaluate(function(){
  		var weatherInformation = [];
		var informationToPush = {};
		var columnText = ['time', 'degrees', 'rain', 'wind'];

		var weatherTD = await page(($) => {
			return $('#hour_table table').first().find('tbody td').map(function() {
				return $(this).text();
			});
		});
		console.log('weatherTD', weatherTD);

		for (var i = 0; i < weatherTD.length; i++) {

			var column = i % 4;

			weatherInformation[0] = columnText[column];

			if (i === 0 && column === 0) {
				weatherInformation.push(informationToPush);
				informationToPush = {};
			}
		}
		return weatherInformation;
	});

	console.log(searchResult);

	console.log("DONE");
}

runScraper();
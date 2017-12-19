const phantom = require('phantom');
const asleep = require('asleep');

runScraper();

async function runScraper(){

	const instance = await phantom.create();
	const page = await instance.createPage();

  	await page.open('http://www.dmi.dk/vejr/til-lands/byvejr/by/vis/SE/2662149/Ystad,%20Sverige').catch((err)=>console.log(err));

  	let content = await page.property('content');
  	let weatherTd = [];

  	while (!weatherTd.length){
	  	weatherTd = await page.evaluate(function() {
			var arr = [];
			$('#hour_table table').first().find('tbody td').each(function() {
				arr.push($(this).text());
			});
			return arr;
		});
		await asleep(100);
	}

	let searchResult = await constructingColumns(weatherTd);

  	async function constructingColumns(data) {
		var weatherInformation = [];
		var columnKey = ['time', 'DanishLoremIpsum', 'degrees', 'rain', 'wind'];

		for (var i = 0; i < data.length; i += 5) {

			let informationToPush = {};

			columnKey.forEach(function (key, index) {
				if (index !== 1) {
					informationToPush[key] = data[i + index];
				}
			});

			weatherInformation.push(informationToPush);
		}

		return weatherInformation;
	}

	console.log(searchResult);

	console.log("DONE");
}
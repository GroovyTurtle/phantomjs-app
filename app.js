const phantom = require('phantom');
const asleep = require('asleep');
const express = require('express');
const app = express();

runScraper();

app.use(express.static(__dirname + '/www', {extensions: ['html']}));

app.listen(4000, () => console.log('Listening on port 3000!'));

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
		let weatherInformation = [];
		let rainToday = false;
		let columnKey = ['time', 'DanishLoremIpsum', 'degrees', 'rain', 'wind'];

		for (let i = 0; i < data.length; i += 5) {

			let informationToPush = {};

			columnKey.forEach(function (key, index) {
				if (index !== 1) {
					if (key === 'rain' && data[i + index] !== '0,0 mm ') {
						rainToday = true;
					}
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
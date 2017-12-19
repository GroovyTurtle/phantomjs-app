const express = require('express');
const app = express();
const phantom = require('phantom');
const asleep = require('asleep');

let weatherData = {};
let weatherFakeData = {};
let trainData = {};
let trainFakeData = {};

weatherScraper();
setInterval(weatherScraper, 300 * 1000);
trainScraper();
setInterval(trainScraper, 300 * 1000);

async function trainScraper() {
	trainData.running = true;
}

async function weatherScraper() {
	const instance = await phantom.create();
	const page = await instance.createPage();

  	await page.open('http://www.dmi.dk/vejr/til-lands/byvejr/by/vis/SE/2662149/Ystad,%20Sverige').catch((err)=>console.log(err));

  	let content = await page.property('content');
  	let weatherTd = [];
	let rainToday = false;

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

  	async function constructingColumns(data) {
		let weatherInformation = {hourlyData: []};
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

			weatherInformation.hourlyData.push(informationToPush);
			weatherInformation.rain = rainToday;
		}

		return weatherInformation;
	}

	weatherData = await constructingColumns(weatherTd);
}

app.use(express.static(__dirname + '/www', {extensions: ['html']}));

app.get('/weather',(req,res) => {
	res.json(weatherData);
});

app.get('/train',(req,res) => {
	res.json(trainData);
});

app.get('/trainRunning',(req,res) => {
	trainFakeData = trainData;
	trainFakeData.running = true;
	res.json(trainFakeData);
});

app.get('/trainNotRunning',(req,res) => {
	trainFakeData = trainData;
	trainFakeData.running = false;
	res.json(trainFakeData);
});

app.get('/fakeRain',(req,res) => {
	weatherFakeData = weatherData;
	weatherFakeData.rain = true;
	res.json(weatherFakeData);
});

app.get('/fakeNoRain',(req,res) => {
	weatherFakeData = weatherData;
	weatherFakeData.rain = false;
	res.json(weatherFakeData);
});

app.listen(4000, () => console.log('Listening on port 4000!'));

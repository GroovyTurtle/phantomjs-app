const phantom = require('phantom');
const asleep = require('asleep');

const screenshots = false;

console.log('Here!');

async function fillInBlocketForm() {
	const instance = await phantom.create();

	const page = await instance.createPage();


	async function waitForPageLoad() {
		while(
			! await page.evaluate(function() {
				if(window.onOldPage || !window.$) {
					return false;
				}
				$(function() {
					window.domLoaded = true;
				});

				return window.domLoaded;
			})
		){
			await asleep(100);
		}
	}

	await page.property('viewportSize', {width: 1024, height: 2000}).catch((err)=>console.log(err));

	await page.open('http://www.dmi.dk/vejr/til-lands/byvejr/by/vis/SE/2662149/Ystad,%20Sverige').catch((err)=>console.log(err));

	let content = await page.property('content').catch((err)=>console.log(err));

	await waitForPageLoad();

	let searchResult = await page.evaluate(function(){
		var content = $('#hour_table table')[0];
		return content;
	});

	console.log(searchResult);

	console.log("DONE");
}

fillInBlocketForm();

// page.evaluate(function() {
// 	$('#hour_table table')[0];
// });

// 	var catNumber = $('#catgroup option:contains("' + category + '")').val();

// 	$('#catgroup').val(catNumber).change();

// 	counties.forEach(function(county) {

// 		$('.multiselect-container input[data-dropdown-readable-name="' + county + '"]').click();
// 	});
// },
// 	'Sköldpadda',
// 	'FRITID & HOBBY',
// 	['Jämtland', 'Skåne', 'Dalarna']
// );

// page.evaluate(function() {
// 	$('#searchbutton').click();
// });
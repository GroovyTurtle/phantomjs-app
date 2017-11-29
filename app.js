const phantom = require('phantom');
const asleep = require('asleep');

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

	page.evaluate(function() {
		// $('#hour_table table')[0];
		console.log('$(#hour_table table)[0]', $('#hour_table table')[0]);
	});
}

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

	// await waitForPageLoad();

	// let searchResult = await page.evaluate(function(){
	// 	var content = [];
	// 	$('#item_list article').each(function(){
	// 		content.push(this.outerHTML);
	// 	});
	// 	return content;
	// });

	// console.log(searchResult);

	// console.log("DONE");

fillInBlocketForm();
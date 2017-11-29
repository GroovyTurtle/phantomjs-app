const phantom = require('phantom');
const asleep = require('asleep');

const screenshots = __dirname + '/phantom-screenshots/';

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

	await page.property('viewportSize', {width: 1024, height: 2000});

	await page.open('https://www.blocket.se/helasverige').catch((err)=>console.log(err));

	let content = await page.property('content');

	page.evaluate(function(searchText, category, counties) {
		$('#searchtext').val(searchText);

		var catNumber = $('#catgroup option:contains("' + category + '")').val();

		$('#catgroup').val(catNumber).change();

		counties.forEach(function(county) {

			$('.multiselect-container input[data-dropdown-readable-name="' + county + '"]').click();
		});
	},
		'Sköldpadda',
		'FRITID & HOBBY',
		['Jämtland', 'Skåne', 'Dalarna']
	);

	screenshots && page.render(screenshots + 'blocket1.jpg');

	page.evaluate(function() {
		$('#searchbutton').click();
	});

	await waitForPageLoad();

	let searchResult = await page.evaluate(function(){
		var content = [];
		$('#item_list article').each(function(){
			content.push(this.outerHTML);
		});
		return content;
	});

	screenshots && page.render(screenshots + 'blocket2.jpg');

	console.log(searchResult);

	console.log("DONE");
}

fillInBlocketForm();
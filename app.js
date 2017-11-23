const phantom = require('phantom');

async function fillInBlocketForm() {
	const instance = await phantom.create();

	const page = await instance.createPage();

	await page.open('https://www.blocket.se/hela_sverige');
	let content = await page.property('content');

	console.log(content);
}

fillInBlocketForm();
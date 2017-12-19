$(()=>{
	getWeather();
	getTrain();

	$('#fakeRain').click(function () {
		$.get('/fakeRain', function(weatherData) {
			console.log('weatherData', weatherData);
			if (weatherData.rain === true) {
				$('#sun').hide();
				$('#rain').show();
			}
			else if (weatherData.rain === false) {
				$('#rain').hide();
				$('#sun').show();
			}
		});
	});
	$('#fakeNoRain').click(function () {
		$.get('/fakeNoRain', function(weatherData) {
			console.log('weatherData', weatherData);
			if (weatherData.rain === true) {
				$('#sun').hide();
				$('#rain').show();
			}
			else if (weatherData.rain === false) {
				$('#rain').hide();
				$('#sun').show();
			}
		});
	});
	$('#fakeTrainRunning').click(function () {
		$.get('/trainRunning', function(trainData) {
			console.log('trainData', trainData);
			if (trainData.running === true) {
				$('#trainoff').hide();
				$('#trainon').show();
			}
			else if (trainData.running === false) {
				$('#trainon').hide();
				$('#trainoff').show();
			}
		});
	});
	$('#fakeTrainNotRunning').click(function () {
		$.get('/trainNotRunning', function(trainData) {
			console.log('trainData', trainData);
			if (trainData.running === true) {
				$('#trainoff').hide();
				$('#trainon').show();
			}
			else if (trainData.running === false) {
				$('#trainon').hide();
				$('#trainoff').show();
			}
		});
	});

});

function getTrain() {
	$.get('/train', function(trainData) {
		console.log('trainData', trainData);
		if (trainData.running === true) {
			$('#trainoff').hide();
			$('#trainon').show();
		}
		else if (trainData.running === false) {
			$('#trainon').hide();
			$('#trainoff').show();
		}
	});
}

function getWeather() {
	$.get('/weather', function(weatherData) {
		console.log('weatherData', weatherData);
		if (weatherData.rain === true) {
			$('#sun').hide();
			$('#rain').show();
		}
		else if (weatherData.rain === false) {
			$('#rain').hide();
			$('#sun').show();
		}
	});
}
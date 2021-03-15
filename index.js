const ColorThief = require('colorthief');
const screenshot = require('desktop-screenshot');
const { Discovery, Control } = require('magic-home');

function takePrintScreen(filename) {
	return new Promise((resolve, reject) => {
		screenshot(filename, function(error, complete) {
			if (error) {
				reject(error);
			}
			resolve(complete);
		});
	});
}

function getPredominantColor(filename) {
	return ColorThief.getColor(filename);
}

function changeColor(light, color) {
	return new Promise(resolve => {
		light.setColor(...color, 100, console.log)
	})
}

const filename = 'print.jpg';
 
let discovery = new Discovery();
discovery.scan(500).then(devices => {
	const { address } = devices[0];
	const light = new Control(address, { command_timeout: 10000 });
	light.startEffectMode().then(effectMode => {
		effectMode.start(() => {
			takePrintScreen(filename).then(() => {
				getPredominantColor(filename).then(color => {
					changeColor(effectMode, color).catch(console.log);
				})
			})
		});
	});
});
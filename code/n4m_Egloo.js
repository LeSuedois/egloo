const maxApi = require('max-api');
const Nano33BLE = require('@vliegwerk/arduino-nano-33-ble')
const MESSAGE_TYPES = maxApi.MESSAGE_TYPES;
//const SERVICE_UUID = 'd91cb6ee-d174-11ea-87d0-0242ac130003'
const nano33ble = new Nano33BLE({
    enable: [
        'EglooInputs',
        'EglooOutputs',
        'EglooNeopixels'
    ],
	mean: true,
	stddev: true
});

maxApi.post('Connecting...');

nano33ble.connect().then(connected => {
	if (!connected) {
		maxApi.post('Unable to connect to Nano 33 BLE service');
		process.exit(1);
	}
    //nano33ble.writeNeopixels(Uint8Array.of(255,255,255));
});

nano33ble.on('connected', id => {
    console.log(`Connected to ${id}`);
    maxApi.post(`Connected to ${id}`)

    nano33ble.on('EglooInputs', data => {
        maxApi.outlet(data);
    });
    /*nano33ble.on('EglooOutputs', data => {
        maxApi.outlet(data);
    });
    nano33ble.on('EglooNeopixels', data =>{
        maxApi.outlet(data);
    });*/
});

nano33ble.on('error', err => {
    // console.error(err.message);
    maxApi.post(err.message);
});

nano33ble.on('disconnected', id => {
    // console.log(`Disconnected from ${id}`);
    maxApi.post(`Disconnected from ${id}`);
});

maxApi.addHandler("color", (red, green, blue) => {
    maxApi.post(`color: ${red} ${green} ${blue}`);
    nano33ble.writeNeopixels(Uint8Array.of(red, green, blue));
} )

maxApi.addHandler("outputs", (o1, o2, o3, o4, o5) => {
    maxApi.post(`outputs: ${o1} ${o2} ${o3} ${o4} ${o5}`);
    nano33ble.writeOutputs(Uint8Array.of(o1, o2, o3, o4, o5));
} )
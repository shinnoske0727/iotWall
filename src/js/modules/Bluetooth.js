import EventEmitter from 'events';

const SERVICE_UUID = "713d0000-503e-4c75-ba94-3148f18d941e";
const RX_CHARACTERISTIC_UUID = "713d0002-503e-4c75-ba94-3148f18d941e";
const TX_CHARACTERISTIC_UUID = "713d0003-503e-4c75-ba94-3148f18d941e";

export default class Bluetooth extends EventEmitter {
  constructor(opts={}) {
    super();
    this._txCharacteristic = null;
    this._rxCharacteristic = null;

    this._searchButton = opts.search;

    this.init();
  }

  init() {
    this._searchButton.addEventListener("click", this.connectBLE.bind(this));
  }

  connectBLE() {
    // acceptAllDevicesの場合optionalServicesが必要みたい
    navigator.bluetooth.requestDevice({
            optionalServices: [SERVICE_UUID],
            acceptAllDevices: true
        })
        .then(device => {
            console.log("devicename:" + device.name);
            console.log("id:" + device.id);
            return device.gatt.connect();
        })
        .then(server => {
            console.log("success:connect to device");
            return server.getPrimaryService(SERVICE_UUID);
        })
        .then(service => {
            console.log("success:service");
            return Promise.all([
                service.getCharacteristic(RX_CHARACTERISTIC_UUID),
                service.getCharacteristic(TX_CHARACTERISTIC_UUID)
            ]);
        })
        .then(characteristic => {
            console.log("success:txcharacteristic");
            this._rxCharacteristic = characteristic[0];
            this._txCharacteristic = characteristic[1];
            setInterval(() => {
                this._rxCharacteristic.readValue()
                    .then(value => {
                        let message;
                        message = value.buffer;
                        console.log(new Uint8Array(message)[0]);
                        if (new Uint8Array(message)[0] >= 55) {
                          this.emit('near')
                        }
                    });
            }, 500);
            console.log("success:connect BLE");
        })
        .catch(error => {
            console.log("Error : " + error);
        });
  }
}
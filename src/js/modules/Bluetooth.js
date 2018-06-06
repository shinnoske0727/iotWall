const SERVICE_UUID = "713d0000-503e-4c75-ba94-3148f18d941e";
const TEMPERATURE_CHARACTERISTIC_UUID = "713d0002-503e-4c75-ba94-3148f18d941e";
const HOGE_CHARACTERISTIC_UUID = "713d0003-503e-4c75-ba94-3148f18d941e";


export default class Bluetooth {
  constructor(opts={}) {

    this.button = opts.button;

    let connectButton;

    this.init();
  }

  init() {
    this.button.addEventListener("click", this.connectBLE);
  }

  connectBLE() {

    navigator.bluetooth.requestDevice({
      filters: [
        {
          services: [
            SERVICE_UUID
          ]
        }
      ]
    })
      .then(device => {
        console.log("デバイスを選択しました。接続します。");
        console.log("デバイス名 : " + device.name);
        console.log("ID : " + device.id);

        // 選択したデバイスに接続
        return device.gatt.connect();
      })
      .then(server => {
        console.log("デバイスへの接続に成功しました。サービスを取得します。");

        // UUIDに合致するサービス(機能)を取得
        return server.getPrimaryService(SERVICE_UUID);
      })
      .then(service => {
        console.log("サービスの取得に成功しました。キャラクタリスティックを取得します。");

        // UUIDに合致するキャラクタリスティック(サービスが扱うデータ)を取得
        return Promise.all([
          service.getCharacteristic(TEMPERATURE_CHARACTERISTIC_UUID),
          service.getCharacteristic(HOGE_CHARACTERISTIC_UUID)
        ]);
      })
      .then(characteristic => {
        temperatureCharacteristic = characteristic[1];

        console.log("BLE接続が完了しました。");

        // センサーの値を読み込みます。
        loadSensorValue();

      })
      .catch(error => {
        console.log("Error : " + error);
      });
  }

  loadSensorValue() {
    setInterval(function () {
      let temperature;

      temperatureCharacteristic.readValue()
        .then(value => {
          temperature = value.getUint8(0);
          temperatureText.innerHTML = temperature;

          console.log("湿度 : " + humidity + "% | 温度 : " + temperature + "度");

        })
        .catch(error => {
          console.log("Error : " + error);
        });

    }, 1000);
  }


  initListener() {
    window.addEventListener("load", init);
  }
}
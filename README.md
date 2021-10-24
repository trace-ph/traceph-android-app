# DetectPH-android-app
DetectPH Android is a React Native mobile app.

## Prerequisites
* Node version 10 and above (NPM should be included)
* Android Studio (Must support Android SDK 29)
* Android device (Android 5.0 and above)

## Getting Started
Here is a step-by-step instruction on how to install the app to your device. Emulators do not support bluetooth therefore they can't be used to test the app.

1) Clone this repository.

2) Install the node modules.

	```
	npm i
	```

or if you have package-lock.json and want a clean install

	```
	npm ci
	```
	
3) Insert the following code in the file: node_modules/react-native-ble-manager/android/src/main/java/it/innove/LollipopScanManager.java

```
public void scan(ReadableArray serviceUUIDs, final int scanSeconds, ReadableMap options,  Callback callback) {
	...
	// Add general iOS scan filter by default
	filters.add(new ScanFilter.Builder().setManufacturerData(76, new byte[0], new byte[0]).build());

	getBluetoothAdapter().getBluetoothLeScanner().startScan(filters, scanSettingsBuilder.build(), mScanCallback);
	...
}
```

4) Setup a React Native environment by following these instructions: [https://reactnative.dev/docs/running-on-device](https://reactnative.dev/docs/running-on-device)

5) You should be able to see the app in your device.


### Local deployment
If you're planning on connecting the app to your local database or to your local machine, here is a step-by-step instruction.

1) Clone the following repositories found in this organization: **node-api** and **auth-api**. The auth-api repository is only available to members of the organization. However, the app will still work regardless of this server setup with the exception of the report feature.

2) Follow the instructions of their corresponding README on how to setup the server.

3) In the app, update the **API_URL** in the file configs/index.js to your chosen URL.

4) Install the app to your device.


## Contact Us
Email us at [detectph.updsc@gmail.com](mailto:detectph.updsc@gmail.com).
You can also visit our [website](https://www.detectph.com) to know more about our app.


## Authors
* **Gabriel Drix Lopez** - [Github](https://github.com/gabrielslach)
* **Mart Rudolph Macion** - [Github](https://github.com/trmartmacion)
* **Angelique Rafael** - [Github](https://github.com/JelloJill)

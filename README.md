# DetectPH-android-app
DetectPH Android is a React Native mobile app.


## Prerequisites
* Node version 10 and above (NPM should be included)
* Android Studio (Must support Android SDK 29)
* Android device (Android 5.0 and above)


## Getting Started
Here is a step-by-step instruction on how to install the app to your device. Emulators do not support bluetooth therefore they can't be used to test the app.

1. Clone this repository.

2. Install the node modules.

	```
	npm i
	```

	or if you have package-lock.json and want a clean install

	```
	npm ci
	```
	
3. Insert the following code in the file: `node_modules/react-native-ble-manager/android/src/main/java/it/innove/LollipopScanManager.java`

	```
	public void scan(ReadableArray serviceUUIDs, final int scanSeconds, ReadableMap options,  Callback callback) {
		...
		// Add general iOS scan filter by default
		filters.add(new ScanFilter.Builder().setManufacturerData(76, new byte[0], new byte[0]).build());

		getBluetoothAdapter().getBluetoothLeScanner().startScan(filters, scanSettingsBuilder.build(), mScanCallback);
		...
	}
	```

4. Setup a React Native environment by following these instructions: [https://reactnative.dev/docs/running-on-device](https://reactnative.dev/docs/running-on-device)

5. You should be able to see the app in your device.

### Local deployment
If you're planning on connecting the app to your local database or to your local machine, here is a step-by-step instruction.

1. Clone the following repositories found in this organization: **node-api** and **auth-api**. The auth-api repository is only available to members of the organization. However, the app will still work regardless of this server setup with the exception of the report feature.

2. Follow the instructions of their corresponding README on how to setup the server.

3. In the app, update the **API_URL** in the file `configs/index.js` to your chosen URL.

4. Install the app to your device.

### Uploading in Google Play Store
1. Open the app in Android Studio.

2. Go to `Build > Generate Signed Bundle/APK...`.

3. Choose to generate a app bundle or APK.

4. Input where the keystore is and fill up the necessary information asked. Remember that the keystore password, alias, and key password is the same in `android/gradle.properties`.

5. Pick **release** in the build variant and click **Finish**. This will create your app.


## Important Notes
* Phones have a battery optimization feature that could hinder the functionality of the app. In exchange of saving battery life, they kill the app instead. See this website on how to handle this: [https://dontkillmyapp.com/](https://dontkillmyapp.com/)
* Keep in mind that keystores should not be uploaded in an easily accesible place. This includes GitHub.
* Always update .gitignore to avoid uploading folders or files you don't want to accidentally commit.


## Contact Us
Email us at [detectph.updsc@gmail.com](mailto:detectph.updsc@gmail.com).
You can also visit our [website](https://www.detectph.com) to know more about our app.


## Authors
* **Gabriel Drix Lopez** - [Github](https://github.com/gabrielslach)
* **Mart Rudolph Macion** - [Github](https://github.com/trmartmacion)
* **Angelique Rafael** - [Github](https://github.com/JelloJill)

package com.traceph;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.le.BluetoothLeAdvertiser;
import android.bluetooth.le.AdvertiseSettings;
import android.os.ParcelUuid;
import android.bluetooth.le.AdvertiseData;
import android.bluetooth.le.AdvertiseCallback;
import android.util.Log;

import java.nio.charset.Charset;
import java.util.UUID;

import android.widget.Toast;

public class BleModule extends ReactContextBaseJavaModule {
    // constructor
    public BleModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    // Mandatory function getName that specifies the module name
    @Override
    public String getName() {
        return "BleModule";
    }

    // Custom function that we are going to export to JS
    @ReactMethod
    public void isAdvertisingSupported(
            Callback successCallback) {
        if (!BluetoothAdapter.getDefaultAdapter().isMultipleAdvertisementSupported()) {
            Toast.makeText(getReactApplicationContext(), "Multiple advertisement not supported", Toast.LENGTH_SHORT).show();
            try {
                successCallback.invoke(false);
            } catch (Exception e) {
                Toast.makeText(getReactApplicationContext(), "Multiple advertisement not supported(1)", Toast.LENGTH_SHORT).show();
            }
        } else successCallback.invoke(true);
    }

    private BluetoothLeAdvertiser advertiser = BluetoothAdapter.getDefaultAdapter().getBluetoothLeAdvertiser();

    @ReactMethod
    public void advertise(Callback successCallBack) {
        //BluetoothLeAdvertiser advertiser = BluetoothAdapter.getDefaultAdapter().getBluetoothLeAdvertiser();

        AdvertiseSettings settings = new AdvertiseSettings.Builder()
                .setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_BALANCED)
                .setTxPowerLevel(AdvertiseSettings.ADVERTISE_TX_POWER_HIGH).setConnectable(false).build();

        ParcelUuid pUuid = new ParcelUuid(UUID.fromString("CDB7920D-72F1-4D4D-8E47-C090302DBD13"));

        AdvertiseData data = new AdvertiseData.Builder().setIncludeDeviceName( false ).addServiceUuid(pUuid).setIncludeTxPowerLevel(false).build();

        AdvertiseCallback advertisingCallback = new AdvertiseCallback() {
            @Override
            public void onStartSuccess(AdvertiseSettings settingsInEffect) {
                successCallBack.invoke(true);
                super.onStartSuccess(settingsInEffect);
            }

            @Override
            public void onStartFailure(int errorCode) {
                successCallBack.invoke(false, errorCode);
                Log.e("BLE", "Advertising onStartFailure: " + errorCode);
                super.onStartFailure(errorCode);
            }
        };

        advertiser.startAdvertising(settings, data, advertisingCallback);
    }

    @ReactMethod
    public void stopAdvertise(Callback successCallBack) {

        AdvertiseCallback advertisingCallback = new AdvertiseCallback() {
            @Override
            public void onStartSuccess(AdvertiseSettings settingsInEffect) {
                successCallBack.invoke(true);
                super.onStartSuccess(settingsInEffect);
            }

            @Override
            public void onStartFailure(int errorCode) {
                successCallBack.invoke(false, errorCode);
                Log.e("BLE", "Advertising onStartFailure: " + errorCode);
                super.onStartFailure(errorCode);
            }
        };

        advertiser.stopAdvertising(advertisingCallback);
        successCallBack.invoke(true);
    }
}
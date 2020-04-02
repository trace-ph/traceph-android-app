package com.traceph;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothProfile;
import android.bluetooth.le.BluetoothLeAdvertiser;
import android.bluetooth.le.AdvertiseSettings;
import android.bluetooth.BluetoothManager;
import android.os.ParcelUuid;
import android.bluetooth.le.AdvertiseData;
import android.bluetooth.le.AdvertiseCallback;
import android.util.Log;
import android.content.Context;

import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattDescriptor;
import android.bluetooth.BluetoothGattServer;
import android.bluetooth.BluetoothGattServerCallback;
import android.bluetooth.BluetoothGattService;

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


    private BluetoothLeAdvertiser advertiser;
    private BluetoothManager mBluetoothManager;
    private BluetoothGattServer mBluetoothGattServer;

    private static UUID myUUID = UUID.fromString("CDB7920D-72F1-4D4D-8E47-C090302DBD13");


    @ReactMethod
    private void advertise(Callback advCallBack) {
        BluetoothAdapter bluetoothAdapter = mBluetoothManager.getAdapter();
        advertiser = bluetoothAdapter.getBluetoothLeAdvertiser();
        if (advertiser == null) {
            Toast.makeText(getReactApplicationContext(), "Failed to create advertiser", Toast.LENGTH_SHORT).show();
            return;
        }

        AdvertiseSettings settings = new AdvertiseSettings.Builder()
                .setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_BALANCED)
                .setTxPowerLevel(AdvertiseSettings.ADVERTISE_TX_POWER_HIGH)
                .setConnectable(true)
                .build();

        ParcelUuid pUuid = new ParcelUuid(myUUID);

        AdvertiseData data = new AdvertiseData.Builder()
                .setIncludeDeviceName( false )
                .addServiceUuid(pUuid)
                .setIncludeTxPowerLevel(false)
                .build();

        AdvertiseCallback advertisingCallback = new AdvertiseCallback() {
            @Override
            public void onStartSuccess(AdvertiseSettings settingsInEffect) {
                advCallBack.invoke(true);
                super.onStartSuccess(settingsInEffect);
            }

            @Override
            public void onStartFailure(int errorCode) {
                advCallBack.invoke(false, errorCode);
                Log.e("BLE", "Advertising onStartFailure: " + errorCode);
                super.onStartFailure(errorCode);
            }
        };

        advertiser.startAdvertising(settings, data, advertisingCallback);
    }

    @ReactMethod
    private void startServer(Callback srvCallBack) {
        mBluetoothGattServer = mBluetoothManager.openGattServer(getReactApplicationContext(), mGattServerCallback);
        if (mBluetoothGattServer == null) {
            srvCallBack.invoke(false);
            return;
        }

        mBluetoothGattServer.addService(new BluetoothGattService(myUUID,
                BluetoothGattService.SERVICE_TYPE_PRIMARY));

        srvCallBack.invoke(true);
    }

    private BluetoothGattServerCallback mGattServerCallback = new BluetoothGattServerCallback() {
        @Override
        public void onConnectionStateChange(BluetoothDevice device, int status, int newState) {
            if (newState == BluetoothProfile.STATE_CONNECTED) {
                return;
            } else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
                return;
            }
        }
    };

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
        } else {
            successCallback.invoke(true);
            mBluetoothManager = (BluetoothManager) getReactApplicationContext().getSystemService(Context.BLUETOOTH_SERVICE);
        }
    }

    private boolean adv = false;
    private boolean srv = false;
    private int err;

    @ReactMethod
    public void stopBroadcastingGATT(Callback advsrvCallBack) {

        AdvertiseCallback advertisingCallback = new AdvertiseCallback() {
            @Override
            public void onStartSuccess(AdvertiseSettings settingsInEffect) {
                adv = true;
                super.onStartSuccess(settingsInEffect);
            }

            @Override
            public void onStartFailure(int errorCode) {
                adv = false;
                err = errorCode;
                super.onStartFailure(errorCode);
            }
        };
        if (advertiser == null) {
            adv = true;
        } else {
            advertiser.stopAdvertising(advertisingCallback);
            adv = true;
        }

        if (mBluetoothGattServer == null) {
            srv = true;
        } else {
            mBluetoothGattServer.close();
            srv = true;
        }
        advsrvCallBack.invoke(adv,srv, err);
    }
}
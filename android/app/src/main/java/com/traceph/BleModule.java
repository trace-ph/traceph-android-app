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

    private static UUID SERVICE_UUID = UUID.fromString("0000ff01-0000-1000-8000-00805F9B34FB");

    @ReactMethod
    private void advertise(boolean includeName, Callback advCallBack) {
        BluetoothAdapter bluetoothAdapter = mBluetoothManager.getAdapter();
        advertiser = bluetoothAdapter.getBluetoothLeAdvertiser();
        if (advertiser == null) {
            Toast.makeText(getReactApplicationContext(), "Failed to create advertiser", Toast.LENGTH_SHORT).show();
            return;
        }

        AdvertiseSettings advertiseSettings = new AdvertiseSettings.Builder()
                .setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_BALANCED)
                .setTxPowerLevel(AdvertiseSettings.ADVERTISE_TX_POWER_HIGH)
                .setConnectable(false).build();

        byte[] serviceData = "tPH".getBytes(Charset.forName("UTF-8"));

        AdvertiseData advertiseData = new AdvertiseData.Builder()
        .setIncludeDeviceName(includeName)
                .addServiceUuid(new ParcelUuid(SERVICE_UUID))
                .addServiceData(new ParcelUuid(SERVICE_UUID), serviceData)
                .setIncludeTxPowerLevel(true).build();

        AdvertiseCallback advertiseCallback = new AdvertiseCallback() {
            @Override
            public void onStartSuccess(AdvertiseSettings settingsInEffect) {
                super.onStartSuccess(settingsInEffect);
                // String advString = settingsInEffect.toString() +"\n Service Data \n" + advertiseData.getServiceData().toString()
                // +"\n UUIDs: \n" + advertiseData.getServiceUuids().toString();
                String advString = settingsInEffect.toString() +"\n Advertised Data \n" + advertiseData.toString();
                advCallBack.invoke(true, advString);
            }

            @Override
            public void onStartFailure(int errorCode) {
                advCallBack.invoke(false, errorCode);
                Toast.makeText(getReactApplicationContext(), "Failed to start advertiser.", Toast.LENGTH_SHORT).show();
                super.onStartFailure(errorCode);
            }
        };

        advertiser.startAdvertising(advertiseSettings, advertiseData, advertiseCallback);
    }

    @ReactMethod
    private void startServer(Callback srvCallBack) {
        mBluetoothGattServer = mBluetoothManager.openGattServer(getReactApplicationContext(), mGattServerCallback);
        if (mBluetoothGattServer == null) {
            srvCallBack.invoke(false);
            return;
        }

        BluetoothGattService gattService = new BluetoothGattService(SERVICE_UUID,
                BluetoothGattService.SERVICE_TYPE_PRIMARY);

        boolean isServAdded = mBluetoothGattServer.addService(gattService);

        if (isServAdded == true) {
            srvCallBack.invoke(true, gattService.getUuid().toString());
            return;
        }
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
    public void isAdvertisingSupported(Callback successCallback) {
        if (!BluetoothAdapter.getDefaultAdapter().isMultipleAdvertisementSupported()) {
            Toast.makeText(getReactApplicationContext(), "Enable your bluetooth device.", Toast.LENGTH_SHORT).show();
            try {
                successCallback.invoke(false);
            } catch (Exception e) {
                Toast.makeText(getReactApplicationContext(), "Bluetooth Error.", Toast.LENGTH_SHORT).show();
            }
        } else {
            successCallback.invoke(true);
            mBluetoothManager = (BluetoothManager) getReactApplicationContext()
                    .getSystemService(Context.BLUETOOTH_SERVICE);
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
        advsrvCallBack.invoke(adv, srv, err);
    }
}
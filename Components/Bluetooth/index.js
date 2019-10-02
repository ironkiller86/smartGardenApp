//import React, { Component } from 'react'
import { bytesToString } from 'convert-string';

import { stringToBytes } from 'convert-string';


import {
    Text,
    View,
    TouchableHighlight,
    ListView,
    StyleSheet,
    ScrollView,
    Dimensions,
    AppState,
    Platform,
    PermissionsAndroid,
    NativeEventEmitter,
    NativeModules, Switch,
} from 'react-native';
/**
 * 
 */
import BleManager from 'react-native-ble-manager';

const data = stringToBytes('i');

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);


const peripheral_ID = '90:E2:02:8F:40:24'
const characteristic = 'FFE0'
const service = 'FFE1'

class Bluetooth {
    constructor() {
        console.log('constructor Setting bluetooth')
        this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic);
        this.peripheral_ID = '90:E2:02:8F:40:24'
        // this.dataObject = {} 
        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                if (result) {
                    console.log("Permission is OK");
                } else {
                    PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                        if (result) {
                            console.log("User accept");
                        } else {
                            console.log("User refuse");
                        }
                    });
                }
            });
        }


        /* BleManager.start({showAlert: false})
         .then(() => {
           // Success code
           console.log('Module initialized');
         }).catch(err=> {
            console.log(err)
         });*/


    }


    startSession = () => {
        BleManager.start({ showAlert: false })
            .then(() => {
                // Success code
                console.log('Module initialized');
            }).catch(err => {
                console.log(err)
            });
    }



    enableBluetooth = () => {
        BleManager.enableBluetooth()
            .then(() => {
                // Success code
                console.log('The bluetooth is already enabled or the user confirm');
            })
            .catch((error) => {
                // Failure code
                console.log('The user refuse to enable bluetooth');
            });
    }



    connecting = () => {
        console.log('Connecting')
        return new Promise((resolve, reject) => {
            BleManager.connect('90:E2:02:8F:40:24').then(() => {
                console.log('connessione attivata')
                resolve(true)
            }).catch(err => {
                reject(false)
                alert('Bluetooth non trovato o non attivo')
            })

        }).catch(err => {
            console.log(err)
        })

    }



    /*BleManager.retrieveServices('90:E2:02:8F:40:24' )
    .then((peripheralInfo) => {
        // Success code
        console.log('Peripheral info:', peripheralInfo);
    
        BleManager.startNotification('90:E2:02:8F:40:24', 'FFE0', 'FFE1')
            .then(() => {
               resolve(true)
                console.log('Notification started');
                
            })
            .catch((error) => {
                reject(true)
                console.log(error);
            })
    })
    */

    startNot = () => {
        return new Promise((resolve, reject) => {
            BleManager.retrieveServices(peripheral_ID)
                .then((peripheralInfo) => {
                    // Success code
                    //console.log('Peripheral info:', peripheralInfo);
                    BleManager.startNotification(peripheral_ID, characteristic, service)
                        .then(() => {
                            resolve(true)
                            console.log('Notification started');
                        })
                        .catch((error) => {
                            reject(true)
                            console.log(error);
                        })
                })
        })
    }



    writeData = () => {
        return new Promise((resolve) => {
            console.log('Scrivo a arduino')
            BleManager.write('90:E2:02:8F:40:24', 'FFE0', 'FFE1', data)
                .then(() => {
                    // Success code
                    console.log('Write: ' + data);
                    bleManagerEmitter.addListener(
                        'BleManagerDidUpdateValueForCharacteristic',
                        ({ value, peripheral_ID, characteristic, service }) => {
                            let data = this.bluetoothHandler(value)
                            console.log(data)
                            resolve(data)

                        }
                    );
                })
                .catch((error) => {
                    // Failure code
                    console.log(error);
                });
        })

    }

    handleUpdateValueForCharacteristic = (data) => {
        this.bluetoothHandler(data)
    }
    /**
     * 
     */
    bluetoothHandler = (data) => {
        /*   console.log('Received data from ' + data.peripheral + ' characteristic '
               + data.characteristic + ' ' + data.value);*/
        const rowData = data//.value
        let dataObject = {}
        if (rowData) {
            dataObject.temp = rowData[0]
            dataObject.groundSoilMost = rowData[1]
            dataObject.atmSoilMost = rowData[2]
            dataObject.isDay = ((rowData[3] === 48) ? 'DAY' : 'NIGHT')
            dataObject.info = this.handlerInfo(rowData[4])
        }
        // console.log(dataObject)
        return dataObject
        //console.log(this.dataObject)


    }

    handlerInfo = (param = 0) => {
        switch (param) {
            case 0:
                return 'SmartGarden non è connesso con Arduino'

            case 1:
                return 'SmartGarden Online'
        }
    }





}
export default Bluetooth;
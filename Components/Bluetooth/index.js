
import {
    Platform,
    PermissionsAndroid,
    NativeEventEmitter,
    NativeModules,
} from 'react-native';
/**
 * 
 */
import { bytesToString } from 'convert-string';
import BleManager from 'react-native-ble-manager';
/**
 * 
 */
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
const peripheral_ID = '90:E2:02:8F:40:24'
const characteristic = 'FFE0'
const service = 'FFE1'
/**
 * 
 */
class Bluetooth {
    constructor() {
        console.log('constructor Setting bluetooth')
        this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic);
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
        if (!Bluetooth.istance) {
            Bluetooth.istance = this
            // this.startSession()
        }
        return Bluetooth.istance



        //  this.startSession()

    }
    /**
     * 
     */
    checkSess = () => {
        BleManager.checkState()
    }
    /**
     * 
     */
    disconnect = () => {
        console.log('Setting bluetooth disconnect')
        BleManager.removePeripheral(peripheral_ID).then((res) => {
            console.log(res)
        })
    }
    /**
     * 
     */
    isConnected = () => {
        console.log('Setting bluetooth isConnected')
        return new Promise((resolve, reject) => {
            BleManager.isPeripheralConnected(peripheral_ID)
                .then((isConnected) => {
                    if (isConnected) {
                        console.log('Peripheral smartGraden is connected!');
                        resolve(true)
                    } else {
                        console.log('Peripheral smartGraden is NOT connected!');
                        reject(false)
                    }
                }).catch(err => {
                    console.log('bluetooth isConnected err ' + err);
                    reject(false)
                })
        })
    }


    /**
     * 
     */
    startSession = () => {
        console.log('bluetooth, startSession');
        BleManager.start({ showAlert: false })
            .then(() => {
                console.log('Module initialized');
            }).catch(err => {
                console.log(err)
            });
    }
    /**
     * 
     */

    enableBluetooth = () => {
        console.log('bluetooth, enableBluetooth');
        BleManager.enableBluetooth()
            .then(() => {
                console.log('The bluetooth is already enabled or the user confirm');
            })
            .catch((error) => {
                console.log('The user refuse to enable bluetooth');
            });
    }
    /**
     * 
     */
   searchConnession = () => {
        console.log('Bluetooth - searchConnession')
        return new Promise((resolve, reject) => {
            setTimeout(() => reject(false), 4000)
            BleManager.connect(peripheral_ID).then(() => {
                console.log('Bluetooth - searchConnession - connessione riuscita')
                resolve(true)
            }).catch(err => {
                 reject(false)
                console.log('Bluetooth - searchConnession - connessione bluetooth non riuscita ' + err)
                alert('Bluetooth non trovato o non attivo')
            })
        })
    }
    /**
     * 
     */
    startNot = () => {
        console.log('Bluetooth - startNot')
        return new Promise((resolve, reject) => {
            BleManager.retrieveServices(peripheral_ID)
                .then((peripheralInfo) => {
                    //console.log('Peripheral info:', peripheralInfo);
                    BleManager.startNotification(peripheral_ID, characteristic, service)
                        .then(() => {
                            console.log('Bluetooth - startNot - startNotification - Notification started');
                            resolve(true)
                        })
                        .catch((error) => {
                            console.log('Bluetooth - startNot - startNotification - Notification reject ' + error);
                            reject(false)
                        })
                }).catch(err=>{
                    console.log('Bluetooth - startNot -retrieveServices - Notification reject ' + err);
                })
        })
    }

    /**
     * 
     */
    sendData = (par) => {
        console.log('Bluetooth - sendData')
        return new Promise((resolve, reject) => {
            BleManager.write(peripheral_ID, characteristic, service, par)
                .then(() => {
                    // Success code
                    console.log('Bluetooth - sendData Dato inviato ad arduino: ' + par);
                    bleManagerEmitter.addListener(
                        'BleManagerDidUpdateValueForCharacteristic',
                        ({ value, peripheral_ID, characteristic, service }) => {
                            let data = this.bluetoothHandlerData(value)
                            resolve(data)
                        }
                    );
                })
                .catch((error) => {
                    console.log('bluetooth  sendData reject ' + error)
                    reject(false)
                });
        })
    }
    /**
     * 
     */
    refresh = () => {
        return new Promise((resolve, reject) => {
            BleManager.refreshCache(peripheral_ID)
                .then((peripheralInfo) => {
                    resolve()
                    console.log('cache refreshed!')
                })
                .catch((error) => {
                    console.error(error)
                });
        })

    }
   /**
    * 
    */
    bluetoothHandlerData = (data) => {
        console.log('Bluetooth - bluetoothHandlerData')
        console.log('Bluetooth - bluetoothHandlerData - dati in ASCII in arrivo da arduino ' + data)
        let rowData = bytesToString(data)
        console.log('Bluetooth - bluetoothHandlerData - dati convertiti inb stringa  ' + rowData)
        let dataObject = {}
        if (rowData) {
            dataObject.temp = rowData.substring(0,5)
            dataObject.groundSoilMost = rowData.substring(5,10)
            dataObject.atmSoilMost = rowData.substring(10,15)
            dataObject.isDay = ((rowData.substring(15,19) === '0.00') ? 'DAY' : 'NIGHT')
            dataObject.info = this.handlerInfo(rowData.substring(19,21))
        }
        return dataObject
    }

    handlerInfo = (param = '0') => {
        switch (param) {
            case '0':
                return 'SmartGarden non è connesso con Arduino'

            case '1':
                return 'SmartGarden Online'

            case '2':
                return 'Irrigazione Disattivata'

            case '3':
                return 'Irrigazione Attivata'

        }
    }





}
export default Bluetooth;
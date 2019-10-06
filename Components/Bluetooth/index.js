
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
        }
        return Bluetooth.istance



        //this.startSession()

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
            BleManager.isPeripheralConnected(peripheral_ID, service)
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
                })
        }).catch(err => {
            console.log('bluetooth isConnected catturata eccezione ' + err)
            reject(false)
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
    myConnecting = () => {
        console.log('bluetooth Connecting')
        return new Promise((resolve, reject) => {
            BleManager.connect(peripheral_ID).then(() => {
                console.log('connessione riuscita')
                resolve(true)
            }).catch(err => {
                reject(false)
                console.log(' connessione bluetooth non riuscita ')
                alert('Bluetooth non trovato o non attivo')
            })
        }).catch(err => {
            console.log('bluetooth Connecting catturata eccezione')
            console.log(err)
            reject(false)
        })
    }
    /**
     * 
     */
    startNot = () => {
        console.log('bluetooth  startNot')
        return new Promise((resolve, reject) => {
            BleManager.retrieveServices(peripheral_ID)
                .then((peripheralInfo) => {
                    //console.log('Peripheral info:', peripheralInfo);
                    BleManager.startNotification(peripheral_ID, characteristic, service)
                        .then(() => {
                            console.log('Notification started');
                            resolve(true)
                        })
                        .catch((error) => {
                            console.log('Notification reject');
                            reject(true)
                            console.log(error);
                        })
                })
        }).catch(err => {
            console.log(err)
            console.log('bluetooth  startNot catturata eccezione ')
        })
    }

    /**
     * 
     */
    sendData = (par) => {
        console.log('bluetooth  sendData')
        return new Promise((resolve, reject) => {
            BleManager.write(peripheral_ID, characteristic, service, par)
                .then(() => {
                    // Success code
                    console.log('dato inviato ' + par);
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
        }).catch(err => {
            console.log('bluetooth  writeData catturata eccezione ' + err)
            //reject(false)
        })
    }
    /**
     * 
     */
    bluetoothHandlerData = (data) => {
        console.log('bluetooth,  bluetoothHandlerData')
        console.log('dato in arrivo grezzo ' + data)
        const rowData = data
        let dataObject = {}
        if (rowData) {
            dataObject.temp = rowData[0]
            dataObject.groundSoilMost = rowData[1]
            dataObject.atmSoilMost = rowData[2]
            dataObject.isDay = ((rowData[3] === 0) ? 'DAY' : 'NIGHT')
            dataObject.info = this.handlerInfo(rowData[4])
        }
        else {
            dataObject.info = 0
        }
        return dataObject
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
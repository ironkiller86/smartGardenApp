import React, { Component } from 'react'
import { bytesToString } from 'convert-string';
import { Button } from 'react-native'
import { stringToBytes } from 'convert-string';
import {withContext} from '../../Components/Context/consumer'

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

const window = Dimensions.get('window');
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

/**
 * 
 */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
        // backgroundColor: '#FFF',
        // width: window.width,
        // height: window.height
    },
    switch: {
        flex: 1,
        alignItems: 'flex-start'
    },
    scroll: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        margin: 10,
        borderWidth: 1.5
    },
    row: {
        margin: 10
    },
});



class SettingBluetooth extends Component {
    constructor(props) {
        console.log('constructor Setting bluetooth')
        super(props)
       
        this.state = {
            scanning: false,
            peripherals: new Map(),
            appState: '',
            stateSwitch: false
        }
    }


    componentDidMount() {
        console.log('componentDidMount Setting bluetooth')
        AppState.addEventListener('change', this.handleAppStateChange)
        /**
         *
         */
        BleManager.start({ showAlert: false })
        /**
         * controllo del permesso su posizione approssimativa.....
         */
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
        /**
         * 
         */
        this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral);
        this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan);
        this.handlerDisconnect = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral);
        this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic);
    }
    handleDisconnectedPeripheral = (data) => {
        let peripherals = this.state.peripherals;
        let peripheral = peripherals.get(data.peripheral);
        if (peripheral) {
            peripheral.connected = false;
            peripherals.set(peripheral.id, peripheral);
            this.setState({ peripherals });
        }

       this.props.context.setData([])
        console.log('Disconnected from ' + data.peripheral);
    }

    handleUpdateValueForCharacteristic = (data) => {
        this.bluetoothHandler(data)
    }
    /**
     * 
     */
    bluetoothHandler = (data) => {
        console.log('Received data from ' + data.peripheral + ' characteristic '
            + data.characteristic + ' ' + data.value);
        const rowData = data.value
        let dataObject = {}
        if (rowData) {
            dataObject.temp = rowData[0]
            dataObject.groundSoilMost = rowData[1]
            dataObject.atmSoilMost = rowData[2]
            dataObject.isDay = ((rowData[3] === 48) ? 'DAY' : 'NIGHT')
            dataObject.info = this.handlerInfo(rowData[4])
        }
        console.log(dataObject)
        this.props.context.setData(dataObject)
    }
    
    handlerInfo = (param = 0) => {
        switch(param) {
            case 0:
                return 'SmartGarden non è connesso con Arduino'

            case 1:
               return 'SmartGarden Online'    
        }
    }

    handleStopScan = () => {
        console.log('Scan is stopped');
        this.setState({ scanning: false });
    }

    handleDiscoverPeripheral = (peripheral) => {
        var peripherals = this.state.peripherals;
        if (!peripherals.has(peripheral.id)) {
            console.log('Got ble peripheral', peripheral);
            peripherals.set(peripheral.id, peripheral);
            this.setState({ peripherals })
        }
    }


  

    /**
     * 
     */
    componentWillUnmount() {
        console.log('componentWillUnmount Setting bluetooth')
        this.handlerDiscover.remove();
        this.handlerStop.remove();
        this.handlerDisconnect.remove();
        this.handlerUpdate.remove();
    }
    /**
     * Avvio scan device
     */
    startScan = () => {
        console.log('dentro')
        if (!this.state.scanning) {
            this.setState({ peripherals: new Map() });
            BleManager.scan([], 10, true).then((results) => {
                console.log('Scanning...');
                this.setState({ scanning: true });
            });
        }
    }
    /**
     * 
     */
    retrieveConnected = () => {
        BleManager.getConnectedPeripherals([]).then((results) => {
            if (results.length == 0) {
                console.log('No connected peripherals')
            }
            console.log(results);
            var peripherals = this.state.peripherals;
            for (var i = 0; i < results.length; i++) {
                var peripheral = results[i];
                peripheral.connected = true;
                peripherals.set(peripheral.id, peripheral);
                this.setState({ peripherals });
            }
        });
    }

  componentWillReceiveProps() {
    console.log(' componentWillReceiveProps Setting bluetooth')
      console.log('valore in arrivo ' + this.props.context.getIrrigation())
  }

    /**
     *  sente l' app è eseguita in background o meno,
     *  e lo notifica settandone lo stato nel componente 
     */
    handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            console.log('App has come to the foreground!')
            BleManager.getConnectedPeripherals([]).then((peripheralsArray) => {
                console.log('Connected peripherals: ' + peripheralsArray.length);
            });
        }
        this.setState({ appState: nextAppState });
    }

    activeBluetooth = () => {
        if (!this.state.stateSwitch) {
            this.setState({ stateSwitch: true })
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
        else if (this.state.stateSwitch) {
            this.setState({ stateSwitch: false })

        }
    }



    writeData = () => {
        console.log('Scrivo a arduino')
        BleManager.write('90:E2:02:8F:40:24', 'FFE0', 'FFE1', data)
            .then(() => {
                // Success code
                console.log('Write: ' + data);
            })
            .catch((error) => {
                // Failure code
                console.log(error);
            });
    }


    connect = (peripheral) => {
        if (peripheral) {
            if (peripheral.connected) {
                BleManager.disconnect(peripheral.id);
            } else {
                BleManager.connect(peripheral.id).then(() => {
                    let peripherals = this.state.peripherals
                    let p = peripherals.get(peripheral.id)
                    // console.log(peripheral)
                    if (p) {
                        p.connected = true;
                        peripherals.set(peripheral.id, p)
                        this.setState({ peripherals })
                    }

                    BleManager.retrieveServices(peripheral.id)
                        .then((peripheralInfo) => {
                            // Success code
                            console.log('Peripheral info:', peripheralInfo);

                            BleManager.startNotification(peripheral.id, 'FFE0', 'FFE1')
                                .then(() => {
                                    // Success code
                                    console.log('Notification started');
                                })
                                .catch((error) => {
                                    // Failure code
                                    console.log(error);
                                });
                        });
                })
            }
        }
    }





    render() {
        const list = Array.from(this.state.peripherals.values());
        const dataSource = ds.cloneWithRows(list);
        return (
            <React.Fragment>
           
                <View style={styles.container}>
                    <View style={styles.switch}>
                        <Text>Active bluetooth</Text>
                        <Switch value={this.state.stateSwitch} onValueChange={this.activeBluetooth} />
                        <Button
                            title="Press me"
                            color="#f194ff"
                            onPress={this.writeData}
                        />
                    </View>
                    <TouchableHighlight style={{ marginTop: 40, margin: 20, padding: 20, backgroundColor: '#ccc' }} onPress={() => this.startScan()}>
                        <Text>Scan Bluetooth ({this.state.scanning ? 'on' : 'off'})</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={{ marginTop: 0, margin: 20, padding: 20, backgroundColor: '#ccc' }} onPress={() => this.retrieveConnected()}>
                        <Text>Retrieve connected peripherals</Text>
                    </TouchableHighlight>
                    <ScrollView style={styles.scroll}>
                        {(list.length == 0) &&
                            <View style={{ flex: 1, margin: 20 }}>
                                <Text style={{ textAlign: 'center' }}>No peripherals</Text>
                            </View>
                        }
                        <ListView
                            enableEmptySections={true}
                            dataSource={dataSource}
                            renderRow={(item) => {
                                const color = item.connected ? 'green' : '#fff';
                                return (
                                    <TouchableHighlight onPress={() => this.connect(item)}>
                                        <View style={[styles.row, { backgroundColor: color }]}>
                                            <Text style={{ fontSize: 12, textAlign: 'center', color: '#333333', padding: 10 }}>{item.name}</Text>
                                            <Text style={{ fontSize: 8, textAlign: 'center', color: '#333333', padding: 10 }}>{item.id}</Text>
                                        </View>
                                    </TouchableHighlight>
                                );
                            }}
                        />
                    </ScrollView>
                </View>
            </React.Fragment>
        )
    }
}
export default withContext(SettingBluetooth)
import React, { Component } from 'react'
import { Box, InformationField, Container } from '../Box'
import { stringToBytes } from 'convert-string';
import {
    Text, View, StyleSheet,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Button,


} from 'react-native';

import Bluetooth from './../Bluetooth/index';
import { Spinner } from './../Box/index';
const timer = require('react-native-timer');
const styles = StyleSheet.create({
    main: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'gray'
    },
    txtBtn: {
        padding: 5,
        alignItems: 'center',
        textAlign: 'center',
        fontSize: 25,
        color: 'white'
    },
    dashBoard: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        margin: '1%',
        borderWidth: 1.5,
        justifyContent: "center",
        backgroundColor: 'black',

        //height:100
    },
    bxDashboard: {
        width: '25%',
        margin: 5,
        padding: 2


    },
    lightIndicator: {
        width: '25%',
        backgroundColor: 'red',
        borderRadius: 100,
        borderWidth: 1.5,
        position: "absolute",
        padding: 5,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    statusWrapper: {
        flex: 1,
        height: 100
    },
    statusOk: {
        backgroundColor: 'green',
    },
    btn: {
        textAlign: 'right'
    }
})
/**
 * 
 */
const textLabel = {
    one: 'Temp',
    two: 'Umid Terr',
    three: 'Umid Atm',
    four: 'Fase Giornata',
    five: 'App Information'
}
/**
 * 
 */
const ble = new Bluetooth()
/**
 * 
 */
class BoxContainer extends Component {
    constructor(props) {
        console.log('BoxContainer - constructor')
        super(props)
        this.state = {
            isConnected: false,
            status: 'offline',//this.status,
            sensorData: [],
            irrigationState: false
        }
        this.getInfo = stringToBytes('i')
        this.activeIrr = stringToBytes('a')
        this.stopIrrigation = stringToBytes('s')
        this.isBle = this.props.isBle
        /**
         * 
         */
        this.connecting()
    }


    /**
     * 
     */
    parseObject = (data) => {
        console.log('BoxContainer - parseObject')
        let dataArray = []
        let objectData = data
        Object.keys(objectData).map((res) => {
            dataArray.push(objectData[res])
        })
        this.setState({ sensorData: dataArray })
    }
    /**
     * 
     */
    sendData = (action = this.getInfo) => {
        console.log('BoxContainer - sendData')
        if (this.isBle) {
            ble.sendData(action).then((res) => {
                console.log('BoxContainer - sendData - da arduino arriva ' + JSON.stringify(res))
                this.parseObject(res)
            }).catch(err => {
                console.log('BoxContainer - sendData catch ' + err)
                this.setState({
                    isConnected: false,
                    status: 'offline'
                })
            })
        }
    }
    /**
     * 
     */
    connecting = () => {
        console.log('BoxContainer - connetting ')
        if (this.isBle) {
            return ble.searchConnession().then((res) => {
                this.setState({
                    isConnected: res,
                    status: 'online'
                })
                ble.startNot().then(() => {
                    console.log('BoxContainer - connetting  - notification attivata')
                    //  timer.setInterval(this, 'func', this.sendData, 20000);
                    this.sendData()
                })
            }).catch(res => {
                alert('connessione non riuscita')
                console.log('BoxContainer - connetting - connessione non riuscita ' + res)
            })

        }

    }
    /**
     * 
     */
    componentDidMount() {
        console.log('BoxContainer - componentDidMount')
        if (this.isBle && !this.state.isConnected) {
            this.connecting().then(() => {
                if (this.state.isConnected) {
                    timer.setInterval(this, 'func', this.sendData, 20000);
                }
            }).catch(err => {
                console.log('BoxContainer - componentDidMount ' + err)
            })
        }
    }
    /**
     * 
     */
    handlerIrrigationState = () => {
        console.log('BoxContainer - handlerIrrigationState')
        if (!this.state.irrigationState) {
            this.sendData(this.activeIrr)
            this.setState({ irrigationState: true })
        }
        else {
            this.sendData(this.stopIrrigation)
            this.setState({ irrigationState: false })
        }
    }

    /**
     * 
     */
    componentWillUnmount() {
        console.log('BoxContainer - componentWillUnmount')
        if (this.isBle) {
            console.log('BoxContainer - componentWillUnmount - Disconnessione dal Arduino')
            ble.disconnect()
        }
    }

    /**
     * 
     */
    render() {
        console.log('BoxContainer - render')
        return (
            <SafeAreaView style={{ backgroundColor: "gray" }}>
                <StatusBar backgroundColor="gray" barStyle="light-content" showHideTransition='slide' />
                <ScrollView >
                    <View style={styles.dashBoard}>
                        <View style={styles.bxDashboard}>
                            <Button style={styles.btn}
                                disabled={this.state.isConnected}
                                title="RCT"
                                color={this.state.isConnected ? 'red' : 'green'}
                                onPress={this.connecting}
                            />
                        </View>
                        <View style={styles.bxDashboard}>
                            <Button
                                disabled={this.state.isConnected ? false : true}
                                title={!this.state.irrigationState ? 'Start Irrig' : 'Stop Irrig'}
                                color={!this.state.irrigationState ? 'green' : 'red'}
                                onPress={this.handlerIrrigationState}
                            />
                        </View>

                        <View style={styles.bxDashboard}>
                            <Button
                                disabled={this.state.isConnected ? false : true}
                                title="Update"
                                color='blue'
                                onPress={this.connecting}
                            />
                        </View>
                        <View style={styles.bxDashboard}>

                        </View>
                    </View>
                    <View style={styles.main}>
                        <Container>
                            <Box label={textLabel.one} data={(this.state.sensorData[0]) || 0} />
                            <Box label={textLabel.two} data={(this.state.sensorData[1]) || 0} />
                            <Box label={textLabel.three} data={(this.state.sensorData[2]) || 0} />
                            <Box label={textLabel.four} data={(this.state.sensorData[3]) || '-'} />
                            <InformationField value={textLabel.five} info={(this.state.isConnected) ? this.state.sensorData[4] : 'Off Line'} />

                        </Container>
                    </View>
                    <View style={styles.statusWrapper}>
                        <Text style={[styles.lightIndicator, this.state.isConnected && styles.statusOk]}>{(this.isBle) ? 'BLE' : ''}</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>

        )
    }
}
export default BoxContainer


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
        backgroundColor: 'black'
    },
    bxDashboard: {
        width: '25%',
        margin: 3,

    },
    status: {
        width: '25%',
        backgroundColor: 'red',
        borderRadius: 100,
        borderWidth: 1.5,
        position: "absolute",
        padding: 5
    },
    statusWrapper: {
        flex: 1,
        height: 100
    },
    statusOk: {
        backgroundColor: 'green',
    }
})


const textLabel = {
    one: 'Temp',
    two: 'Umid Terr',
    three: 'Umid Atm',
    four: 'Press Atm',
    five: 'App Information'
}
const ble = new Bluetooth()

class BoxContainer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isConnected: false,
            status: this.status,
            sensorData: []
        }
        this.getInfo = stringToBytes('i')
        this.activeIrr = stringToBytes('a')
        this.stopIrrigation = stringToBytes('s')
        ble.startSession()
    }

  

    parseObject = (data) => {
        let dataArray = []
        let objectData = data
        Object.keys(objectData).map((res) => {
            dataArray.push(objectData[res])
        })
        this.setState({ sensorData: dataArray })
    }




    sendData = (action=this.getInfo) => {
        if(action ==='a') {
            alert('Irrigazione Attivata')
        }
        ble.sendData(action).then((res) => {
            console.log('da box ' + JSON.stringify(res))
            this.parseObject(res)
           
        }).catch(err=>{
            console.log('boxContainer catch sendData ' + err)
            this.setState({isConnected:false,
                           status:false
            })
        })
    }

    connecting = () => {
        console.log('BoxContainer connetting ')
        return ble.myConnecting().then((res) => {
            this.setState({ isConnected: res })
          if (this.state.isConnected) {
                ble.startNot().then(res => {
                    console.log('notification res ' + res)
                    this.sendData()
                })
            } else {
                alert('SmartGarden not found!')
            }
        }).catch(err=>{
            console.log('boxContainer  connecting catturata eccezzione ' + err)
        })
    }


    


    componentDidMount() {
        console.log('componentDidMount')
       if (!this.isConnected) {

         this.connecting().then(() => {
                if (this.state.isConnected) {
                    timer.setInterval(this, 'func', this.sendData, 5000);
                }
            }).catch(err => {
                console.log(err)
            })
        }
    }

    componentWillUnmount() {
        console.log('componentWillUnmount')
        ble.disconnect()
    } 


    render() {
        return (

            <SafeAreaView style={{ backgroundColor: "gray" }}>
                <StatusBar backgroundColor="gray" barStyle="light-content" showHideTransition='slide' />
                <ScrollView >



                    <View style={styles.dashBoard}>
                        <View style={styles.bxDashboard}>
                            <Button style={styles.btn}

                                title="reconnect"
                                color='gray'
                                onPress={this.connecting}
                                
                            />
                        </View>
                        <View style={styles.bxDashboard}>
                            <Button
                                title="Active Irrig"
                                color='gray'
                                onPress={ ()=>this.sendData(this.activeIrr)}
                            />
                        </View>
                        <View style={styles.bxDashboard}>
                            <Button
                                title="Stop Irrig"
                                color='gray'
                                onPress={()=>this.sendData(this.stopIrrigation)}
                            />
                        </View>
                        <View style={styles.bxDashboard}>
                            <Button

                                title="Press me"
                                color='gray'
                                onPress={/*ble.writeData*/ () => alert('ciao')}
                            />
                        </View>
                        <View style={styles.bxDashboard}>
                            <Button
                                title="Press me"
                                color='gray'
                                onPress={/*ble.writeData*/ () => alert('ciao')}
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
                            <InformationField value={textLabel.five} info={(this.state.isConnected)?this.state.sensorData[4] : 'Off Line'} />

                        </Container>
                    </View>
                    <View style={styles.statusWrapper}>
                        <Text style={[styles.status, this.state.isConnected && styles.statusOk]}></Text>

                    </View>



                </ScrollView>
            </SafeAreaView>

        )
    }
}
export default BoxContainer


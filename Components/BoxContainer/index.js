import React, { Component } from 'react'
import { Box, InformationField, Container } from '../Box'

import {
    Text, View, StyleSheet,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Button,


} from 'react-native';

import { withContext } from '../../Components/Context/consumer'
import Bluetooth from './../Bluetooth/index';
import { Spinner } from './../Box/index';
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
        ble.startSession()
        ble.enableBluetooth()



    }

    parseObject = (data) => {
        let dataArray = []
        let objectData = data 
        Object.keys(objectData).map((res) => {
            dataArray.push(objectData[res])
        })
        // console.log(dataArray)
        this.setState({ sensorData: dataArray })
    }


    componentDidMount() {
        ble.connecting().then((res) => {
            console.log('eccolo ' + res)
            this.setState({ isConnected: res })
            if (this.state.isConnected) {
                ble.startNot().then(res => {
                    console.log('notification res ' + res)
                    ble.writeData().then((res) => {
                        console.log('da box ' + JSON.stringify(res))
                        this.parseObject(res)

                    })

                })
            }
        })


    }
    render() {
        return (

            <SafeAreaView style={{ backgroundColor: "gray" }}>
                <StatusBar backgroundColor="gray" barStyle="light-content" showHideTransition='slide' />
                <ScrollView >



                    <View style={styles.dashBoard}>
                        <View style={styles.bxDashboard}>
                            <Button style={styles.btn}

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
                            <InformationField value={textLabel.five} info={(this.state.sensorData[4]) || 'Off Line'} />

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
export default withContext(BoxContainer)


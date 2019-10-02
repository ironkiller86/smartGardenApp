import React, { Component } from 'react';
import { withContext } from '../../Components/Context/consumer'
import SettingBluetooth from '../../Components/SettingBluetooth'

import Bluetooth from '../../Components/Bluetooth';
let ble = new Bluetooth()
  


import {
    Text,
    View,
    StyleSheet,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    Button

} from 'react-native';

import { MyButton } from '../Box'


import BoxContainer from '../BoxContainer';

const styles = StyleSheet.create({
    Mybutton: {
        marginTop:10,
        borderWidth:1,
        borderRadius:10,
        height:50,
        backgroundColor: '#E0FFFF',
        margin: '1%'
    },
    txtBtn: {
        padding: 5,
        alignItems:'center',
        textAlign: 'center',
        fontSize: 25,
        color: 'black'
    }
 
});






class HomePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isClick: false
        }
        this.isClicked = false
        this.irrigation= this.props.context
    }

   /* hadlerClick = () => {
        this.isClicked = !this.isClicked
        this.setState({ isClick: this.isClicked})
       
      
    }*/


    connect = () => {
        ble.connect()
    }

    componentDidMount() {
      //  this.irrigation.setIrrigation(this.state.isClick)
        
    }


    render() {
        console.log('render Home PAge')
      //  console.log(this.state.isClick)
     
        return (
            <>
                <SafeAreaView>
                    <ScrollView>
                        <StatusBar backgroundColor="gray" barStyle="light-content" showHideTransition='slide' />
                        <BoxContainer data={ble.dataObject} />
                        {/*          <MyButton value={'Avvia Irrigazione'} action={this.hadlerClick}/> */}
                        <TouchableOpacity
                            style={styles.Mybutton}
                            onPress={ble.startScan}
                        >
                            <Text style={styles.txtBtn}>premi</Text>
                        </TouchableOpacity>
                        <Button
                            title="Press me"
                            color="#f194ff"
                            onPress={ble.writeData}
                        />

                    </ScrollView>
                </SafeAreaView>
            </>
        )
    }
}
export default withContext(HomePage)
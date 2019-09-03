import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StatusBar
} from 'react-native';

import { MyButton } from '../Box'


import BoxContainer from '../BoxContainer';

class HomePage extends Component {


    render() {
        return (
            <ImageBackground source={require('../../image/image2.jpg')} style={{ width: '100%', height: '100%' }}>
                <SafeAreaView>
                    <ScrollView>
                        <StatusBar backgroundColor="gray" barStyle="light-content" showHideTransition='slide' />
                       <BoxContainer/>
                        <MyButton value={'Avvia Irrigazione'}/>
                        <MyButton value={'Ferma Irrigazione'} />
                    </ScrollView>
                </SafeAreaView>
            </ImageBackground>
        )
    }
}
export default HomePage
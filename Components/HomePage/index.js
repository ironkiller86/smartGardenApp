import React, { Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StatusBar,
   
} from 'react-native';

import { MyButton } from '../Box'


import BoxContainer from '../BoxContainer';


class HomePage extends Component {


    render() {
        return (
    
          
                <SafeAreaView>
                    <ScrollView>
                        <StatusBar backgroundColor="gray" barStyle="light-content" showHideTransition='slide' />
                       <BoxContainer/>
                        <MyButton value={'Avvia Irrigazione'}/>
                        <MyButton value={'Ferma Irrigazione'} />
                    </ScrollView>
                </SafeAreaView>
        
           
        )
    }
}
export default HomePage
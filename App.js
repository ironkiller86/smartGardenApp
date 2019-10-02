/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import config from './config.json'
import React, { Component } from 'react';
import {Platform, StyleSheet, Text, View,ImageBackground,Image} from 'react-native';
//import TabNavigator from './Components/TabNavigator'
import { Spinner } from './Components/Box'
import Provider from './Components/Context/index'
import Navigator from './Components/TabNavigator'
import HomePage from './Components/HomePage';
import BoxContainer from './Components/BoxContainer'


  


 class App extends Component {
    constructor(props){
       super(props)
       this.state = {
         loaded:false,
         flag:false,
         value:[]
       }
    }


startApp = () => {
  
 // this.setState({flag:true})
  this.setState({loaded:true})

}





  componentDidMount() {
    
  
    
  }

  render() {
   
    return (
      <BoxContainer/>
    )
  }
}
export default App


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

import { Spinner } from './Components/Box'

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
  

  this.setState({loaded:true})

}





  componentDidMount() {
    
 
    
  }

  render() {
   
    return (
      <BoxContainer />
    )
  }
}
export default App


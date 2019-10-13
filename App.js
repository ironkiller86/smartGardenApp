/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import config from './config.json'
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ImageBackground, Image } from 'react-native';
import { Spinner } from './Components/Box'
import BoxContainer from './Components/BoxContainer'
import Bluetooth from './Components/Bluetooth/index';
const ble = new Bluetooth()
/**
 * 
 */
class App extends Component {
  constructor(props) {
    console.log('App.js constructor')
    super(props)
    this.state = {
      isBle: false,
      loaded: false,
    }
    ble.startSession()
  }
  /**
   * 
   */
  componentDidMount() {
    console.log('App.js ComponentDidMount')
    ble.searchConnession().then(isConnected => {
      console.log('App.js ComponentDidMount Promise risolta: ' + isConnected)
      this.setState({
        isBle: isConnected,
        loaded: true
      })
    }).catch(isConnected => {
      console.log('App.js ComponentDidMount Promise reject: ' + isConnected)
      this.setState({ loaded: true })
    })


  }
  /**
   * 
   */
  render() {
    return (
      (this.state.loaded) ?
        <BoxContainer isBle={this.state.isBle} /> : <Spinner />
    )
  }
}
export default App


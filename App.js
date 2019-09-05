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
import TabNavigator from './Components/TabNavigator'
import { Spinner } from './Components/Box'






export default class App extends Component {
    constructor(props){
       super(props)
       this.state = {
         loaded:false,
         flag:false
       }
    }


startApp = () => {
  console.log('startApp')
 // this.setState({flag:true})
  this.setState({loaded:true})

}





  componentDidMount() {
    console.log('componentDidMount')
  
    
  }

  render() {
    console.log('stato ' + this.state.loaded)
    return (
      <React.Fragment>
        <ImageBackground  onLoadEnd={this.startApp} source={require('./image/image2.jpg')} style={{ width: '100%', height: '100%' }}>
          {
            (this.state.loaded) ? <TabNavigator/> :<Spinner/>
          }
        </ImageBackground> 
      </React.Fragment>
    )
  }
}



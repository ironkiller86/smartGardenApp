import React, { Component } from 'react'
import {Box, InformationField, Container } from '../Box'
import { Text, View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    main: {
        flex: 1,
        flexDirection: 'column',
        
        
    }
})


const textLabel = {
    one:'Temp',
    two: 'Umid Terr',
    three: 'Umid Atm',
    four: 'Press Atm',
    five: 'App Information'
 }

class BoxContainer extends Component {


    render() {
        return (
                <View style={styles.main}>
                    <Container>
                       <Box value={textLabel.one}/>
                       <Box value={textLabel.two}/>
                       <Box value={textLabel.three}/>
                       <Box value={textLabel.four}/>
                       <InformationField value={textLabel.five} />
                    </Container>    
                </View>
        )
    }
}
export default BoxContainer


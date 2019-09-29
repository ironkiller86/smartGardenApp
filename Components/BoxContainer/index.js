import React, { Component } from 'react'
import { Box, InformationField, Container } from '../Box'
import { Text, View, StyleSheet } from 'react-native';
import { withContext } from '../../Components/Context/consumer'
const styles = StyleSheet.create({
    main: {
        flex: 1,
        flexDirection: 'column',


    }
})


const textLabel = {
    one: 'Temp',
    two: 'Umid Terr',
    three: 'Umid Atm',
    four: 'Press Atm',
    five: 'App Information'
}

class BoxContainer extends Component {
    constructor(props) {
        super(props)
        this.data = this.props.context
        this.state = {
            sensorData: []
        }
    }

    componentWillReceiveProps() {
        let dataArray = []
        let objectData = this.data.getData()
        Object.keys(objectData).map((res) => {
            dataArray.push(objectData[res])
        })
       // console.log(dataArray)
        this.setState({sensorData : dataArray})
    }


     
    render() {
     
     
        return (
            <View style={styles.main}>
                <Container>
                    <Box label={textLabel.one} data={(this.state.sensorData[0]) || 0} />
                    <Box label={textLabel.two} data={(this.state.sensorData[1]) || 0} />
                    <Box label={textLabel.three} data={(this.state.sensorData[2]) || 0} />
                    <Box label={textLabel.four} data={(this.state.sensorData[3]) || '-'} />
                    <InformationField value={textLabel.five} info={(this.state.sensorData[4]) || 'Off Line'} />
                </Container>
            </View>
        )
    }
}
export default withContext(BoxContainer)


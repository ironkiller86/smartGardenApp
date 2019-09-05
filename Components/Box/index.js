import React from 'react';
import { Text, View, StyleSheet, ImageBackground, TouchableOpacity, ActivityIndicator } from 'react-native';

/**
 * 
 */
const styles = StyleSheet.create({
    box: {
        borderRadius:10,
        borderWidth: 1.5,
        width: '48%',
        margin: '1%',
        color: 'black'
    },
    txt: {
        padding: 30,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 45,
        color: 'black'
      
    },
    textLabel: {
        borderBottomWidth:1.5,
        borderBottomRightRadius:1.5,
        borderBottomLeftRadius:1.5,
        borderRadius:10,
        padding: 10,
        backgroundColor: '#B4B0A9',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 25,
        color: 'black'
    },
    textInfo: {
        alignItems:'center',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black'
    },
    boxField: {
        flex: 1,
        borderWidth: 1.5,
        borderRadius:10,
        fontSize: 45,
        margin: '1%'
    },
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
/**
 * 
 */
export const Box = (props) => {
    return (
        <View style={styles.box}>
            <Text style={styles.textLabel}>{props.value}</Text>
            <Text style={styles.txt}>55</Text>
        </View>
    )
}
/**
 * 
 * @param {*} props 
 */
export const Container = (props) => {
    return (
            <View style={{
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
            }}>
                {props.children}
            </View >
      
   
    )
}
/**
 * 
 * @param {*} props 
 */
export const InformationField = (props) => {
    return (
        <View style={styles.boxField}>
           <View style={styles.textLabel}>
              <Text style={styles.textInfo}>{props.value}</Text>
           </View>
           <View style={styles.txt}>
              <Text style={styles.textInfo}>testo</Text>
              <Text style={styles.textInfo}>testo</Text>
            </View>
        </View>
    )
}
/**
 * 
 * @param {*} props 
 */
export const MyButton = (props) => {
    return (
            <TouchableOpacity
                style={styles.Mybutton}
                onPress={() => alert('premuto')}
            >
                <Text style={styles.txtBtn}>{props.value}</Text>
            </TouchableOpacity>
    )
}

/**
 * 
 */
export const Spinner = (props)=> {
    return(
        <View style={[styles2.container, styles2.horizontal]}>
        <ActivityIndicator /* animating={props.hide}*/ size='large' color="#0000ff" />
        </View>
    )
}
/**
 * 
 */
const styles2 = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center'
    },
    horizontal: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10
    }
  })
  
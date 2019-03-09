import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Dimensions from 'Dimensions';
import {StyleSheet, View, Text} from 'react-native';

export default class SignupSection extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>شماره تماس خود را فراموش کرده اید؟</Text>
            </View>
        );
    }
}

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        width: DEVICE_WIDTH,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    text: {
        marginRight: 15,
        color: '#C0C0C0',
        backgroundColor: 'transparent',
        fontFamily: 'byekan'
    },
});

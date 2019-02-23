import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View, Text, Image} from 'react-native';

import logoImg from '../images/logo.png';

export default class Logo extends Component {
    render() {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                <View style={styles.container}>
                    <Image source={logoImg} style={styles.image}/>
                    <Text style={styles.text}>
                        مدیریت زمان
                    </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        borderColor: '#e65808',
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 30
    },
    image: {
        width: 80,
        height: 80,
    },
    text: {
        color: 'white',
        fontFamily: 'byekan',
        backgroundColor: 'transparent',
        marginTop: 20,
    },
});

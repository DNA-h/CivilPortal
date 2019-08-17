import React, {Component} from 'react';
import {StyleSheet, View, ImageBackground, Dimensions} from 'react-native';

import bgSrc from '../images/wallpaper.png';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

export default class Wallpaper extends Component {
    render() {
        return (
            <View style={{height: DEVICE_HEIGHT, width: DEVICE_WIDTH}}>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    picture: {
        flex: 1,
        width: '100%',
        resizeMode: 'cover',
    },
});

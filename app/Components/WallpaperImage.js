import React, {Component} from 'react';
import {StyleSheet, View, ImageBackground, Dimensions} from 'react-native';
import LinearGradient from "react-native-linear-gradient";

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

export default class Wallpaper extends Component {
    render() {
        return (
            <View style={{height: DEVICE_HEIGHT - 20, width: DEVICE_WIDTH}}>
                <LinearGradient
                    style={[styles.picture, this.props.style]}
                    colors={["#425aff", "#7a8fec"]}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}>
                    <ImageBackground
                        style={[styles.picture, this.props.style]}>
                        {this.props.children}
                    </ImageBackground>
                </LinearGradient>
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

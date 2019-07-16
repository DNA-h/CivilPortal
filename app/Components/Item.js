import React from 'react';
import {View, Text, Animated, TouchableWithoutFeedback} from 'react-native';

export default class Item extends React.Component {

    render() {
        return (
            <View style={{flexDirection: 'row', height: 140}}>
                <Animated.View
                    style={{
                        marginHorizontal: 5,
                        width: 35,
                        backgroundColor: '#FFFFFF',
                        borderWidth: 1,
                        borderColor: 'green',
                        borderRadius: 25,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginVertical: 20,
                        padding: 5,
                    }}>
                    <Text
                        style={{
                            color: '#000000',
                            fontSize: 13,
                            fontFamily: 'byekan',
                            textAlign: 'center'
                        }}>
                        {this.props.day}
                    </Text>
                    <Text
                        style={{
                            color: '#000000',
                            fontSize: 15,
                            fontFamily: 'byekan'
                        }}>
                        {this.props.date}
                    </Text>
                    <Text
                        style={{
                            color: '#000000',
                            fontSize: 15,
                            fontFamily: 'byekan'
                        }}>
                        {this.props.month}
                    </Text>
                </Animated.View>
            </View>
        );
    }
}
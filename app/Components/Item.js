import React from 'react';
import {View, Text, Animated, TouchableWithoutFeedback} from 'react-native';

export default class Item extends React.Component {

  render() {
    return (
      <View style={{flexDirection: 'row', height: 120}}>
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
            opacity: this.props.opacity !== undefined ? this.props.opacity : 1
          }}>
          <Text
            style={{
              color:this.props.day ==='جمعه' ? '#ff2c05' : '#000000',
              fontSize: 12,
              fontFamily: 'byekan',
              textAlign: 'center'
            }}>
            {this.props.day}
          </Text>
          <Text
            style={{
              color:this.props.day ==='جمعه' ? '#ff2c05' :  '#000000',
              fontSize: 12,
              fontFamily: 'byekan'
            }}>
            {this.props.date}
          </Text>
          <Text
            style={{
              color:this.props.day ==='جمعه' ? '#ff2c05' :  '#000000',
              fontSize: 10,
              textAlign: 'center',
              fontFamily: 'byekan'
            }}>
            {this.props.month}
          </Text>
        </Animated.View>
      </View>
    );
  }
}
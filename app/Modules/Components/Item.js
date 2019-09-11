import React from 'react';
import {View, Text, Animated, TouchableWithoutFeedback} from 'react-native';
import DBManager from "../../Utils/DBManager";

export default class Item extends React.Component {

  render() {
    return (
      <View style={{flexDirection: 'row', height: 120}}>
        <Animated.View
          style={{
            marginHorizontal: 10,
            width: DBManager.RFValue(36),
            backgroundColor: '#FFFFFF',
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 20,
            padding: 1,
            opacity: this.props.opacity !== undefined ? this.props.opacity : 1
          }}>
          <Text
            style={{
              color:this.props.day ==='جمعه' ? '#ff2c05' : '#000000',
              fontSize: DBManager.RFValue(12),
              fontFamily: 'byekan',
              textAlign: 'center'
            }}>
            {this.props.day}
          </Text>
          <Text
            style={{
              color:this.props.day ==='جمعه' ? '#ff2c05' :  '#000000',
              fontSize: DBManager.RFValue(12),
              fontFamily: 'byekan'
            }}>
            {this.props.date}
          </Text>
          <Text
            style={{
              color:this.props.day ==='جمعه' ? '#ff2c05' :  '#000000',
              fontSize: DBManager.RFValue(10),
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
import React from 'react';
import {View, Text, Animated, TouchableWithoutFeedback} from 'react-native';
import DBManager from "../../Utils/DBManager";

export default class Item extends React.Component {

  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
          height: DBManager.RFHeight(25)
        }}
      >
        <Animated.View
          style={[{
            marginHorizontal: 10,
            width: DBManager.RFWidth(12),
            backgroundColor: '#FFFFFF',
            borderRadius: DBManager.RFWidth(6),
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 20,
            padding: 1,
          },
            this.props.extraStyle
          ]}>
          <Text
            style={{
              color: this.props.day === 'جمعه' || this.props.dayOff ? '#ff2c05' : '#000000',
              fontSize: DBManager.RFValue(16),
              fontFamily: 'byekan',
              textAlign: 'center'
            }}>
            {this.props.day}
          </Text>
          <Text
            style={{
              color: this.props.day === 'جمعه' || this.props.dayOff ? '#ff2c05' : '#000000',
              fontSize: DBManager.RFValue(14),
              fontFamily: 'byekan'
            }}>
            {this.props.date}
          </Text>
          <Text
            style={{
              color: this.props.day === 'جمعه' || this.props.dayOff ? '#ff2c05' : '#000000',
              fontSize: DBManager.RFValue(12),
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
import React from 'react';
import {View, Text, Animated,WebView } from 'react-native';
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
              fontSize: DBManager.RFWidth(20)/4,
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
            {DBManager.toArabicNumbers(this.props.date)}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              color: this.props.day === 'جمعه' || this.props.dayOff ? '#ff2c05' : '#000000',
              fontSize: DBManager.RFWidth(20)/this.props.month.length,
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
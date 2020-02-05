import React from 'react';
import {View, Text, Animated, TouchableWithoutFeedback} from 'react-native';
import DBManager from "../../Utils/DBManager";
import FitBounds from "@mapbox/react-native-mapbox-gl/example/src/components/FitBounds";

export default class Item extends React.Component {

  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
          height: 180
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
              color: this.props.day === 'جمعه' ? '#ff2c05' : '#000000',
              fontSize: DBManager.RFValue(16),
              fontFamily: 'IRANSansMobile',
              textAlign: 'center'
            }}>
            {this.props.day}
          </Text>
          <Text
            style={{
              color: this.props.day === 'جمعه' ? '#ff2c05' : '#000000',
              fontSize: DBManager.RFValue(16),
              fontFamily: 'IRANSansMobile_Bold'
            }}>
            {DBManager.toArabicNumbers(this.props.date)}
          </Text>
          <Text
            style={{
              color: this.props.day === 'جمعه' ? '#ff2c05' : '#000000',
              fontSize: DBManager.RFValue(12),
              textAlign: 'center',
              fontFamily: 'IRANSansMobile'
            }}>
            {this.props.month}
          </Text>
        </Animated.View>
      </View>
    );
  }
}
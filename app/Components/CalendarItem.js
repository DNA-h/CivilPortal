import React, {Component} from "react";
import {Text, View, Image, TouchableWithoutFeedback} from 'react-native';
import {connect} from 'react-redux';
import {counterAdd, counterSub} from "../Actions";

class CalendarItem extends Component {

  _renderLeft() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: 10,
          paddingStart: 10,
          paddingEnd: 10,
          paddingTop: 5,
          paddingBottom: 5,
          marginStart: 5,
          marginEnd: 5,
          marginTop: 10,
          marginBottom: 10
        }}>
        <TouchableWithoutFeedback
          onPress={() => this.props.callback(this.props.item.item.id)}>
          <View
            style={{
              flex: 5,
              flexDirection: 'row',
              backgroundColor: '#6A6A6A55',
              borderTopLeftRadius: 20,
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              alignItems: 'center'
            }}>
            <Image
              style={{
                width: 40,
                height: 40,
                margin: 10,
                borderWidth: 2,
                borderColor: '#00b',
                borderRadius: 40,
              }}
              source={require('../images/ic_profile.png')}/>
            <View style={{flex: 1}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={{flex: 1, fontFamily: 'byekan'}}>
                  {this.props.item.item.title}
                </Text>
                <Image style={{width: 12, height: 12, margin: 5}} tintColor={'#6f67d9'}
                       source={require('../images/ic_title.png')}/>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={{flex: 1, fontFamily: 'byekan'}}>
                  ساعت {this.props.item.item.start.substring(11, 16)} تا {this.props.item.item.end.substring(11, 16)}
                </Text>
                <Image style={{width: 12, height: 12, margin: 5}} tintColor={'#6f67d9'}
                       source={require('../images/ic_clock.png')}/>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={{flex: 1, fontFamily: 'byekan'}}>
                  مکان: ساختمان اصلی
                </Text>
                <Image style={{width: 12, height: 12, margin: 5, resizeMode: 'contain'}}
                       tintColor={'#6f67d9'}
                       source={require('../images/ic_location.png')}/>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={this.props.share}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#6A6A6A55',
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              borderTopRightRadius: 20,
              marginHorizontal: 3,
              alignItems: 'center',
              paddingVertical: 8
            }}>
            <Image style={{width: 12, height: 12, margin: 5}} tintColor={'#000000'}
                   source={require('../images/basket.png')}/>
            <Image style={{width: 12, height: 12, margin: 5}} tintColor={'#000000'}
                   source={require('../images/ic_brief.png')}/>
            <Image style={{width: 12, height: 12, margin: 5}} tintColor={'#000000'}
                   source={require('../images/ic_share.png')}/>
          </View>
        </TouchableWithoutFeedback>
        <View style={{flex: 1}}/>
      </View>
    );
  }

  _renderRight() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: 10,
          paddingStart: 10,
          paddingEnd: 10,
          paddingTop: 5,
          paddingBottom: 5,
          marginStart: 5,
          marginEnd: 5,
          marginTop: 10,
          marginBottom: 10
        }}>
        <View style={{flex: 1}}/>
        <TouchableWithoutFeedback
          onPress={this.props.share}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#6A6A6A55',
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              borderTopLeftRadius: 20,
              marginHorizontal: 3,
              alignItems: 'center',
              paddingVertical: 8
            }}>
            <Image style={{width: 12, height: 12, margin: 5}} tintColor={'#000000'}
                   source={require('../images/basket.png')}/>
            <Image style={{width: 12, height: 12, margin: 5}} tintColor={'#000000'}
                   source={require('../images/ic_brief.png')}/>
            <Image style={{width: 12, height: 12, margin: 5}} tintColor={'#000000'}
                   source={require('../images/ic_share.png')}/>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => this.props.callback(this.props.item.item.id)}>
          <View
            style={{
              flex: 5,
              flexDirection: 'row',
              backgroundColor: '#6A6A6A55',
              borderTopRightRadius: 20,
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              alignItems: 'center'
            }}>
            <View style={{flex: 1}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={{flex: 1, fontFamily: 'byekan'}}>
                  {this.props.item.item.title}
                </Text>
                <Image style={{width: 12, height: 12, margin: 5}} tintColor={'#6f67d9'}
                       source={require('../images/ic_title.png')}/>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={{flex: 1, fontFamily: 'byekan'}}>
                  ساعت {this.props.item.item.start.substring(11, 16)} تا {this.props.item.item.end.substring(11, 16)}
                </Text>
                <Image style={{width: 12, height: 12, margin: 5}} tintColor={'#6f67d9'}
                       source={require('../images/ic_clock.png')}/>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={{flex: 1, fontFamily: 'byekan'}}>
                  مکان: ساختمان اصلی
                </Text>
                <Image
                  style={{width: 12, height: 12, margin: 5, resizeMode: 'contain'}}
                  tintColor={'#6f67d9'}
                  source={require('../images/ic_location.png')}/>
              </View>
            </View>
            <Image
              style={{
                width: 40,
                height: 40,
                margin: 10,
                borderWidth: 2,
                borderColor: '#00b',
                borderRadius: 40,
              }}
              source={require('../images/ic_profile.png')}/>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  render() {
    let left = this.props.item.item.left ? this._renderLeft() : this._renderRight();
    return (
      <View
        style={{flexDirection: 'row'}}>
        {left}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    counter: state
  }
}

export default connect(mapStateToProps, {counterAdd, counterSub})(CalendarItem);

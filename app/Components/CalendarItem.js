import React, {Component} from "react";
import {Text, View, Image, TouchableWithoutFeedback, ImageBackground, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import {counterAdd, counterSub} from "../Actions";

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

class CalendarItem extends Component {

  _renderLeft() {
    return (
      <View
        style={{
          flex: 1,
          height: DEVICE_WIDTH / 3.6,
          flexDirection: 'row',
          alignItems: 'center',
          paddingStart: 10,
          paddingEnd: 10,
          marginStart: 5,
          marginEnd: 5,
          marginTop: 10,
          marginBottom: 10
        }}>
        <TouchableWithoutFeedback
          onPress={() => this.props.callback(this.props.item.item.id)}>
          <ImageBackground
            source={require("../images/background_shape_left.png")}
            resizeMode={'contain'}
            tintColor='#6A6A6A55'
            style={{
              flex: 5,
              height: DEVICE_WIDTH / 2.1,
              flexDirection: 'row',
              alignItems: 'center',
              paddingBottom: 15,
              paddingEnd: 20,
              justifyContent: 'center',
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
              source={{uri: this.props.item.item.image}}/>
            <TouchableWithoutFeedback
              onPress={() => this.props.callback(this.props.item.item.id)}>
              <View style={{flex: 1}}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{flex: 1, fontFamily: 'byekan', textAlign: 'right'}}>
                    {this.props.item.item.meeting_title}
                  </Text>
                  <Image style={{width: 12, height: 12, margin: 5}} tintColor={'#6f67d9'}
                         source={require('../images/ic_title.png')}/>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{flex: 1, fontFamily: 'byekan'}}>
                    ساعت {this.props.item.item.start_time.substring(11, 16)} تا {this.props.item.item.end_time.substring(11, 16)}
                  </Text>
                  <Image style={{width: 12, height: 12, margin: 5}} tintColor={'#6f67d9'}
                         source={require('../images/ic_clock.png')}/>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{flex: 1, fontFamily: 'byekan'}}>
                    مکان: {this.props.item.item.place_address}
                  </Text>
                  <Image style={{width: 12, height: 12, margin: 5, resizeMode: 'contain'}}
                         tintColor={'#6f67d9'}
                         source={require('../images/ic_location.png')}/>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </ImageBackground>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={this.props.share}>
          <View
            style={{
              flex: 1,
              height: DEVICE_WIDTH / 4.5,
              backgroundColor: '#6A6A6A55',
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              borderTopRightRadius: 20,
              marginHorizontal: 3,
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'flex-start',
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
          height: DEVICE_WIDTH / 3.6,
          flexDirection: 'row',
          borderRadius: 10,
          paddingStart: 10,
          paddingEnd: 10,
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
              height: DEVICE_WIDTH / 4.5,
              backgroundColor: '#6f67d9DD',
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              borderTopLeftRadius: 20,
              marginHorizontal: 3,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 8
            }}>
            <Image style={{width: 12, height: 12, margin: 5}} tintColor={'#FFF'}
                   source={require('../images/basket.png')}/>
            <Image style={{width: 12, height: 12, margin: 5}} tintColor={'#FFF'}
                   source={require('../images/ic_brief.png')}/>
            <Image style={{width: 12, height: 12, margin: 5}} tintColor={'#FFF'}
                   source={require('../images/ic_share.png')}/>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => this.props.callback(this.props.item.item.id)}>
          <ImageBackground
            source={require("../images/background_shape.png")}
            resizeMode={'contain'}
            tintColor='#6f67d9'
            style={{
              flex: 5,
              height: DEVICE_WIDTH / 3.6,
              flexDirection: 'row',
              alignItems: 'center',
              paddingBottom: 15,
              justifyContent: 'center',
            }}>
            <TouchableWithoutFeedback
              onPress={() => this.props.callback(this.props.item.item.id)}>
              <View style={{flex: 1}}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{flex: 1, color: '#FFF', fontFamily: 'byekan', textAlign: 'right'}}>
                    {this.props.item.item.meeting_title}
                  </Text>
                  <Image style={{width: 12, height: 12, margin: 5}} tintColor={'#FFF'}
                         source={require('../images/ic_title.png')}/>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{flex: 1, color: '#FFF', fontFamily: 'byekan'}}>
                    ساعت {this.props.item.item.start_time.substring(11, 16)} تا {this.props.item.item.end_time.substring(11, 16)}
                  </Text>
                  <Image style={{width: 12, height: 12, margin: 5}} tintColor={'#FFF'}
                         source={require('../images/ic_clock.png')}/>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{flex: 1, color: '#FFF', fontFamily: 'byekan'}}>
                    مکان: {this.props.item.item.place_address}
                  </Text>
                  <Image
                    style={{width: 12, height: 12, margin: 5, resizeMode: 'contain'}}
                    tintColor={'#FFF'}
                    source={require('../images/ic_location.png')}/>
                </View>
              </View>
            </TouchableWithoutFeedback>
            <Image
              style={{
                width: 40,
                height: 40,
                margin: 10,
                borderWidth: 2,
                borderColor: '#00b',
                borderRadius: 40,
              }}
              source={{uri: this.props.item.item.image}}/>
          </ImageBackground>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  render() {
    let left = !this.props.item.item.owner ? this._renderLeft() : this._renderRight();
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

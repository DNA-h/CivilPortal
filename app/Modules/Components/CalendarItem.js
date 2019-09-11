import React, {Component} from "react";
import {
  Text, View, Image, TouchableWithoutFeedback,
  ImageBackground, Dimensions, StyleSheet
} from 'react-native';
import {connect} from 'react-redux';
import {counterAdd, counterSub} from "../../actions";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import DBManager from "../../Utils/DBManager";
import Globals from "../../Utils/Globals";

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

class CalendarItem extends Component {

  _renderLeft() {
    return (
      <View
        style={styles.parent}>
        <TouchableWithoutFeedback
          onPress={() => this.props.callback(this.props.item.item.id)}>
          <ImageBackground
            source={require("../../images/background_shape_left.png")}
            resizeMode={'contain'}
            style={styles.cardLeft}>
            <Image
              style={styles.profile}
              source={{uri: this.props.item.item.image}}/>
            <TouchableWithoutFeedback
              onPress={() => this.props.callback(this.props.item.item.id)}>
              <View style={{flex: 1}}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.textLeft}>
                    {this.props.item.item.meeting_title}
                  </Text>
                  <Image
                    style={styles.imageLeft}
                    source={require('../../images/ic_title.png')}/>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.textLeft}>
                    ساعت {this.props.item.item.start_time.substring(11, 16)} تا {this.props.item.item.end_time.substring(11, 16)}
                  </Text>
                  <Image
                    style={styles.imageLeft}
                    source={require('../../images/ic_clock.png')}/>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.textLeft}>
                    مکان: {this.props.item.item.place_address}
                  </Text>
                  <Image
                    style={styles.imageLeft}
                    source={require('../../images/ic_location.png')}/>
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
                   source={require('../../images/basket.png')}/>
            <Image style={{width: 12, height: 12, margin: 5}} tintColor={'#000000'}
                   source={require('../../images/ic_brief.png')}/>
            <Image style={{width: 12, height: 12, margin: 5}} tintColor={'#000000'}
                   source={require('../../images/ic_share.png')}/>
          </View>
        </TouchableWithoutFeedback>
        <View style={{flex: 1}}/>
      </View>
    );
  }

  _renderRight() {
    return (
      <View style={styles.parent}>
        <View style={{flex: 1}}/>
        <TouchableWithoutFeedback
          onPress={this.props.share}>
          <View
            style={styles.smallCard}>
            <Image
              style={styles.image}
              source={require('../../images/basket.png')}
            />
            <Image
              style={styles.image}
              source={require('../../images/ic_brief.png')}/>
            <Image
              style={styles.image}
              source={require('../../images/ic_share.png')}/>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => this.props.callback(this.props.item.item.id)}>
          <ImageBackground
            tintColor={Globals.PRIMARY_BLUE}
            source={require("../../images/background_shape.png")}
            resizeMode={'contain'}
            style={styles.card}>
            <TouchableWithoutFeedback
              onPress={() => this.props.callback(this.props.item.item.id)}>
              <View style={{flex: 1}}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.text}>
                    {this.props.item.item.meeting_title}
                  </Text>
                  <Image
                    style={styles.image}
                    source={require('../../images/ic_title.png')}
                  />
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.text}>
                    ساعت {this.props.item.item.start_time.substring(11, 16)} تا {this.props.item.item.end_time.substring(11, 16)}
                  </Text>
                  <Image
                    style={styles.image}
                    source={require('../../images/ic_clock.png')}/>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.text}>
                    مکان: {this.props.item.item.place_address}
                  </Text>
                  <Image
                    style={styles.image}
                    source={require('../../images/ic_location.png')}/>
                </View>
              </View>
            </TouchableWithoutFeedback>
            <Image
              style={styles.profile}
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

const styles = StyleSheet.create({
  text: {
    flex: 1,
    color: Globals.PRIMARY_WHITE,
    fontSize: DBManager.RFValue(14),
    fontFamily: 'byekan',
    textAlign: 'right'
  },
  textLeft: {
    flex: 1,
    fontSize: DBManager.RFValue(14),
    fontFamily: 'byekan',
    textAlign: 'right'
  },
  image: {
    width: wp(4),
    height: wp(4),
    margin: 5,
    resizeMode: 'contain',
    tintColor: Globals.PRIMARY_WHITE
  },
  imageLeft: {
    width: wp(4),
    height: wp(4),
    margin: 5,
    resizeMode: 'contain',
    tintColor: Globals.PRIMARY_BLUE
  },
  profile: {
    width: wp(11),
    height: wp(11),
    margin: 10,
    borderWidth: 2,
    borderColor: Globals.PRIMARY_BLUE,
    borderRadius: 40,
  },
  card: {
    flex: 5,
    height: hp(15),
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 15,
    justifyContent: 'center',
  },
  cardLeft: {
    flex: 5,
    height: hp(15),
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 15,
    justifyContent: 'center',
    paddingRight:20,
    paddingLeft:5,
  },
  smallCard: {
    flex: 1,
    height: hp(12),
    backgroundColor: Globals.PRIMARY_BLUE,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
    marginHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8
  },
  parent: {
    flex: 1,
    height: hp(15),
    flexDirection: 'row',
    marginStart: 5,
    marginEnd: 5,
    marginTop: 10,
    marginBottom: 10
  }
});

function mapStateToProps(state) {
  return {
    counter: state
  }
}

export default connect(mapStateToProps, {counterAdd, counterSub})(CalendarItem);

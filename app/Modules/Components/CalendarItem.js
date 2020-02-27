import React, {Component} from "react";
import {
  Text, View, Image, TouchableWithoutFeedback, TouchableOpacity,
  ImageBackground, Dimensions, StyleSheet
} from 'react-native';
import {connect} from 'react-redux';
import {counterAdd, counterSub} from "../../actions";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import DBManager from "../../Utils/DBManager";
import Globals from "../../Utils/Globals";
import {RequestsController} from "../../Utils/RequestController";
import MainPage from "../MainPage";

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

class CalendarItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewCount: undefined,
      replaced: false,
      loading: true
    };
    this.result = undefined;
    this.me = undefined;
  }

  async componentDidMount(): void {
    let count = 0;
    let flag = false;
    this.me = await RequestsController.loadMyself();
    await RequestsController.seenSession(this.props.item.item.id);
    this.result = await RequestsController.specificSession(this.props.item.item.id);
    for (let index = 0; index < this.result[0].people.length; index++) {
      if (this.result[0].people[index].rep_first_name === null) {
        if (this.result[0].people[index].seen)
          count++;
      } else {
        if (this.result[0].people[index].rep_seen)
          count++;
      }
      if ((this.result[0].people[index].first_name === this.me.first_name &&
        this.result[0].people[index].last_name === this.me.last_name &&
        this.result[0].people[index].rep_first_name !== null) ||
        (this.result[0].people[index].rep_first_name === this.me.first_name &&
          this.result[0].people[index].rep_last_name === this.me.last_name &&
          this.result[0].people[index].rep_first_name !== null)
      ) {
        flag = true;
      }
    }
    this.setState({viewCount: count, replaced: flag, loading: false})
  }

  _renderLeft() {
    return (
      <View
        style={{
          height: hp(18),
          width: '100%',
          alignSelf: 'center',
          paddingHorizontal: 5,
          marginVertical: 5,
          flexDirection: 'column',
        }}
      >
        <View
          style={styles.parent}>
          <TouchableWithoutFeedback
            onPress={() => this.props.callback(this.props.item.item.id)}>
            <View
              style={[styles.cardLeft,
                {backgroundColor: !this.state.replaced ? '#bbbbbb' : Globals.PRIMARY_SHARED}]}
            >
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
                      {'ساعت '}
                      {DBManager.toArabicNumbers(this.props.item.item.start_time.substring(11, 16))}
                      {' تا '}
                      {DBManager.toArabicNumbers(this.props.item.item.end_time.substring(11, 16))}
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
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            disabled={this.props.item.item.replace}
            onPress={this.props.share}>
            <View
              style={{
                flex: 1,
                height: hp(15),
                backgroundColor: !this.state.replaced ? '#bbbbbb' : Globals.PRIMARY_SHARED,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                borderTopRightRadius: 20,
                marginHorizontal: 3,
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'flex-start',
                paddingVertical: 8
              }}>
              <Image
                style={{
                  width: 12,
                  height: 12,
                  margin: 5
                }}
                tintColor={this.props.item.item.replace ? '#dedede' : '#000000'}
                source={require('../../images/ic_share.png')}/>
            </View>
          </TouchableWithoutFeedback>
          <View style={{flex: 1}}/>
        </View>
        <View
          style={{flexDirection: 'row', paddingLeft:15}}
        >
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: hp(6),
              width: hp(6),
              alignSelf: 'flex-start',
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                height: hp(6),
                width: hp(6),
                backgroundColor: !this.state.replaced ? '#bbbbbb' : Globals.PRIMARY_SHARED,
                overflow: 'hidden',
                transform: [{rotate: '-45deg'}, {translateY: -hp(4)}]
              }}
            />
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              marginTop: -10
            }}
          >
            <Image
              source={require("../../images/ic_visibility.png")}
              style={{height: 15, width: 15}}
            />
            <Text
              style={{
                fontFamily: 'byekan',
                color: '#000',
                marginLeft: 5,
                fontSize: 15,
              }}
            >
              {
                this.state.viewCount !== undefined &&
                `${DBManager.toArabicNumbers(this.state.viewCount)} `
              }
            </Text>
          </View>
          <View
            style={{
              flex: 2,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {this.state.replaced &&
            <Text style={[
              styles.text, {color: '#000', fontSize:12}
            ]}>
              اشتراک گذاشته شد
            </Text>
            }
          </View>
          <View
            style={{
              flex: 2,
              flexDirection: 'row',
              justifyContent: 'flex-end'
            }}
          >
            <Text
              style={{
                fontFamily: 'byekan',
                color: '#000',
                marginLeft: 5,
                fontSize: 12,
              }}
            >
              {
                `${DBManager.toArabicNumbers(this.props.item.item.created_time.substr(5, 5).replace(/-/, '/'))} `
              }
            </Text>
            <Text
              style={{
                fontFamily: 'byekan',
                color: '#000',
                marginLeft: 5,
                fontSize: 12,
              }}
            >
              {
                `${DBManager.toArabicNumbers(this.props.item.item.created_time.substr(11, 8).replace(/-/, '/'))} `
              }
            </Text>
          </View>
          <View style={{flex: 1}}/>
        </View>
      </View>
    );
  }

  _renderRight() {
    return (
      <View
        style={{
          height: hp(18),
          width: '100%',
          alignSelf: 'center',
          paddingHorizontal: 5,
          marginVertical: 5,
          flexDirection: 'column',
        }}
      >
        <View style={styles.parent}>
          <View style={{flex: 1}}/>
          <View
            style={[styles.smallCard,
              {backgroundColor: !this.state.replaced ? Globals.PRIMARY_BLUE : Globals.PRIMARY_SHARED}]}>
            <TouchableOpacity
              style={{paddingHorizontal: 5}}
              onPress={this.props.share}>
              <Image
                style={styles.image}
                source={require('../../images/ic_share.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{paddingHorizontal: 5}}
              onPress={() => this.props.delete(this.props.item.item.id)}>
              <Image
                style={styles.image}
                source={require('../../images/basket.png')}
              />
            </TouchableOpacity>
          </View>
          <TouchableWithoutFeedback
            onPress={() => this.props.callback(this.props.item.item.id)}>
            <View
              style={[styles.card, {backgroundColor: !this.state.replaced ? Globals.PRIMARY_BLUE : Globals.PRIMARY_SHARED}]}>
              <TouchableWithoutFeedback
                onPress={() => this.props.callback(this.props.item.item.id)}>
                <View style={{flex: 1}}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={[styles.text, {flex: 1}]}>
                      {this.props.item.item.meeting_title}
                    </Text>
                    <Image
                      style={styles.image}
                      source={require('../../images/ic_title.png')}
                    />
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={[styles.text, {flex: 1}]}>
                      {'ساعت '}
                      {DBManager.toArabicNumbers(this.props.item.item.start_time.substring(11, 16))}
                      {' تا '}
                      {DBManager.toArabicNumbers(this.props.item.item.end_time.substring(11, 16))}
                    </Text>
                    <Image
                      style={styles.image}
                      source={require('../../images/ic_clock.png')}/>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={[styles.text, {flex: 1}]}>
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
            </View>
          </TouchableWithoutFeedback>

        </View>
        <View
          style={{flexDirection: 'row', paddingEnd: 15}}
        >
          <View style={{flex: 1}}/>
          <View
            style={{
              flex: 2,
              justifyContent: 'flex-start',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <Text
              style={{
                fontFamily: 'byekan',
                color: '#000',
                marginLeft: 5,
                fontSize: 12,
              }}
            >
              {
                `${DBManager.toArabicNumbers(this.props.item.item.created_time.substr(5, 5).replace(/-/, '/'))} `
              }
            </Text>
            <Text
              style={{
                fontFamily: 'byekan',
                color: '#000',
                marginLeft: 5,
                fontSize: 12,
              }}
            >
              {
                `${DBManager.toArabicNumbers(this.props.item.item.created_time.substr(11, 8).replace(/-/, '/'))} `
              }
            </Text>
          </View>
          <View
            style={{
              flex: 2,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {this.state.replaced &&
            <Text style={[
              styles.text, {color: '#000', fontSize:12}
            ]}>
              اشتراک گذاشته شد
            </Text>
            }
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <Image
              source={require("../../images/ic_visibility.png")}
              style={{height: 15, width: 15}}
            />
            <Text
              style={{
                fontFamily: 'byekan',
                color: '#000',
                marginLeft: 5,
                fontSize: 15,
              }}
            >
              {
                this.state.viewCount !== undefined &&
                `${DBManager.toArabicNumbers(this.state.viewCount)} `
              }
            </Text>
          </View>

          <View
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              height: hp(6),
              width: hp(6),
              alignSelf: 'flex-end',
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                height: hp(6),
                width: hp(6),
                backgroundColor: !this.state.replaced ? Globals.PRIMARY_BLUE : Globals.PRIMARY_SHARED,
                overflow: 'hidden',
                transform: [{rotate: '45deg'}, {translateY: -hp(4)}]
              }}
            />
          </View>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View
        style={{flexDirection: 'row'}}>
        {this.state.loading ? null :
          !this.props.item.item.owner ? this._renderLeft() : this._renderRight()
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    color: Globals.PRIMARY_WHITE,
    fontSize: DBManager.RFWidth(4),
    fontFamily: 'byekan',
    textAlign: 'right'
  },
  textLeft: {
    flex: 1,
    fontSize: DBManager.RFWidth(4),
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
    backgroundColor: Globals.PRIMARY_BLUE,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 25,
    height: hp(15),
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    justifyContent: 'center',
    overflow: 'hidden'
  },
  cardLeft: {
    flex: 5,
    height: hp(15),
    backgroundColor: '#bbbbbb',
    borderTopLeftRadius: 25,
    borderBottomRightRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 20,
    paddingLeft: 5,
  },
  smallCard: {
    flex: 1,
    height: hp(15),
    backgroundColor: Globals.PRIMARY_BLUE,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
    marginHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8
  },
  parent: {
    flex: 1,
    width: '100%',
    height: hp(15),
    flexDirection: 'row',
  }
});

function mapStateToProps(state) {
  return {
    counter: state
  }
}

export default connect(mapStateToProps, {counterAdd, counterSub})(CalendarItem);

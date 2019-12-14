import React, {Component} from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableWithoutFeedback,
  Text,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Dimensions,
  TextInput,
  ToastAndroid
} from 'react-native';
import {connect} from "react-redux";
import {counterAdd, counterSub} from "../actions";
import NavigationService from "../service/NavigationService";
import Item from "./Components/Item";
import {RequestsController} from "../Utils/RequestController";
import Carousel, {getInputRangeFromIndexes} from 'react-native-snap-carousel';
import Modal from "react-native-modal";
import DBManager from "../Utils/DBManager";
import Autocomplete from 'react-native-autocomplete-input';

let dailyHour = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
let dailyMinutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '55', '50', '55'];
let monthsDays = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
let months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
let days = [`یک${'\n'}شنبه`, `دو${'\n'}شنبه`, `سه${'\n'}شنبه`, `چهار${'\n'}شنبه`, `پنج${'\n'}شنبه`, `جمعه`, `شنبه`];
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

class AddNewSession extends Component {

  constructor(props) {
    super(props);
    let date = new Date();
    this._startHour = date.getHours();
    this._startMinute = (date.getMinutes() - date.getMinutes() % 5) / 5;
    this._endHour = date.getHours() === 23 ? 0 : date.getHours() + 1;
    this._endMinute = (date.getMinutes() - date.getMinutes() % 5) / 5;
    let jalaali = require('jalaali-js');
    let jalali = jalaali.toJalaali(date);
    let month = jalali.jm - 1;
    let day = jalali.jd - 1;
    this.data = [];
    this.extras = [];
    for (let i = 0; i < 31; i++) {
      let jalali2 = jalaali.toJalaali(date);
      let month2 = jalali2.jm - 1;
      let day2 = jalali2.jd;
      let d = date.getDay();
      this.data.push({
        index: i, date: day2, month: months[month2], day: days[d]
      });
      date.setDate(date.getDate() + 1);
    }
    date = new Date();
    for (let i = 0; i < 3; i++) {
      date.setDate(date.getDate() - 1);
      let jalali2 = jalaali.toJalaali(date);
      let month2 = jalali2.jm - 1;
      let day2 = jalali2.jd;
      let d = date.getDay();
      this.extras.push({
        index: i, date: day2, month: months[month2], day: days[d]
      });
    }
    date.setDate(date.getDate() + 33);
    for (let i = 0; i < 3; i++) {
      date.setDate(date.getDate() + 1);
      let jalali2 = jalaali.toJalaali(date);
      let month2 = jalali2.jm - 1;
      let day2 = jalali2.jd;
      let d = date.getDay();
      this.extras.push({
        index: i, date: day2, month: months[month2], day: days[d]
      });
    }
    this.state = {
      selectedDay: day,
      selectedMonth: month,
      currentItem: 0,
      currentPercent: 0.1,
      startHour: date.getHours(),
      startMinute: date.getMinutes() - (date.getMinutes() % 5),
      endHour: 0,
      endMinute: date.getMinutes() - (date.getMinutes() % 5),
      currentPlace: -1,
      currentPlaceTitle: '',
      places: [],
      selectPlace: false,
      createNewVisible: false,
      loading: true,
      title: '',
      titleY: -100,
      titles: [],
      focusTitle: false,
      address: '',
      addressY: -100,
      addresses: [],
      focusAddress: false
    };
    this._loadPlaces = this._loadPlaces.bind(this);
    this.saveValue = this.saveValue.bind(this);
    this.saveAddress = this.saveAddress.bind(this);
    this._compareTitle = this._compareTitle.bind(this);
    this._compareAddress = this._compareAddress.bind(this);
  }

  async componentDidMount() {
    // this._loadPlaces();
    const titles = [];
    const addresses = [];
    const countTitle = parseInt(await DBManager.getSettingValue('titleCount', '0'), 10);
    const countAddress = parseInt(await DBManager.getSettingValue('addressCount', '0'), 10);
    for (let index = 0; index < countTitle; index += 1) {
      const item = await DBManager.getSettingValue(`title${index}`, '');
      titles.push(item);
    }
    for (let index = 0; index < countAddress; index += 1) {
      const item = await DBManager.getSettingValue(`address${index}`, '');
      addresses.push(item);
    }
    this.setState({
      titles: titles,
      addresses: addresses
    });
  }

  async saveValue() {
    if (!this.state.titles.some(e => e === this.state.title)) {
      const count = parseInt(await DBManager.getSettingValue('titleCount', '0'), 10);
      await DBManager.saveSettingValue(`title${count}`, this.state.title);
      await DBManager.saveSettingValue(`titleCount`, count + 1);
      this.state.titles.push(this.state.title);
      this.setState({titles: this.state.titles});
      ToastAndroid.show('موضوع با موفقیت ذخیره شد !', ToastAndroid.SHORT);
    }
  }

  async saveAddress() {
    if (!this.state.addresses.some(e => e === this.state.address)) {
      const count = parseInt(await DBManager.getSettingValue('addressCount', '0'), 10);
      await DBManager.saveSettingValue(`address${count}`, this.state.address);
      await DBManager.saveSettingValue(`addressCount`, count + 1);
      this.state.addresses.push(this.state.address);
      this.setState({addresses: this.state.addresses});
      ToastAndroid.show('آدرس با موفقیت ذخیره شد !', ToastAndroid.SHORT);
    }
  }

  _compareTitle(a) {
    // return this.state.query === '';
    return a.includes(this.state.title);
  }

  _compareAddress(a) {
    // return this.state.query === '';
    return a.includes(this.state.address);
  }

  async _loadPlaces() {
    let result = await RequestsController.MyPlaces();
    this.state.places = [];
    for (let index in result) {
      let item = {
        pk: result[index].pk,
        title: result[index].fields.place_title,
      };
      this.state.places.push(item);
    }
    this.setState({places: this.state.places});
  }

  _scrollInterpolator(index, carouselProps) {
    const range = [3, 2, 1, 0, -1, -2, -3];
    const inputRange = getInputRangeFromIndexes(range, index, carouselProps);
    const outputRange = range;

    return {inputRange, outputRange};
  }

  renderCarousel(data, first, saveFunc) {
    return (
      <Carousel
        data={data}
        itemWidth={30}
        itemHeight={30}
        sliderWidth={30}
        sliderHeight={90}
        enableMomentum
        initialNumToRender={data.length}
        firstItem={first}
        keyExtractor={(item, index) => 'endHour-' + index}
        layout={'default'}
        vertical
        onBeforeSnapToItem={(index) => {
          saveFunc(index);
        }}
        containerCustomStyle={{
          height: 30,
          width: 30,
          flexGrow: 0,
          borderRadius: 15
        }}
        renderItem={({item, index}) =>
          <View
            style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'byekan',
                borderRadius: 12,
                color: '#FFFFFF',
                textAlign: 'center'
              }}>
              {item}
            </Text>
          </View>
        }
      />
    )
  }

  renderPreCarousel(value) {
    return (
      <View
        style={{
          position: 'absolute',
          height: 30,
          width: 30,
          left: 0,
          bottom: 0,
          borderRadius: 15,
          backgroundColor: 'white',
          justifyContent: 'center'
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontFamily: 'byekan',
            textAlign: 'center'
          }}>
          {value}
        </Text>
      </View>
    );
  }

  render() {
    return (
      <KeyboardAvoidingView
        style={{flex: 1}}
        contentContainerStyle={{height: DEVICE_HEIGHT,}}
        behavior='position'
      >
        <ImageBackground
          source={require('../images/menu.png')}
          style={{flex: 1, width: DEVICE_WIDTH, height: DEVICE_HEIGHT,}}
        >
          <TouchableWithoutFeedback
            onPress={NavigationService.goBack}
          >
            <Image
              style={{
                width: 25,
                height: 25,
                marginTop: 10,
                marginRight: 10
              }}
              tintColor={'#FFFFFF'}
              source={require('../images/ic_back.png')}
            />
          </TouchableWithoutFeedback>
          <View>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Image
                source={require('../images/top_curve_border.png')}
                style={{
                  position: 'absolute',
                  left: 20,
                  right: 20,
                  top: 8,
                  width: DEVICE_WIDTH - 40,
                  height: (DEVICE_WIDTH - 40) / 16,
                  resizeMode: 'contain'
                }}
              />
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'byekan',
                  backgroundColor: 'white',
                  borderRadius: 12,
                  paddingHorizontal: 15,
                  textAlign: 'center'
                }}>
                تعیین روز
              </Text>
            </View>
            <View
              style={{
                height: 140,
                marginHorizontal: 10,
                flexDirection: 'row',
                alignItems: 'center'
              }}>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.mainC.snapToPrev();
                }}>
                <Image
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: '#FFFFFF',
                    zIndex: 10
                  }}
                  source={require("../images/ic_back.png")}/>
              </TouchableWithoutFeedback>
              <Carousel
                data={this.data}
                itemWidth={DBManager.RFWidth(15)}
                itemHeight={140}
                sliderWidth={DEVICE_WIDTH-50}
                sliderHeight={140}
                enableMomentum
                useScrollView={false}
                activeSlideAlignment={"start"}
                contentContainerCustomStyle={{paddingLeft: 0, paddingVertical: 0}}
                containerCustomStyle={{paddingLeft: 0, paddingVertical: 0}}
                onSnapToItem={(item) => {
                  console.log('item ', item);
                  let date = new Date();
                  date.setDate(date.getDate() + item);
                  let jalaali = require('jalaali-js');
                  let jalali = jalaali.toJalaali(date);
                  this.state.selectedMonth = jalali.jm - 1;
                  this.state.selectedDay = jalali.jd - 1;
                }}
                ListHeaderComponent={
                  <View
                    style={{
                      flexDirection: 'row',
                      width: DEVICE_WIDTH / 2 - 60,
                      justifyContent: 'space-around',
                    }}>
                    <Item
                      date={this.extras[2].date}
                      month={this.extras[2].month}
                      day={this.extras[2].day}
                      extraStyle={{
                        opacity: 0.1,
                        transform: [{scale: 0.6}]
                      }}
                    />
                    <Item
                      date={this.extras[1].date}
                      month={this.extras[1].month}
                      day={this.extras[1].day}
                      extraStyle={{
                        opacity: 0.5,
                        transform: [{scale: 0.75}]
                      }}
                    />
                    <Item
                      date={this.extras[0].date}
                      month={this.extras[0].month}
                      day={this.extras[0].day}
                      extraStyle={{
                        opacity: 0.8,
                        transform: [{scale: 0.9}]
                      }}
                    />
                  </View>}
                ListFooterComponent={
                  <View
                    style={{
                      flexDirection: 'row',
                      width: DEVICE_WIDTH / 2 - 60,
                      justifyContent: 'space-around',
                    }}>
                    <Item
                      date={this.extras[3].date}
                      month={this.extras[3].month}
                      day={this.extras[3].day}
                      extraStyle={{
                        opacity: 0.8
                      }}
                    />
                    <Item
                      date={this.extras[4].date}
                      month={this.extras[4].month}
                      day={this.extras[4].day}
                      extraStyle={{
                        opacity: 0.5
                      }}
                    />
                    <Item
                      date={this.extras[5].date}
                      month={this.extras[5].month}
                      day={this.extras[5].day}
                      extraStyle={{
                        opacity: 0.1
                      }}
                    />
                  </View>}
                layout={'default'}
                ref={(c) => {
                  this.mainC = c;
                }}
                scrollInterpolator={this._scrollInterpolator}
                slideInterpolatedStyle={(index, animatedValue, carouselProps) => {
                  return {
                    opacity: animatedValue.interpolate({
                      inputRange: [-3, -2, -1, 0, 1, 2, 3],
                      outputRange: [0.1, 0.5, 0.8, 1, 0.8, 0.5, 0.1],
                      extrapolate: 'clamp'
                    }),
                    transform: [{
                      scale: animatedValue.interpolate({
                        inputRange: [-3, -2, -1, 0, 1, 2, 3],
                        outputRange: [0.6, 0.75, 0.9, 1, 0.9, 0.75, 0.6]
                      }),
                    }],
                  }
                }}
                renderItem={({item, index}) =>
                  <Item
                    date={item.date}
                    month={item.month}
                    day={item.day}
                  />
                }
              />
              <TouchableWithoutFeedback
                onPress={() => {
                  this.mainC.snapToNext();
                }}>
                <Image
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: '#FFFFFF',
                    zIndex: 10,
                    transform: [{rotate: '180deg'}]
                  }}
                  source={require("../images/ic_back.png")}/>
              </TouchableWithoutFeedback>
            </View>
          </View>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={require('../images/top_curve_border.png')}
              style={{
                position: 'absolute',
                left: 20,
                right: 20,
                top: 8,
                width: DEVICE_WIDTH - 40,
                height: (DEVICE_WIDTH - 40) / 16,
                resizeMode: 'contain'
              }}
            />
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'byekan',
                backgroundColor: 'white',
                borderRadius: 12,
                paddingHorizontal: 15,
                textAlign: 'center',
              }}>
              تعیین ساعت
            </Text>
          </View>
          <View
            onLayout={() => {
              if (this.state.loading) {
                setTimeout(() => {
                  this.setState({loading: false})
                }, 1000)
              }
            }}
            style={{
              alignItems: 'center',
              justifyContent: 'space-around',
              flexDirection: 'row',
              marginVertical: 20,
            }}>
            <View
              style={{
                flex: 2,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <View style={{flex: 1}}/>
              {
                this.renderCarousel(dailyHour, this._endHour, (index) => {
                  this._endHour = index;
                })
              }
              <Text style={{marginHorizontal: 10, color: '#FFFFFF'}}>:</Text>
              {
                this.renderCarousel(dailyMinutes, this._endMinute / 5, (index) => {
                  this._endMinute = index;
                })
              }
              <View style={{flex: 1}}/>
            </View>
            <Text
              style={{
                fontFamily: 'byekan',
                color: '#FFFFFF',
                fontSize: 15,
                textAlign: 'center',
                flex: 1
              }}
            >
              تا
            </Text>
            <View
              style={{
                flex: 2,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <View style={{flex: 1}}/>
              {
                this.renderCarousel(dailyHour, this._startHour, (index) => {
                  this._startHour = index;
                })
              }
              <Text style={{marginHorizontal: 10, color: '#FFFFFF'}}>:</Text>
              {
                this.renderCarousel(dailyMinutes, this._startMinute / 5, (index) => {
                  this._startMinute = index;
                })
              }
              <View style={{flex: 1}}/>
            </View>
            <Text
              style={{
                fontFamily: 'byekan', color: '#FFFFFF', fontSize: 15, textAlign: 'center', flex: 1
              }}>
              از
            </Text>
          </View>
          <View
            onLayout={(evt) => {
              this.setState({titleY:evt.nativeEvent.layout.y})
            }}
            style={{
              flexDirection: 'row'
            }}
          >
            <TouchableWithoutFeedback
              onPress={this.saveValue}
            >
              <View
                style={{
                  height: 40,
                  borderRadius: 20,
                  borderColor: '#FFF',
                  borderWidth: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginHorizontal: 10,
                  marginTop: 5
                }}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 12,
                    paddingHorizontal: 5,
                    textAlign: 'center',
                    fontFamily: 'byekan',
                  }}
                >
                  تعیین موضوع
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <View
              style={{
                flex: 1,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#FFFFFF',
                flexDirection: 'row-reverse',
                alignItems: 'center',
                marginHorizontal: 5
              }}>
              <View
                style={{
                  backgroundColor: '#675ec9',
                  height: 40,
                  borderTopRightRadius: 20,
                  borderTopLeftRadius: 20,
                  borderBottomRightRadius: 20,
                  paddingHorizontal: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{color: '#FFFFFF', fontFamily: 'byekan'}}>
                  موضوع
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              position: 'absolute',
              top: this.state.titleY,
              left: 80,
              right: 35,
              height: 50,
              marginHorizontal: 0,
              zIndex: 2000,
            }}
          >
            <Autocomplete
              autoCapitalize='none'
              autoCorrect={false}
              inputContainerStyle={{
                borderWidth: 0
              }}
              containerStyle={{
                flex: 1,
                left: 0,
                position: 'absolute',
                justifyContent: 'center',
                right: 40,
                top: 6.5,
                zIndex: 2002,
                borderRadius: 15,
                overflow: 'hidden',
              }}
              data={this.state.focusTitle ? this.state.titles.filter(this._compareTitle) : []}
              renderTextInput={(props) => (
                <TextInput
                  {...props}
                  placeholderTextColor='#CCC'
                  style={[
                    {
                      color: '#000000',
                      textAlign: 'right',
                      fontSize: 12,
                      fontFamily: 'byekan',
                      paddingRight: 15,
                      borderRadius: 15,
                      overflow: 'hidden',
                      paddingVertical: 0,
                      zIndex: 2003
                    }]}
                />
              )}
              onFocus={() => {
                this.setState({focusTitle: true});
              }}
              onBlur={() => {
                this.setState({focusTitle: false});
              }}
              defaultValue={this.state.title}
              onChangeText={text => {
                this.setState({title: text});
              }}
              placeholder='جست و جو...'
              renderItem={({item}) => (
                <TouchableWithoutFeedback
                  onPress={() => this.setState({title: item})}
                >
                  <Text style={{zIndex: 3000, textAlign: 'center'}}>
                    {item}
                  </Text>
                </TouchableWithoutFeedback>
              )}
            />
          </View>

          <View
            style={{
              position: 'absolute',
              top: this.state.addressY,
              left: 80,
              right: 35,
              height: 50,
              marginHorizontal: 0,
              zIndex: 2000,
            }}
          >
            <Autocomplete
              autoCapitalize='none'
              autoCorrect={false}
              inputContainerStyle={{
                borderWidth: 0
              }}
              containerStyle={{
                flex: 1,
                left: 0,
                position: 'absolute',
                justifyContent: 'center',
                right: 40,
                top: 6.5,
                zIndex: 2002,
                borderRadius: 15,
                overflow: 'hidden',
              }}
              data={this.state.focusAddress ? this.state.addresses.filter(this._compareAddress) : []}
              renderTextInput={(props) => (
                <TextInput
                  {...props}
                  placeholderTextColor='#CCC'
                  style={[
                    {
                      color: '#000000',
                      textAlign: 'right',
                      fontSize: 12,
                      fontFamily: 'byekan',
                      paddingRight: 15,
                      borderRadius: 15,
                      overflow: 'hidden',
                      paddingVertical: 0,
                      zIndex: 2003
                    }]}
                />
              )}
              onFocus={() => {
                this.setState({focusAddress: true});
              }}
              onBlur={() => {
                this.setState({focusAddress: false});
              }}
              defaultValue={this.state.address}
              onChangeText={text => {
                this.setState({address: text});
              }}
              placeholder='آدرس...'
              renderItem={({item}) => (
                <TouchableWithoutFeedback
                  onPress={() => this.setState({address: item})}
                >
                  <Text style={{zIndex: 3000, textAlign: 'center'}}>
                    {item}
                  </Text>
                </TouchableWithoutFeedback>
              )}
            />
          </View>

          <View
            onLayout={(evt) => {
              this.setState({addressY:evt.nativeEvent.layout.y})
            }}
            style={{
              flexDirection: 'row'
            }}
          >
            <TouchableWithoutFeedback
              onPress={this.saveAddress}
            >
              <View
                style={{
                  height: 40,
                  borderRadius: 20,
                  borderColor: '#FFF',
                  borderWidth: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginHorizontal: 10,
                  marginTop: 5
                }}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 12,
                    paddingHorizontal: 5,
                    textAlign: 'center',
                    fontFamily: 'byekan',
                  }}
                >
                  {'تعیین آدرس '}
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <View
              style={{
                flex: 1,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#FFFFFF',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: 5,
                marginTop: 5
              }}>
              <Text
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#000',
                  flex: 1,
                  textAlign: 'center',
                  fontFamily: 'byekan',
                  marginHorizontal: 20,
                  borderRadius: 20,
                }}
              >
                {this.state.currentPlaceTitle}
              </Text>
              <View
                style={{
                  backgroundColor: '#675ec9',
                  height: 40,
                  borderTopRightRadius: 20,
                  borderTopLeftRadius: 20,
                  borderBottomRightRadius: 20,
                  paddingHorizontal: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{color: '#FFFFFF', fontFamily: 'byekan'}}>
                  آدرس
                </Text>
              </View>
            </View>
          </View>
          <TouchableWithoutFeedback
            onPress={() => NavigationService.navigate('Save')}>
            <ImageBackground
              source={this.props.counter.uri === null ?
                require('../images/ic_map.png') :
                {uri: this.props.counter.uri}
              }
              style={{
                resizeMode: 'cover',
                flex: 1,
                alignSelf: 'center',
                width: DEVICE_WIDTH - 40,
                alignItems: 'center',
                borderRadius: 15,
                overflow: 'hidden',
                marginTop: 15
              }}
            >
              <Text
                style={{
                  fontFamily: 'byekan',
                  fontSize: 18,
                  color: '#888',
                  backgroundColor: '#FFF',
                  textAlign: 'center',
                  borderWidth: 2,
                  borderRadius: 25,
                  marginTop: 5,
                  borderColor: '#808080',
                  paddingHorizontal: 10,
                }}>
                انتخاب از روی نقشه
              </Text>
            </ImageBackground>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => NavigationService.navigate('ChoosePeople', {
              date: '1398-' + (this.state.selectedMonth + 1) + '-' + (this.state.selectedDay + 1),
              start: dailyHour[this._startHour] + ":" + dailyMinutes[this._startMinute],
              end: dailyHour[this._endHour] + ":" + dailyMinutes[this._endMinute],
              place: this.state.address,
              meeting_title: this.state.title
            })}>
            <View style={{marginVertical: 10}}>
              <Text
                style={{
                  fontFamily: 'byekan',
                  fontSize: 18,
                  width: '80%',
                  textAlign: 'center',
                  color: '#675ec9',
                  alignSelf: 'center',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 30,
                  paddingVertical: 10,
                  paddingHorizontal: 25,
                }}>
                تایید
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    color: '#000000',
    fontSize: 18,
    fontFamily: 'byekan'
  },
  address: {
    fontFamily: 'byekan',
    color: 'white',
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#FFFFFF',
    marginHorizontal: 15,
    paddingHorizontal: 5
  }
});

function mapStateToProps(state) {
  return {
    counter: state
  }
}

export default connect(mapStateToProps, {counterAdd, counterSub})(AddNewSession);

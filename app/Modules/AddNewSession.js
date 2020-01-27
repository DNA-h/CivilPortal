import React, {Component} from "react";
import {
  StyleSheet, View, Image, TouchableWithoutFeedback, Text, TouchableOpacity,
  FlatList, ImageBackground, KeyboardAvoidingView, Dimensions, TouchableHighlight,
  TextInput, ToastAndroid, ScrollView
} from 'react-native';
import {connect} from "react-redux";
import Tabs from 'react-native-scrollable-tab-view';
import {counterAdd, counterSub, setURI} from "../actions";
import NavigationService from "../service/NavigationService";
import Item from "./Components/Item";
import {RequestsController} from "../Utils/RequestController";
import Carousel, {getInputRangeFromIndexes} from 'react-native-snap-carousel';
import Modal from "react-native-modal";
import DBManager from "../Utils/DBManager";
import Autocomplete from 'react-native-autocomplete-input';
import Globals from "../Utils/Globals";

let dailyHour = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11',
  '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
let dailyMinutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
let months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
let days = [`یک${'\n'}شنبه`, `دو${'\n'}شنبه`, `سه${'\n'}شنبه`, `چهار${'\n'}شنبه`, `پنج${'\n'}شنبه`, `جمعه`, `شنبه`];
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

class AddNewSession extends Component {

  constructor(props) {
    super(props);
    let date = new Date();
    this._startHour = date.getHours();
    this._startMinute = Math.floor((date.getMinutes() - date.getMinutes() % 5) / 5);
    this._endHour = date.getHours() === 23 ? 0 : date.getHours() + 1;
    this.endHour = '';
    this._endMinute = Math.floor((date.getMinutes() - date.getMinutes() % 5) / 5);
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
      title: '',
      titles: [],
      focusTitle: false,
      address: '',
      addresses: [],
      focusAddress: false
    };
    this._loadPlaces = this._loadPlaces.bind(this);
    this.saveValue = this.saveValue.bind(this);
    this._compareTitle = this._compareTitle.bind(this);
    this._compareAddress = this._compareAddress.bind(this);
  }

  async componentDidMount() {
    // this._loadPlaces();
    this.props.setURI(null, 0, 0);
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
    }

    if (!this.state.addresses.some(e => e === this.state.address)) {
      const count = parseInt(await DBManager.getSettingValue('addressCount', '0'), 10);
      await DBManager.saveSettingValue(`address${count}`, this.state.address);
      await DBManager.saveSettingValue(`addressCount`, count + 1);
      this.state.addresses.push(this.state.address);
      this.setState({addresses: this.state.addresses});
    }
  }

  _compareTitle(a) {
    // return this.state.query === '';
    return a.includes(this.state.title) && a !== this.state.title;
  }

  _compareAddress(a) {
    // return this.state.query === '';
    return a.includes(this.state.address) && a !== this.state.address;
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
    const range = [6, 5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5, -6];
    const inputRange = getInputRangeFromIndexes(range, index, carouselProps);
    const outputRange = range;

    return {inputRange, outputRange};
  }

  renderCarousel(data, first, saveFunc) {
    return (
      <ScrollView
        data={data}
        enableMomentum
        initialNumToRender={data.length}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => 'endHour-' + index}
        vertical
        ref={(ref) => {
          if (ref === null || ref === undefined) return;
          ref.scrollTo({x: 0, y: 50 * first, animated: false});
        }}
        snapToInterval={50}
        snapToAlignment={'start'}
        onScroll={event => {
          saveFunc(event.nativeEvent.contentOffset.y);
        }}
        style={{
          height: 50,
          width: 30,
          borderRadius: 15
        }}
      >
        {
          data.map((val, index) =>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: 50,
                width: 30,
                borderRadius: 15
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: 'byekan',
                  borderRadius: 12,
                  color: '#FFFFFF',
                  textAlign: 'center'
                }}>
                {data[index]}
              </Text>
            </View>
          )
        }
      </ScrollView>
    )
  }

  render() {
    return (
      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
      >
        <ImageBackground
          source={require('../images/menu.png')}
          style={{
            flex: 1,
          }}
        >
          <TouchableOpacity
            style={{
              paddingLeft: 5, paddingRight: 15, alignSelf: 'flex-start'
            }}
            onPress={NavigationService.goBack}
          >
            <Image
              style={{
                width: 25,
                height: 25,
                marginTop: 5,
                marginRight: 10
              }}
              tintColor={'#FFFFFF'}
              source={require('../images/ic_back.png')}
            />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row'
            }}
          >
            <View style={{flex: 1, justifyContent: 'center', marginTop: 0}}>
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
                    fontSize: 15,
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
                  height: 200,
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                <Carousel
                  data={this.data}
                  extras={this.extras}
                  itemWidth={DBManager.RFWidth(15)}
                  itemHeight={200}
                  sliderWidth={DEVICE_WIDTH}
                  sliderHeight={200}
                  enableMomentum
                  useScrollView={false}
                  activeSlideAlignment={"start"}
                  onBeforeSnapToItem={(index, animatedValue) => {
                    console.log('onbefore', index, " : ", animatedValue)
                  }}
                  onSnapToItem={(item) => {
                    let date = new Date();
                    date.setDate(date.getDate() + item);
                    let jalaali = require('jalaali-js');
                    let jalali = jalaali.toJalaali(date);
                    this.state.selectedMonth = jalali.jm - 1;
                    this.state.selectedDay = jalali.jd - 1;
                  }}
                  layout={'default'}
                  ref={(c) => {
                    this.mainC = c;
                  }}
                  scrollInterpolator={this._scrollInterpolator}
                  slideInterpolatedStyle={(index, animatedValue, carouselProps) => {
                    return {
                      opacity: animatedValue.interpolate({
                        inputRange: [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6],
                        outputRange: [0.8, 0.5, 0.1, 0.1, 0.5, 0.8, 1, 0.8, 0.5, 0.1, 0.1, 0.5, 0.8],
                        extrapolate: 'clamp'
                      }),
                      transform: [{
                        scale: animatedValue.interpolate({
                          inputRange: [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6],
                          outputRange: [0.8, 0.6, 0.5, 0.5, 0.6, 0.8, 1, 0.8, 0.6, 0.5, 0.5, 0.6, 0.8]
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
              </View>
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
                fontSize: 15,
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
            style={{
              alignItems: 'center',
              justifyContent: 'space-around',
              flexDirection: 'row',
              marginVertical: 20,
              marginTop: 10
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
                  this._endHour = Math.floor(index / 50);
                })
              }
              <Text style={{marginHorizontal: 10, color: '#FFFFFF'}}>:</Text>
              {
                this.renderCarousel(dailyMinutes, this._endMinute, (index) => {
                  this._endMinute = Math.floor(index / 50);
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
                  this._startHour = Math.floor(index / 50);
                })
              }
              <Text style={{marginHorizontal: 10, color: '#FFFFFF'}}>:</Text>
              {
                this.renderCarousel(dailyMinutes, this._startMinute, (index) => {
                  this._startMinute = Math.floor(index / 50);
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

          <Modal
            onBackdropPress={() => this.setState({focusTitle: false, focusAddress: false})}
            onBackButtonPress={() => this.setState({focusTitle: false, focusAddress: false})}
            isVisible={this.state.focusTitle || this.state.focusAddress}
          >
            <View
              style={{
                height: 300,
                width: '95%',
                backgroundColor: 'rgba(176,176,176,0.6)',
                borderRadius: 15,
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                }}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}
                >
                  <TextInput
                    placeholder={this.state.focusAddress ? "آدرس ..." : "موضوع ..."}
                    value={this.state.focusAddress ? this.state.address : this.state.title}
                    style={{
                      color: '#FFFFFF',
                      textAlign: 'center',
                      fontFamily: 'byekan',
                      backgroundColor: '#636363',
                      borderRadius: 10,
                      marginStart: 15,
                      marginEnd: 15,
                      marginTop: 15,
                    }}
                    placeholderTextColor='#FFFFFF'
                    onChangeText={(text) => {
                      if (this.state.focusAddress)
                        this.setState({address: text});
                      else
                        this.setState({title: text});
                    }}
                  />
                </View>
              </View>
              <View style={{width: '90%', height: 1, backgroundColor: '#FFFFFF', marginVertical: 10}}/>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 15,
                  width: '100%',
                  fontFamily: 'byekan',
                  textAlign: 'center',
                }}
              >
                موارد پیشین
              </Text>
              <FlatList
                data={this.state.focusAddress ? this.state.addresses : this.state.titles}
                keyExtractor={(_, i) => i.toString()}
                style={{
                  flex: 1,
                  width: '85%',
                }}
                renderItem={({item}) => (
                  <TouchableWithoutFeedback
                    onPress={() => {
                      if (this.state.focusTitle)
                        this.setState({focusTitle: false, title: item});
                      else
                        this.setState({focusAddress: false, address: item});
                    }}
                  >
                    <View
                      style={{
                        marginHorizontal: 15,
                        marginVertical: 10,
                        paddingVertical: 6,
                        backgroundColor: 'rgba(255,255,255,0.6)',
                        borderRadius: 10,
                        width: '85%',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{color: '#000000', fontFamily: 'byekan'}}>
                        {`${item}`}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                )}
              />
              <TouchableWithoutFeedback
                onPress={() => {
                  this.setState({focusTitle: false, focusAddress: false});
                }}
              >
                <View
                  style={{
                    marginHorizontal: 15,
                    marginVertical: 10,
                    paddingVertical: 5,
                    backgroundColor: Globals.PRIMARY_BLUE,
                    borderRadius: 10,
                    width: '85%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}
                >
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontFamily: 'byekan',
                      textAlign: 'center',
                      flex: 1,
                    }}
                  >
                    تایید
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </Modal>
          <TouchableWithoutFeedback
            onPress={() => {
              this.setState({focusTitle: true})
            }}
          >
            <View
              style={{
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

              <Text
                style={{
                  marginRight: 15,
                  fontFamily: 'byekan'
                }}
              >
                {this.state.title}
              </Text>
            </View>

          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => this.setState({focusAddress: true})}
          >
            <View
              style={{
                height: 40,
                borderRadius: 20,
                backgroundColor: '#FFFFFF',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: 5,
                marginTop: 15
              }}>
              <Text
                style={{
                  marginRight: 15,
                  flex: 1,
                  textAlign: 'right',
                  fontFamily: 'byekan'
                }}
              >
                {this.state.address}
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
                  {"آدرس "}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>

          <Text
            style={{
              fontFamily: 'byekan',
              fontSize: 16,
              color: '#888',
              width: '50%',
              alignSelf: 'center',
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
          <TouchableWithoutFeedback
            onPress={() => NavigationService.navigate('Save')}>
            <Image
              source={this.props.counter.uri === null ?
                require("../images/ic_launcher.png") :
                {uri: this.props.counter.uri}
              }
              resizeMode={this.props.counter.uri === null ? 'contain' : 'cover'}
              style={{
                flex: 1,
                alignSelf: 'center',
                width: DEVICE_WIDTH - 40,
                alignItems: 'center',
                borderRadius: 15,
                overflow: 'hidden',
                marginTop: 5
              }}
            />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              this.saveValue();
              NavigationService.navigate('ChoosePeople', {
                date: '1398-' + (this.state.selectedMonth + 1) + '-' + (this.state.selectedDay + 1),
                start: dailyHour[this._startHour] + ":" + dailyMinutes[this._startMinute + 1],
                end: dailyHour[this._endHour] + ":" + dailyMinutes[this._endMinute + 1],
                place: this.state.address,
                meeting_title: this.state.title
              });
              // this.setState({endHour:this.endHour})
            }}>
            <View
              style={{
                marginVertical: 10,
                marginBottom: 20,
                flexDirection: 'row',
                backgroundColor: '#FFFFFF',
                borderRadius: 30,
                paddingVertical: 5,
                paddingHorizontal: 25,
                marginHorizontal: 20
              }}
            >
              <Image
                style={{
                  height: 16,
                  width: 24,
                  marginLeft: 20,
                  alignSelf: 'center',
                  tintColor: '#675ec9'
                }}
                source={require("../images/arrow-back.png")}
              />
              <Text
                style={{
                  fontFamily: 'byekan',
                  fontSize: 25,
                  width: '80%',
                  textAlign: 'center',
                  color: '#675ec9',
                  alignSelf: 'center',
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

export default connect(mapStateToProps, {setURI})(AddNewSession);

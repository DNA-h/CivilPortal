import React, {Component} from "react";
import {
  StyleSheet, View, Image, TouchableWithoutFeedback, Text, FlatList, ImageBackground, Keyboard, Dimensions, TextInput
} from 'react-native';
import {connect} from "react-redux";
import {counterAdd, counterSub} from "./Actions/index";
import NavigationService from "./Service/NavigationService";
import Item from "./Components/Item";
import SplashScreen from "react-native-splash-screen";
import {RequestsController} from "./Utils/RequestController";
import Carousel, {getInputRangeFromIndexes} from 'react-native-snap-carousel';
import Modal from "react-native-modal";
import Globals from "./Utils/Globals";

let dailyHour = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
let dailyMinutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '55', '50', '55'];
let monthsDays = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
let months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
let days = [`یک${'\n'}شنبه`,`دو${'\n'}شنبه`, `سه${'\n'}شنبه`, `چهار${'\n'}شنبه`, `پنج${'\n'}شنبه`, `جمعه`, `شنبه`];
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

class AddNewSession extends Component {

  constructor(props) {
    super(props);
    this._startHour = undefined;
    this._startMinute = undefined;
    this._endHour = undefined;
    this._endMinute = undefined;
    let jalaali = require('jalaali-js');
    let date = new Date();
    let jalali = jalaali.toJalaali(date);
    let month = jalali.jm - 1;
    let day = jalali.jd - 1;
    this.data = [];
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
    this.extras = [];
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
      createNewVisible: false
    };
    this.handleScroll = this.handleScroll.bind(this);
    this._loadPlaces = this._loadPlaces.bind(this);
  }

  componentWillUpdate() {
    this.mainC.snapToItem(0);
  }

  handleScroll(event: Object) {
    let x = event.nativeEvent.contentOffset.x;
    let index = Math.floor(x / 70);
    let percent = (x % 70) / 70;
    this.setState({
      currentItem: index, currentPercent: percent
    });
  }

  componentDidMount() {
    SplashScreen.hide();
    this._loadPlaces();
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

  render() {
    return (<View
        style={{flex: 1, direction: 'rtl'}}>
        <ImageBackground
          source={require('./images/menu.png')}
          style={{flex: 1, width: DEVICE_WIDTH, height: DEVICE_HEIGHT,}}
        >
          <View
            style={{
              flex: 1, width: DEVICE_WIDTH, height: DEVICE_HEIGHT,
            }}>
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
                source={require('./images/ic_back.png')}
              />
            </TouchableWithoutFeedback>
            <View
              style={{
                flex: 1
              }}>
              <View
                style={{width: '100%', alignItems: 'center', justifyContent: 'center'}}
              >
                <Image
                  source={require('./images/top_curve_border.png')}
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
                  flex: 1, marginHorizontal: 10, flexDirection: 'row', alignItems: 'center'
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
                    source={require("./images/ic_back.png")}/>
                </TouchableWithoutFeedback>
                <Carousel
                  data={this.data}
                  itemWidth={45}
                  itemHeight={140}
                  sliderWidth={DEVICE_WIDTH}
                  sliderHeight={140}
                  enableMomentum
                  useScrollView={false}
                  activeSlideAlignment={"start"}
                  contentContainerCustomStyle={{paddingHorizontal:0, paddingVertical:0}}
                  containerCustomStyle={{paddingHorizontal:0, paddingVertical:0}}
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
                        opacity={0.1}
                      />
                      <Item
                        date={this.extras[1].date}
                        month={this.extras[1].month}
                        day={this.extras[1].day}
                        opacity={0.5}
                      />
                      <Item
                        date={this.extras[0].date}
                        month={this.extras[0].month}
                        day={this.extras[0].day}
                        opacity={0.8}
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
                        opacity={0.8}
                      />
                      <Item
                        date={this.extras[4].date}
                        month={this.extras[4].month}
                        day={this.extras[4].day}
                        opacity={0.5}
                      />
                      <Item
                        date={this.extras[5].date}
                        month={this.extras[5].month}
                        day={this.extras[5].day}
                        opacity={0.1}
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
                          outputRange: [1, 1, 1, 1.4, 1, 1, 1]
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
                    source={require("./images/ic_back.png")}/>
                </TouchableWithoutFeedback>

              </View>
            </View>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 10
              }}>
              <Image
                source={require('./images/top_curve_border.png')}
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
              style={{
                alignItems: 'center',
                justifyContent: 'space-around',
                flexDirection: 'row',
                direction: 'ltr',
                marginVertical: 40,
              }}>
              <View
                style={{
                  flex: 2, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
                }}>
                <View style={{flex: 1}}/>
                <View>
                  <Carousel
                    data={dailyHour}
                    itemWidth={30}
                    itemHeight={30}
                    sliderWidth={30}
                    sliderHeight={30}
                    enableMomentum
                    layout={'default'}
                    vertical
                    ref={(c) => {
                      this._endHour = c;
                    }}
                    onBeforeSnapToItem={(index) => {
                      this.state.endHour = index;
                    }}
                    containerCustomStyle={{
                      height: 30,
                      width: 30,
                      flexGrow: 0,
                      backgroundColor: '#FFFFFF',
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
                            textAlign: 'center'
                          }}>
                          {item}
                        </Text>
                      </View>
                    }
                  />

                </View>
                <Text style={{marginHorizontal: 10, color: '#FFFFFF'}}>:</Text>
                <View>
                  <Carousel
                    data={dailyMinutes}
                    itemWidth={30}
                    itemHeight={30}
                    sliderWidth={30}
                    sliderHeight={30}
                    enableMomentum
                    layout={'default'}
                    loop
                    vertical
                    ref={(c) => {
                      this._endMinute = c;
                    }}
                    loopClonesPerSide={15}
                    containerCustomStyle={{
                      height: 30,
                      width: 30,
                      flexGrow: 0,
                      backgroundColor: '#FFFFFF',
                      borderRadius: 15
                    }}
                    onBeforeSnapToItem={(index) => this._endMinuteValue = index}
                    renderItem={({item, index}) => <View
                      style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                      <Text
                        style={{
                          fontSize: 18,
                          fontFamily: 'byekan',
                          borderRadius: 12,
                          textAlign: 'center'
                        }}>
                        {item}
                      </Text></View>}/>
                </View>
                <View style={{flex: 1}}/>
              </View>
              <Text
                style={{
                  fontFamily: 'byekan', color: '#FFFFFF', fontSize: 15, textAlign: 'center', flex: 1
                }}>
                تا
              </Text>
              <View
                style={{
                  flex: 2, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
                }}>
                <View style={{flex: 1}}/>
                <View>
                  <Carousel
                    data={dailyHour}
                    itemWidth={30}
                    itemHeight={30}
                    sliderWidth={30}
                    sliderHeight={30}
                    enableMomentum
                    layout={'default'}
                    vertical
                    loop
                    ref={(c) => {
                      this._startHour = c;
                    }}
                    loopClonesPerSide={15}
                    containerCustomStyle={{
                      height: 30,
                      width: 30,
                      flexGrow: 0,
                      backgroundColor: '#FFFFFF',
                      borderRadius: 15
                    }}
                    renderItem={({item, index}) => <View
                      style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                      <Text
                        style={{
                          fontSize: 18,
                          fontFamily: 'byekan',
                          borderRadius: 12,
                          textAlign: 'center'
                        }}>
                        {item}
                      </Text></View>}/>
                </View>
                <Text style={{marginHorizontal: 10, color: '#FFFFFF'}}>:</Text>
                <View>
                  <Carousel
                    data={dailyMinutes}
                    itemWidth={30}
                    itemHeight={30}
                    sliderWidth={30}
                    sliderHeight={30}
                    enableMomentum
                    layout={'default'}
                    vertical
                    loop
                    ref={(c) => {
                      this._startMinute = c;
                    }}
                    loopClonesPerSide={15}
                    containerCustomStyle={{
                      height: 30,
                      width: 30,
                      flexGrow: 0,
                      backgroundColor: '#FFFFFF',
                      borderRadius: 15
                    }}
                    renderItem={({item, index}) => <View
                      style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                      <Text
                        style={{
                          fontSize: 18,
                          fontFamily: 'byekan',
                          borderRadius: 12,
                          textAlign: 'center'
                        }}>
                        {item}
                      </Text></View>}/>
                </View>
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
              style={{
                height: 40,
                borderRadius: 20,
                backgroundColor: '#FFFFFF',
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 30
              }}>
              <TextInput
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#000',
                  flex: 1,
                  textAlign: 'center',
                  fontFamily: 'byekan',
                  marginHorizontal: 20,
                  borderRadius: 20,
                  height: 40,
                }}
                autoCapitalize="none"
                onChangeText={(text) => {
                  this.title = text;
                }}
                autoCorrect={false}
                returnKeyType="next"
                placeholderTextColor='#909090'/>
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
            <TouchableWithoutFeedback
              onPress={() => this.setState({selectPlace: true})}>
              <View
                style={{
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#FFFFFF',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginHorizontal: 30,
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
            </TouchableWithoutFeedback>
            <View style={{flex: 1}}>
              <TouchableWithoutFeedback
                onPress={() => NavigationService.navigate('Save')}>
                <View style={{flex: 1, alignItems: 'center'}}>
                  <ImageBackground
                    source={require('./images/ic_map.png')}
                    style={{
                      resizeMode: 'cover',
                      flex: 1,
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
                </View>
              </TouchableWithoutFeedback>
            </View>
            <Modal
              onBackdropPress={() => this.setState({selectPlace: false})}
              isVisible={this.state.selectPlace}
            >
              <View
                style={{
                  height: 300,
                  width: '95%',
                  backgroundColor: 'rgba(255,255,255,0.6)',
                  borderRadius: 15,
                }}
              >
                <FlatList
                  style={{height: 300}}
                  data={this.state.places}
                  renderItem={({item, index}) =>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        this.setState({
                          currentPlace: item.pk,
                          currentPlaceTitle: item.title,
                          selectPlace: false
                        });
                      }}>
                      <View
                        style={{
                          marginHorizontal: 15,
                          marginVertical: 10,
                          paddingVertical: 6,
                          borderRadius: 10,
                          backgroundColor: 'rgb(80,80,80)',
                          width: '85%',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text
                          style={{
                            color: '#FFFFFF',
                            fontFamily: 'byekan'
                          }}
                        >
                          {item.title}
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  }
                />
                <TouchableWithoutFeedback
                  onPress={() => {
                    this.setState({createNewVisible: true});
                  }}
                >
                  <View
                    style={{
                      marginHorizontal: 15,
                      marginVertical: 10,
                      paddingVertical: 5,
                      backgroundColor: '#675ec9',
                      borderRadius: 10,
                      width: '85%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                    }}
                  >
                    <Image
                      source={require('./images/ic_location.png')}
                      style={{
                        width: 25,
                        height: 25,
                        resizeMode: 'contain',
                        marginVertical: 5,
                        marginHorizontal: 10,
                      }}
                    />
                    <Text
                      style={{
                        color: '#FFFFFF',
                        textAlign: 'center',
                        fontFamily: 'byekan',
                        flex: 1,
                      }}
                    >
                      اضافه کردن مکان جدید
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </Modal>

            <Modal
              onBackdropPress={() => this.setState({createNewVisible: false})}
              isVisible={this.state.createNewVisible}
            >
              <View
                style={{
                  backgroundColor: '#818181',
                  borderRadius: 5,
                  paddingBottom: 15,
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <TextInput
                  placeholder="عنوان آدرس (مثلا دفتر مرکزی) ..."
                  style={{
                    color: '#FFFFFF',
                    textAlign: 'center',
                    backgroundColor: '#636363',
                    borderRadius: 5,
                    marginStart: 15,
                    marginEnd: 15,
                    marginTop: 15,
                  }}
                  placeholderTextColor='#FFFFFF'
                  onChangeText={(text) => {
                    this.address = text;
                  }}
                />
                <TextInput
                  placeholder="آدرس (به صورت کامل) ..."
                  style={{
                    color: '#FFFFFF',
                    textAlign: 'center',
                    backgroundColor: '#636363',
                    borderRadius: 5,
                    marginStart: 15,
                    marginEnd: 15,
                    marginTop: 15,
                  }}
                  placeholderTextColor='#FFFFFF'
                  onChangeText={(text) => {
                    this.text = text;
                  }}
                />
                <TouchableWithoutFeedback
                  onPress={async () => {
                    let result = await RequestsController.saveAddress(this.address, this.text, 0, 0);
                    this.setState({
                      selectPlace: false,
                      createNewVisible: false,
                      currentPlace: result[result.length - 1].pk,
                      currentPlaceTitle: result[result.length - 1].fields.place_title,
                    });
                  }}
                >
                  <View
                    style={{
                      marginHorizontal: 15,
                      marginVertical: 10,
                      paddingVertical: 5,
                      backgroundColor: '#675ec9',
                      borderRadius: 10,
                      width: '85%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                    }}>
                    <Text
                      style={{
                        color: '#FFFFFF',
                        textAlign: 'center',
                        fontFamily: 'byekan',
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
              onPress={() => NavigationService.navigate('ChoosePeople', {
                date: '1398-' + (this.state.selectedMonth + 1) + '-' + (this.state.selectedDay + 1),
                start: dailyHour[this._startHour.currentIndex] + ":" + dailyMinutes[this._startMinute.currentIndex],
                end: dailyHour[this._endHour.currentIndex] + ":" + dailyMinutes[this._endMinute.currentIndex],
                place: this.state.currentPlace,
                meeting_title: this.title
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
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    color: '#000000', fontSize: 18, fontFamily: 'byekan'
  }, address: {
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

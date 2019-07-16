import React, {Component} from "react";
import {
  StyleSheet, View, Image, TouchableWithoutFeedback, Text, FlatList, ScrollView, Keyboard, Dimensions, TextInput
} from 'react-native';
import {connect} from "react-redux";
import {counterAdd, counterSub} from "./Actions/index";
import NavigationService from "./Service/NavigationService";
import Item from "./Components/Item";
import SplashScreen from "react-native-splash-screen";
import {RequestsController} from "./Utils/RequestController";
import LinearGradient from "react-native-linear-gradient";
import Carousel from 'react-native-snap-carousel';
import Modal from "react-native-modal";

let dailyHour = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
let dailyMinutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '55', '50', '55'];
let monthsDays = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
let months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
let days = [`دو${'\n'}شنبه`, `سه${'\n'}شنبه`, `چهار${'\n'}شنبه`, `پنج${'\n'}شنبه`, `جمعه`, `شنبه`, `یک${'\n'}شنبه`];
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
      places: [],
      selectPlace: false,
      isVisible: false,
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
        pk: result[index].pk, title: result[index].fields.place_title
      };
      this.state.places.push(item);
    }
    this.setState({places: this.state.places});
  }

  render() {
    return (<View
        style={{flex: 1, direction: 'rtl'}}>
        <LinearGradient
          colors={['#5849a7', '#8787f0']}
          start={{x: 0, y: 0}} end={{x: 1, y: 1}}
          style={{flex: 1, width: DEVICE_WIDTH, height: DEVICE_HEIGHT,}}
        >
          <View
            style={{
              flex: 1, width: DEVICE_WIDTH, height: DEVICE_HEIGHT,
            }}>
            <View
              style={{
                flex: 1
              }}>
              <View style={{width: '100%', alignItems: 'center'}}>
                <Text style={{
                  fontSize: 13,
                  fontFamily: 'byekan',
                  backgroundColor: 'white',
                  borderRadius: 12,
                  paddingHorizontal: 15,
                  textAlign: 'center'
                }}>
                  تعیین روز
                </Text>
                <View style={{
                  position: 'absolute',
                  left: 10,
                  right: 10,
                  top: 10,
                  height: 1,
                  backgroundColor: 'white'
                }}/>
              </View>
              <View
                style={{
                  flex: 1, marginHorizontal: 0, flexDirection: 'row', alignItems: 'center'
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
                  contentContainerCustomStyle={{paddingStart: 0, paddingEnd: 0}}
                  containerCustomStyle={{paddingStart: 0, paddingEnd: 0}}
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
                    <View style={{flexDirection: 'row'}}>
                      <Item
                        date={this.extras[2].date}
                        month={this.extras[2].month}
                        day={this.extras[2].day}
                      />
                      <Item
                        date={this.extras[1].date}
                        month={this.extras[1].month}
                        day={this.extras[1].day}
                      />
                      <Item
                        date={this.extras[0].date}
                        month={this.extras[0].month}
                        day={this.extras[0].day}
                      />
                    </View>}
                  ListFooterComponent={
                    <View style={{flexDirection: 'row'}}>
                      <Item
                        date={this.extras[3].date}
                        month={this.extras[3].month}
                        day={this.extras[3].day}
                      />
                      <Item
                        date={this.extras[4].date}
                        month={this.extras[4].month}
                        day={this.extras[4].day}
                      />
                      <Item
                        date={this.extras[5].date}
                        month={this.extras[5].month}
                        day={this.extras[5].day}
                      />
                    </View>}
                  layout={'default'}
                  ref={(c) => {
                    this.mainC = c;
                  }}
                  slideInterpolatedStyle={(index, animatedValue, carouselProps) => {
                    return {
                      transform: [{
                        scale: animatedValue.interpolate({
                          inputRange: [0, 1], outputRange: [1, 1.4]
                        })
                      }],
                    }
                  }}
                  renderItem={({item, index}) => <Item
                    date={item.date}
                    month={item.month}
                    day={item.day}
                  />}/>
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
                <LinearGradient
                  colors={['rgba(88,73,163,1)', 'rgba(88,73,163,0.8)', 'rgba(88,73,163,0)', 'rgba(88,73,163,0.8)', 'rgba(88,73,163,1)']}
                  start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                  }}
                />
              </View>
            </View>
            <View style={{width: '100%', alignItems: 'center'}}>
              <Text style={{
                fontSize: 13,
                fontFamily: 'byekan',
                backgroundColor: 'white',
                borderRadius: 12,
                paddingHorizontal: 15,
                textAlign: 'center'
              }}>
                تعیین ساعت
              </Text>
              <View style={{
                position: 'absolute', left: 10, right: 10, top: 10, height: 1, backgroundColor: 'white'
              }}/>
            </View>
            <View
              style={{
                alignItems: 'center', justifyContent: 'center', flex: 1, flexDirection: 'row', direction: 'ltr'
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
                    height: 40,
                  }}
                  autoCapitalize="none"
                  onChangeText={(text) => {
                    this.address = text;
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
                    آدرس
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
            <View>
              <View style={{flexDirection: 'row', marginTop: 20}}>
                <View style={{flex: 1}}/>
                <TouchableWithoutFeedback
                  onPress={() => NavigationService.navigate('Save')}>
                  <View style={{flex: 3}}>
                    <Text
                      style={styles.address}>
                      تعیین مکان از روی نقشه
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
                <View style={{flex: 1}}/>
              </View>
            </View>
            <Modal
              isVisible={this.state.isVisible}
              style={{justifyContent: "flex-end"}}
              onBackdropPress={() => this.setState({isVisible: false})}>
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 10,
                  marginStart: 10,
                  marginEnd: 10,
                  paddingStart: 10,
                  paddingEnd: 10,
                  paddingBottom: 5
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    margin: 10,
                    paddingEnd: 25,
                    paddingStart: 25
                  }}>
                  <TouchableWithoutFeedback
                    onPress={() => this.setState({visible: false})}>
                    <Image style={{height: 120, width: '90%'}}
                           source={require('./images/ic_map.png')}/>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </Modal>
            <Modal
              isVisible={this.state.selectPlace}
              style={{justifyContent: "flex-end"}}
              onBackdropPress={() => this.setState({selectPlace: false})}>
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 10,
                  marginStart: 10,
                  marginEnd: 10,
                  paddingStart: 10,
                  paddingEnd: 10,
                  paddingBottom: 5
                }}>
                <View style={{flexDirection: 'row'}}>
                  <TouchableWithoutFeedback
                    onPress={() => NavigationService.navigate('Save')}>
                    <Text
                      style={{color: '#000'}}>
                      آدرس جدید
                    </Text>
                  </TouchableWithoutFeedback>
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
                      this.address = text;
                    }}
                    autoCorrect={false}
                    returnKeyType="next"
                    placeholderTextColor='#909090'/>
                </View>
                <View>
                  <FlatList
                    style={{height: 300}}
                    data={this.state.places}
                    renderItem={({item, index}) =>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          this.setState({
                            currentPlace: index,
                            selectPlace: false
                          });
                        }}>
                        <View>
                          <Text>
                            {item.title}
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                    }
                  />
                </View>
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
                    color: '#FFFFFF',
                    alignSelf: 'center',
                    backgroundColor: '#F035E0',
                    borderRadius: 30,
                    paddingVertical: 10,
                    paddingHorizontal: 25,
                  }}>
                  تایید
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </LinearGradient>
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

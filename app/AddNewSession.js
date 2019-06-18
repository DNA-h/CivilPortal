import React, {Component} from "react";
import {
  StyleSheet, View, Image, TouchableWithoutFeedback, Text, Picker, ScrollView, Keyboard, Dimensions, TextInput
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
let days = ['دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه', 'یکشنبه'];
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
    };
    this.handleScroll = this.handleScroll.bind(this);
    this._loadPlaces = this._loadPlaces.bind(this);
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
      style={{flex: 1}}>
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
                fontSize: 13, fontFamily: 'byekan', backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 15, textAlign: 'center'
              }}>
                تعیین روز
              </Text>
              <View style={{
                position: 'absolute', left: 10, right: 10, top: 10, height: 1, backgroundColor: 'white'
              }}/>
            </View>
            <View
              style={{
                flex: 1, marginHorizontal: 10, flexDirection: 'row',
              }}>
              <Carousel
                data={this.data}
                itemWidth={70}
                itemHeight={180}
                sliderWidth={DEVICE_WIDTH}
                sliderHeight={250}
                enableMomentum
                layout={'default'}
                style={{width: 70, height: 250}}
                slideInterpolatedStyle={(index, animatedValue, carouselProps) => {
                  return {
                    transform: [{
                      scale: animatedValue.interpolate({
                        inputRange: [0, 1], outputRange: [1, 1.2]
                      })
                    }]
                  }
                }}
                renderItem={({item, index}) => <Item
                  index={item.index}
                  currentItem={this.state.currentItem}
                  currentPercent={this.state.currentPercent}
                  date={item.date}
                  month={item.month}
                  day={item.day}
                />}/>
            </View>
          </View>
          <View style={{width: '100%', alignItems: 'center'}}>
            <Text style={{
              fontSize: 13, fontFamily: 'byekan', backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 15, textAlign: 'center'
            }}>
              تعیین ساعت
            </Text>
            <View style={{
              position: 'absolute', left: 10, right: 10, top: 10, height: 1, backgroundColor: 'white'
            }}/>
          </View>
          <View
            style={{
              alignItems: 'center', justifyContent: 'center', flex: 1, flexDirection: 'row'
            }}>
            <View
              style={{
                flex: 2, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
              }}>
              <View style={{flex: 1}}/>
              <View>
                <Image
                  style={{
                    width: 25, height: 25, tintColor: '#FFFFFF', transform: [{rotate: '90deg'}]
                  }}
                  source={require("./images/ic_back.png")}/>
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
                  containerCustomStyle={{height: 30, width: 30, flexGrow: 0, backgroundColor: '#FFFFFF', borderRadius: 15}}
                  renderItem={({item, index}) => <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                    <Text
                      style={{
                        fontSize: 18, fontFamily: 'byekan', borderRadius: 12, textAlign: 'center'
                      }}>
                      {item}
                    </Text></View>}/>
                <Image
                  style={{
                    width: 25, height: 25, tintColor: '#FFFFFF', transform: [{rotate: '-90deg'}]
                  }}
                  source={require("./images/ic_back.png")}/>
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
                    this._endMinute = c;
                  }}
                  loopClonesPerSide={15}
                  containerCustomStyle={{height: 30, width: 30, flexGrow: 0, backgroundColor: '#FFFFFF', borderRadius: 15}}
                  renderItem={({item, index}) => <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                    <Text
                      style={{
                        fontSize: 18, fontFamily: 'byekan', borderRadius: 12, textAlign: 'center'
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
                  containerCustomStyle={{height: 30, width: 30, flexGrow: 0, backgroundColor: '#FFFFFF', borderRadius: 15}}
                  renderItem={({item, index}) => <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                    <Text
                      style={{
                        fontSize: 18, fontFamily: 'byekan', borderRadius: 12, textAlign: 'center'
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
                  containerCustomStyle={{height: 30, width: 30, flexGrow: 0, backgroundColor: '#FFFFFF', borderRadius: 15}}
                  renderItem={({item, index}) => <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                    <Text
                      style={{
                        fontSize: 18, fontFamily: 'byekan', borderRadius: 12, textAlign: 'center'
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
          <View>
            <TextInput
              style={{
                backgroundColor: '#FFFFFF',
                color: '#000',
                textAlign: 'center',
                fontFamily: 'byekan',
                marginHorizontal: 20,
                borderRadius: 15,
                marginTop: 5
              }}
              autoCapitalize="none"
              onChangeText={(text) => {
                this.title = text;
              }}
              autoCorrect={false}
              returnKeyType="next"
              placeholder='موضوع'
              placeholderTextColor='#909090'/>
          </View>
          <View>
            <View style={{flexDirection: 'row', marginTop: 20}}>
              <TouchableWithoutFeedback
                onPress={() => NavigationService.navigate("Save")}>
                <View style={{flex: 1}}>
                  <Text
                    style={styles.address}>
                    تعیین مکان از روی نقشه
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => NavigationService.navigate("SaveNew")}>
                <View style={{flex: 1}}>
                  <Text style={styles.address}>
                    تعیین مکان با آدرس
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
          <TouchableWithoutFeedback
            onPress={() => NavigationService.navigate('ChoosePeopled', {
              date: '1398-' + (this.state.selectedMonth + 1) + '-' + (this.state.selectedDay + 1),
              start: this.state.startHour + ":" + this.state.startMinute,
              end: this.state.endHour + ":" + this.state.endMinute,
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
    </View>);
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

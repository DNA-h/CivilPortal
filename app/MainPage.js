import React, {Component} from "react";
import {Text, View, FlatList, Image, TouchableWithoutFeedback, Button, ImageBackground} from 'react-native';
import {connect} from "react-redux";
import {counterAdd, counterSub} from "./Actions";
import CalendarItem from "./Components/CalendarItem";
import ActionButton from 'react-native-action-button';
import NavigationService from "./Service/NavigationService";
import SplashScreen from 'react-native-splash-screen';
import {createDrawerNavigator, DrawerItems, DrawerActions} from "react-navigation";
import AddNewSession from "./AddNewSession";
import CalendarPage from "./CalendarPage";
import DBManager from "./Utils/DBManager";
import {RequestsController} from "./Utils/RequestController";
import Modal from "react-native-modal";

let months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
let gMonths = ["ژانویه", "فوریه", "مارس", "آوریل", "مه", "ژوئن", "ژوئیه",
  "اوت", "سپتامبر", "اوکتبر", "نوامبر", "دسامبر"];
let arabicNumbers = ['۰', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

class MainPage extends Component {

  constructor(props) {
    super(props);
    this.difference = 0;
    this.state = {
      todayPersian1: '___',
      todayPersian2: '___',
      todayPersian3: '___',
      todayGeorgian: '___',
      todayHijri: '___',
      sampleData: [],
      visible: false
    };
    this.result = [{people: "{}"}];
    this.people = {};
    this._dayPressed = this._dayPressed.bind(this);
    this._init = this._init.bind(this);
    this.parseGeorgianDate = this.parseGeorgianDate.bind(this);
    this.parseHijriDate = this.parseHijriDate.bind(this);
    this.parsePersianDate = this.parsePersianDate.bind(this);
    this._loadSessions = this._loadSessions.bind(this);
    this._init = this._init.bind(this);
    this._itemClicked = this._itemClicked.bind(this);
    this._init();
  }

  async _loadSessions() {
    let jalaali = require('jalaali-js');
    let date = new Date();
    date.setDate(date.getDate() + this.difference);
    let jalali = jalaali.toJalaali(date);
    let value = jalali.jy + "-" + (jalali.jm < 10 ? '0' + jalali.jm : jalali.jm) + "-" +
      (jalali.jd < 10 ? '0' + jalali.jd : jalali.jd);
    let result = await RequestsController.MySessions(value);
    this.state.sampleData = [];
    for (let index in result) {
      console.log('audience is ', result[index]['as audience']);
      if (result[index]['as audience'] !== undefined) {
        let item = {
          id: result[index]['as audience'].id,
          start: result[index]['as audience'].start_time,
          end: result[index]['as audience'].end_time,
          title: result[index]['as audience'].meeting_title,
          left: 0,
        };
        this.state.sampleData.push(item);
      } else if (result[index]['as owner'] !== undefined) {
        let item = {
          id: result[index]['as owner'].id,
          start: result[index]['as owner'].start_time,
          end: result[index]['as owner'].end_time,
          title: result[index]['as owner'].meeting_title,
          left: 1,
        };
        this.state.sampleData.push(item);
      }
    }
    // console.log('sampleData', this.state);
    this.setState({sampleData: this.state.sampleData});
  }

  async _itemClicked(id) {
    this.result = await RequestsController.specificSession(id.toString());
    // console.log('result ', this.result);
    // this.result = JSON.stringify(this.result);
    let value = this.result[0].people.replace(/'/g, '\"');
    // value = value.replace('True','"True"');
    // value.split('True').join('"True"');
    var find = 'True';
    var re = new RegExp(find, 'g');
    value = value.replace(re, '"True"');
    this.people = await JSON.parse(value);
    // console.log('json is ', this.people);
    this.setState({visible: true});
  }

  async componentDidMount() {
    SplashScreen.hide();
    await this.checkToken();
    await this._loadSessions();
  }

  async checkToken() {
    let token = await DBManager.getSettingValue('token');
    if (token === undefined || token === null || token.length !== 40)
      NavigationService.navigate('Login', null);
  }

  _init() {
    let a = this.parsePersianDate();
    let b = this.parseGeorgianDate();
    let c = this.parseHijriDate();
    this.state.todayPersian1 = a[0];
    this.state.todayPersian2 = a[1];
    this.state.todayPersian3 = a[2];
    this.state.todayGeorgian = b;
    this.state.todayHijri = c;
    this.setState({
      todayPersian1: this.state.todayPersian1,
      todayPersian2: this.state.todayPersian2,
      todayPersian3: this.state.todayPersian3,
      todayGeorgian: this.state.todayGeorgian,
      todayHijri: this.state.todayHijri
    });
  }

  parsePersianDate() {
    let jalaali = require('jalaali-js');
    let date = new Date();
    let w = date.getDay();
    date.setDate(date.getDate() + this.difference);
    let weekDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنج شنبه', 'جمعه'];
    let jalali = jalaali.toJalaali(date);
    let value = [weekDays[w], jalali.jd + '', months[jalali.jm - 1]];
    let chars = value[1].split('');
    for (let index in chars)
      if (chars[index] >= '0' && chars[index] <= '9')
        chars[index] = arabicNumbers[chars[index] - '0'];
    value[1] = chars.join('');
    return value;
  }

  parseGeorgianDate() {
    let date = new Date();
    date.setDate(date.getDate() + this.difference);
    let value = date.getDate() + " " + gMonths[date.getMonth()] + "\n" + date.getFullYear();
    let chars = value.split('');
    for (let index in chars)
      if (chars[index] >= '0' && chars[index] <= '9')
        chars[index] = arabicNumbers[chars[index] - '0'];
    return chars.join('');
  }

  parseHijriDate() {
    let hijri = require('hijri');
    let date = hijri.convert(new Date(), this.difference);
    let value = date.dayOfMonth + " " + date.monthText + "\n" + date.year;
    let chars = value.split('');
    for (let index in chars)
      if (chars[index] >= '0' && chars[index] <= '9')
        chars[index] = arabicNumbers[chars[index] - '0'];
    return chars.join('');
  }

  _dayPressed(flag) {
    this.difference += flag ? -1 : 1;
    let value = this.parsePersianDate();
    this.setState({
      todayPersian1: value[0],
      todayPersian2: value[1],
      todayPersian3: value[2],
      todayGeorgian: this.parseGeorgianDate(),
      todayHijri: this.parseHijriDate(),
      sampleData: []
    });
    this._loadSessions();
  }

  render() {
    return (
      <ImageBackground
        source={require('./images/main.png')}
        style={{
          flex: 1,
        }}>
        <View
          style={{
            flex: 2,
            flexDirection: 'row'
          }}>
          <View
            style={{
              flex: 2
            }}>
            <View style={{height: 20, flexDirection: 'row', marginLeft: 20}}>
              <Image style={{width: 15, height: 15, margin: 5}} tintColor={'#FFFFFF'}
                     source={require('./images/ic_back.png')}/>
              <Image style={{width: 15, height: 15, margin: 5}} tintColor={'#FFFFFF'}
                     source={require('./images/small_calendar.png')}/>
              <Image style={{width: 15, height: 15, margin: 5}} tintColor={'#FFFFFF'}
                     source={require('./images/basket.png')}/>
            </View>
            <Text
              style={{
                fontFamily: 'byekan',
                fontSize: 13,
                color: '#FFFFFF',
                width: '100%',
                textAlign: 'center',
                paddingEnd: 10,
                paddingStart: 10,
                marginTop: 25
              }}>
              {this.state.todayGeorgian}
            </Text>
          </View>
          <View
            style={{
              width: 90,
              height: 90,
              borderRadius: 45,
              backgroundColor: '#6f67d9',
              marginTop: 10
            }}>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Text
                style={{
                  fontFamily: 'byekan',
                  fontSize: 13,
                  color: '#FFFFFF',
                  width: '100%',
                  textAlign: 'center',
                  paddingEnd: 10,
                  paddingStart: 10
                }}>
                {this.state.todayPersian1}
              </Text>
              <Text
                style={{
                  fontFamily: 'byekan',
                  fontSize: 40,
                  color: '#FFFFFF',
                  width: '100%',
                  textAlign: 'center',
                  paddingEnd: 10,
                  paddingStart: 10,
                  marginTop: -10
                }}>
                {this.state.todayPersian2}
              </Text>
              <Text
                style={{
                  fontFamily: 'byekan',
                  fontSize: 13,
                  color: '#FFFFFF',
                  width: '100%',
                  textAlign: 'center',
                  paddingEnd: 10,
                  paddingStart: 10,
                  marginTop: -10
                }}>
                {this.state.todayPersian3}
              </Text>
            </View>
          </View>
          <View
            style={{
              flex: 2,
              alignItems: 'flex-end'
            }}>
            <TouchableWithoutFeedback
              onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())}>
              <Image
                style={{
                  width: 20,
                  height: 20,
                  margin: 10,
                  marginRight: 20
                }}
                tintColor={'#FFFFFF'}
                source={require("./images/nav_icon.png")}/>
            </TouchableWithoutFeedback>
            <Text
              style={{
                fontFamily: 'byekan',
                fontSize: 13,
                color: '#FFFFFF',
                width: '100%',
                textAlign: 'center',
                paddingEnd: 10,
                paddingStart: 10,
                marginTop: 15
              }}>
              {this.state.todayHijri}
            </Text>
          </View>
        </View>
        <View
          style={{
            height: 1,
            width: '100%'
          }}/>
        <View
          style={{
            flex: 10,
            backgroundColor: '#FFFFFF',
            marginHorizontal: 20,
            borderRadius: 20,
            marginBottom: 15
          }}>
          <Text
            style={{
              width: '100%',
              textAlign: 'center',
              color: '#6f67d9',
              fontFamily: 'byekan'
            }}>
            روز معلم
          </Text>
          <View style={{height: 1, width: '100%', backgroundColor: '#6f67d9'}}/>
          <FlatList
            style={{
              flex: 1
            }}
            keyExtractor={(item, index) => index.toString()}
            data={this.state.sampleData}
            renderItem={(item) =>
              <CalendarItem
                callback={this._itemClicked}
                share={() => NavigationService.navigate('Share')}
                item={item}/>}
          />
          <Modal
            isVisible={this.state.visible}
            onBackdropPress={() => this.setState({visible: false})}>
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
              <Text style={{
                fontFamily: 'byekan',
                color: '#6f67d9',
                fontSize: 18,
                textAlign: 'center'
              }}>
                خلاصه ای از جلسه
              </Text>
              <View style={{flexDirection: 'row', marginTop: 10}}>
                <Text style={{fontFamily: 'byekan', flex: 1}}>
                  {this.result[0].meeting_title}
                </Text>
                <Text style={{fontFamily: 'byekan', flex: 1}}>
                  عنوان جلسه:
                </Text>
              </View>
              <View style={{flexDirection: 'row', marginTop: 5}}>
                <Text style={{fontFamily: 'byekan', flex: 1}}>
                  {this.result[0].start_time}
                </Text>
                <Text style={{fontFamily: 'byekan', flex: 1}}>
                  ساعت شروع:
                </Text>
              </View>
              <View style={{flexDirection: 'row', marginTop: 5}}>
                <Text style={{fontFamily: 'byekan', flex: 1}}>
                  {this.result[0].end_time}
                </Text>
                <Text style={{fontFamily: 'byekan', flex: 1}}>
                  ساعت پایان:
                </Text>
              </View>
              <View style={{flexDirection: 'row', marginTop: 5}}>
                <Text style={{fontFamily: 'byekan', flex: 1}}>
                  {this.result[0].meeting_owner}
                </Text>
                <Text style={{fontFamily: 'byekan', flex: 1}}>
                  مدیر جلسه:
                </Text>
              </View>
              {this.sessionDetilItem()}
            </View>
          </Modal>
        </View>
        <ActionButton
          buttonColor="rgba(231,76,60,1)"
          onPress={() => NavigationService.navigate('AddNewSession', null)}>
        </ActionButton>
      </ImageBackground>
    );
  }

  sessionDetilItem() {
    let keys = Object.keys(this.people);
    return (
      <View>
        <Text style={{
          fontFamily: 'byekan', textAlign: 'center',
          color: '#6f67d9', marginTop: 10
        }}>
          افراد حاضر در جلسه
        </Text>
        {keys.map((val, index) =>
          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{flex: 1}}/>
            <Text style={{fontFamily: 'byekan'}}>
              {this.people[val].last_name}
            </Text>
            <Text style={{fontFamily: 'byekan'}}>
              {this.people[val].first_name}
            </Text>
            <View style={{flex: 1}}/>
          </View>
        )}
      </View>
    );
  }
}

class MyNotificationsScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Notifications',
    drawerIcon: ({tintColor}) => (
      <Image
        source={require('./images/nav_icon.png')}
        style={{tintColor: tintColor, width: 24, height: 24}}
      />
    ),
  };

  render() {
    return (
      <Button
        onPress={() => this.props.navigation.goBack()}
        title="Go back home"
      />
    );
  }
}

const MyDrawerNavigator = createDrawerNavigator({
  Home: {
    screen: MainPage,
    navigationOptions: ({navigation}) => ({
      title: 'صفحه اصلی',
    }),
  },
  AddNewSession: {
    screen: AddNewSession,
    navigationOptions: ({navigation}) => ({
      title: 'ثبت جلسه جدید',
    }),
  },
  CalendarPage: {
    screen: CalendarPage,
    navigationOptions: ({navigation}) => ({
      title: 'مشاهده تقویم من',
    }),
  },
}, {
  contentComponent: (props) => (
    <View>
      <DrawerItems {...props} />
    </View>
  ),
  drawerPosition: 'right'
});

function mapStateToProps(state) {
  return {
    counter: state
  }
}

export default connect(mapStateToProps, {counterAdd, counterSub})(MyDrawerNavigator);

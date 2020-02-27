import React, {Component} from "react";
import {
  Dimensions, FlatList, Image, ImageBackground, Linking, ScrollView, StyleSheet,
  StatusBar, Text, TouchableOpacity, TouchableWithoutFeedback, View, PermissionsAndroid
} from 'react-native';
import {connect} from "react-redux";
import CalendarItem from "./Components/CalendarItem";
import NavigationService from "../service/NavigationService";
import SplashScreen from 'react-native-splash-screen';
import {createDrawerNavigator, DrawerActions, DrawerItems} from "react-navigation";
import CalendarPage from "./Drawer/CalendarPage";
import RequestCar from "./Drawer/RequestCar";
import DBManager from "../Utils/DBManager";
import {RequestsController} from "../Utils/RequestController";
import Modal from "react-native-modal";
import GestureRecognizer from 'react-native-swipe-gestures';
import PersianCalendarPicker from 'react-native-persian-calendar-picker';
import Globals from "../Utils/Globals";
import firebase from 'react-native-firebase';
import SimpleImage from "./Components/SimpleImage";
import Login from "./Login";
import jalaali from 'jalaali-js';

let months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
let gMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let weekDays = ['یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنج شنبه', 'جمعه', 'شنبه'];
let arabicNumbers = ['۰', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;


class MainPage extends Component {

  static getIconFromLabel(label) { //for Drawer
    if (label === 'پشتیبانی')
      return require("../images/customerService.png");
    else if (label === 'تماس با ما')
      return require("../images/viber.png");
    else if (label === 'پرداخت ها')
      return require("../images/creditCard.png");
    else if (label === 'گزارش گیری')
      return require("../images/newspaper.png");
    else if (label === 'درخواست خودرو')
      return require("../images/sedanCarFront.png");
    else if (label === 'نظرسنجی')
      return require("../images/survey.png");
    else if (label === 'خروج')
      return require("../images/ic_logout.png");
  }

  constructor(props) {
    super(props);
    this.difference = 0;
    this.state = {
      todayPersian1: '___',
      todayPersian2: '___',
      todayPersian3: '___',
      todayGeorgian: '___',
      todayHijri: '___',
      todaySessions: [],
      occasion: '',
      dayoff: false,
      me: {},
      modalVisible: false,
      warning: false,
      datePicker: false,
      loading: true
    };
    this.result = [{people: []}];
    this.deleting = undefined;
    this._init = this._init.bind(this);
    this._init();
    this._dayPressed = this._dayPressed.bind(this);
    this.parseGeorgianDate = this.parseGeorgianDate.bind(this);
    this.parseHijriDate = this.parseHijriDate.bind(this);
    this.parsePersianDate = this.parsePersianDate.bind(this);
    this._loadSessions = this._loadSessions.bind(this);
    this.getCalendarEvents = this.getCalendarEvents.bind(this);
    this._itemClicked = this._itemClicked.bind(this);
    this._checkDelete = this._checkDelete.bind(this);
  }

  async _loadSessions() {
    let date = new Date();
    date.setDate(date.getDate() + this.difference);
    let jalali = jalaali.toJalaali(date);
    let value = jalali.jy + "-" + (jalali.jm < 10 ? '0' + jalali.jm : jalali.jm) + "-" + (jalali.jd < 10 ? '0' + jalali.jd : jalali.jd);
    let result = await RequestsController.MySessions(value);
    result = result.filter((item) => { //server (for some reasens) returns two copies of same session if you are owner
        if (item.owner) return true;
        if (result.some(e => e.owner && e.id === item.id))
          return false;
        return true;
      }
    );
    result.sort(function (a, b) {
      if (a.start_time.substring(11, 16) > b.start_time.substring(11, 16))
        return 1;
      return -1;
    });
    this.setState({todaySessions: result});
  }

  async _itemClicked(id) {
    this.result = await RequestsController.specificSession(id);
    this.setState({modalVisible: true});
  }

  _checkDelete(id) {
    this.deleting = id;
    this.setState({warning: true});
  }

  async componentDidMount() {
    SplashScreen.hide();
    StatusBar.setBackgroundColor('#6A61D1');
    const notificationOpen: NotificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      const notification: Notification = notificationOpen.notification;
      const sDate = notification.data.date;
      const year = parseInt(sDate.substr(0, 4), 10);
      const month = parseInt(sDate.substr(5, 2), 10);
      const day = parseInt(sDate.substr(8, 2), 10);
      const g = jalaali.toGregorian(year, month, day);
      const date = new Date();
      date.setDate(g.gd);
      date.setMonth(g.gm - 1);
      date.setFullYear(g.gy);

      let today = new Date();
      const diffTime = date - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      this.difference = diffDays + 1;
      this.setState({datePicker: false});
      this._dayPressed(true);
    }
    this.routeSubscription = this.props.navigation.addListener('willFocus', this.fetchData,);
    this.fetchData();
    PermissionsAndroid.requestMultiple(
      [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION],
      {
        title: 'موقعیت مکانی',
        message: 'برای ثبت راحت تر جلسه ها روی نقشه، اجازه دسترسی به موقعیت مکانی کاربر نیاز است.'
      }
    ).then(granted => {
      console.log(granted);
    }).catch(err => {
      console.warn(err);
    });
  }

  componentWillUnmount(): void {
    if (this.routeSubscription) {
      this.routeSubscription.remove();
    }
  }

  fetchData = async () => {
    this._loadSessions();
  };

  async checkToken() {
    let token = await DBManager.getSettingValue('token');
    let onboarding = await DBManager.getSettingValue('onboarding', 'N/A');
    if (token === undefined || token === null || token.length !== 40) {
      NavigationService.reset('OnBoarding');
    } else {
      this.setState({loading: false})
    }
    firebase.messaging().getToken()
      .then(fcmToken => {
        if (fcmToken) {
          RequestsController.sendFCMToken(fcmToken);
        } else {
          console.log('error');
        }
      });
    const channel = new firebase.notifications.Android
      .Channel('civilCH', 'جلسات جدید', firebase.notifications.Android.Importance.Max)
      .setDescription('جلسات');
    firebase.notifications().android.createChannel(channel);

    firebase.messaging().onMessage((message: RemoteMessage) => {
      const notification = new firebase.notifications.Notification()
        .android.setChannelId('civilCH')
        .android.setSmallIcon('ic_launcher')
        .android.setBigText(message._data.body)
        .setNotificationId(new Date().getMilliseconds().toString())
        .setTitle('جلسه جدید!')
        .setBody(message._data.body);
      firebase.notifications().displayNotification(notification);
      this._loadSessions();
    });
  }

  static prettifyTime(str) {
    if (str === undefined) return;
    const year = parseInt(str.substr(0, 4), 10);
    const month = parseInt(str.substr(5, 2), 10);
    const day = parseInt(str.substr(8, 2), 10);
    const g = jalaali.toGregorian(year, month, day);
    const date = new Date();
    date.setDate(g.gd);
    date.setMonth(g.gm - 1);
    date.setFullYear(g.gy);
    return (`${weekDays[date.getDay()]} ${day} ${months[month - 1]}`);
  }

  _init() {
    this.checkToken();
    let a = this.parsePersianDate();
    let b = this.parseGeorgianDate();
    let c = this.parseHijriDate();
    this.state.todayPersian1 = a[0];
    this.state.todayPersian2 = a[1];
    this.state.todayPersian3 = a[2];
    this.state.todayGeorgian = b;
    this.state.todayHijri = c;
    this.getCalendarEvents();
    this.setState({
      todayPersian1: this.state.todayPersian1,
      todayPersian2: this.state.todayPersian2,
      todayPersian3: this.state.todayPersian3,
      todayGeorgian: this.state.todayGeorgian,
      todayHijri: this.state.todayHijri
    });
  }

  parsePersianDate() {
    let date = new Date();
    date.setDate(date.getDate() + this.difference);
    let w = date.getDay();
    let jalali = jalaali.toJalaali(date);
    let value = [weekDays[w], jalali.jd + '', months[jalali.jm - 1]];
    let chars = value[1].split('');
    for (let index in chars) if (chars[index] >= '0' && chars[index] <= '9') chars[index] = arabicNumbers[chars[index] - '0'];
    value[1] = chars.join('');
    return value;
  }

  parseGeorgianDate() {
    let date = new Date();
    date.setDate(date.getDate() + this.difference);
    let value = date.getDate() + " " + gMonths[date.getMonth()] + " " + date.getFullYear() + "\n" +
      date.getDate() + " / " + (date.getMonth() + 1) + " / " + date.getFullYear();
    let chars = value.split('');
    return chars.join('');
  }

  parseHijriDate() {
    let hijri = require('hijri');
    let date = hijri.convert(new Date(), this.difference - 1);
    let value = date.dayOfMonth + " " + date.monthText + " " + date.year + "\n" +
      date.year + " / " + date.month + " / " + date.dayOfMonth;
    let chars = value.split('');
    return chars.join('');
  }

  async getCalendarEvents() {
    let hijri = require('hijri');
    let date = new Date();
    date.setDate(date.getDate() + this.difference);
    let jalali = jalaali.toJalaali(date);
    let hDate = hijri.convert(new Date(), this.difference - 1);
    let json = await RequestsController.loadTodayEvents(jalali.jd, jalali.jm, date.getDate(), date.getMonth() + 1,
      hDate.dayOfMonth, hDate.month);
    let flag = false;
    let string = "";
    for (let index = 0; index < json.values.length; index++) {
      if (json.values[index].dayoff) flag = true;
      if (index > 0) string = string + "\n";
      string = string + json.values[index].occasion;
    }
    this.setState({occasion: string, dayoff: flag});
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
      todaySessions: []
    });
    this._loadSessions();
    this.getCalendarEvents();
  }

  render() {
    if (this.state.loading)
      return (<View style={{flex: 1}}/>);
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Globals.PRIMARY_BLUE
        }}
      >
        <ImageBackground
          source={require("../images/main2.png")}
          resizeMode={'contain'}
          style={{
            width: DEVICE_WIDTH,
            height: DEVICE_WIDTH / 3.25,
            flexDirection: 'row'
          }}
        >
          <View style={{flex: 2}}>
            <View
              style={{
                height: 20,
                flexDirection: 'row',
                marginLeft: -20,
              }}
            >
              <View style={{flex: 1}}>
                <TouchableOpacity
                  style={{padding: 5,}}
                  onPress={() => this.setState({datePicker: true})}
                >
                  <Image
                    style={{
                      width: 16,
                      height: 16,
                      margin: 5,
                      alignSelf: 'center',
                      tintColor: 'white'
                    }}
                    source={require('../images/small_calendar.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={{flex: 1}}/>
            </View>
            <View style={{flex: 1}}/>
            <Text
              style={{
                fontSize: 13,
                color: '#FFFFFF',
                width: '100%',
                textAlign: 'center',
                paddingEnd: 40,
                paddingStart: 0,
                marginBottom: 20
              }}
            >
              {this.state.todayGeorgian.substr(0, this.state.todayGeorgian.search("\n"))}
              <Text
                style={{fontFamily: 'arial'}}
              >
                {this.state.todayGeorgian.substr(this.state.todayGeorgian.search("\n"))}
              </Text>
            </Text>
          </View>
          <View
            style={{
              flex: 2,
              alignItems: 'flex-end'
            }}
          >
            <TouchableOpacity
              style={{paddingHorizontal: 10}}
              onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())}>
              <Image
                style={{
                  width: 20,
                  height: 20,
                  margin: 10,
                  marginRight: 20,
                  tintColor: 'white'
                }}
                source={require("../images/nav_icon.png")}
              />
            </TouchableOpacity>
            <View style={{flex: 1}}/>
            <Text
              style={{
                fontFamily: 'byekan',
                fontSize: 13,
                color: '#FFFFFF',
                width: '100%',
                textAlign: 'center',
                paddingEnd: 0,
                paddingStart: 30,
                marginBottom: 20
              }}
            >
              {DBManager.toArabicNumbers(this.state.todayHijri.substr
              (0, this.state.todayHijri.search("\n")))}
              <Text
                style={{fontFamily: 'byekan'}}
              >
                {DBManager.toArabicNumbers(this.state.todayHijri.substr(
                  this.state.todayHijri.search("\n")))}
              </Text>
            </Text>
          </View>
        </ImageBackground>
        <GestureRecognizer
          style={{flex: 10}}
          onSwipeLeft={() => this._dayPressed(true)}
          onSwipeRight={() => this._dayPressed(false)}
        >
          <View
            style={{
              flex: 10,
              backgroundColor: '#FFFFFF',
              marginHorizontal: 20,
              borderRadius: 45,
              marginBottom: 30,
              paddingTop: 15,
              overflow: 'hidden',
              paddingBottom: 5
            }}
          >
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                paddingBottom: 5
              }}
            >
              <Text
                style={{
                  flex: 1,
                  textAlign: 'center',
                  color: '#6f67d9',
                  fontSize: 12,
                  fontFamily: 'byekan',
                }}
              >
                {this.state.occasion}
              </Text>
            </View>
            <View
              style={{
                height: 1,
                width: '100%',
                backgroundColor: '#6f67d9',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            />

            <FlatList
              style={{flex: 1}}
              keyExtractor={(item, index) => item.id}
              data={this.state.todaySessions}
              contentContainerStyle={{flexGrow: 1}}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center'
                  }}
                >
                  <View
                    style={{
                      width: 110,
                      height: 110,
                      position: 'absolute',
                      alignSelf: 'center',
                      backgroundColor: '#e7e6f8',
                      borderRadius: 55
                    }}
                  />
                  <Image
                    style={{
                      width: 100,
                      height: 100,
                      marginTop: 40,
                      marginRight: 32,
                      tintColor: '#6f67d9',
                      borderRadius: 50,
                      alignSelf: 'center',
                    }}
                    source={require('../images/exclamation_point.png')}
                  />
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#6f67d9',
                      fontFamily: 'byekan',
                      fontSize: 18
                    }}
                  >
                    شما برنامه ای ندارید ...!!
                  </Text>
                </View>
              }
              renderItem={(item) =>
                <CalendarItem
                  callback={this._itemClicked}
                  delete={this._checkDelete}
                  share={() => NavigationService.navigate('Share', {session_id: item.item.id})}
                  item={item}
                />
              }
            />
            <Modal
              isVisible={this.state.modalVisible}
              onBackdropPress={() => this.setState({modalVisible: false})}
              onBackButtonPress={() => this.setState({modalVisible: false})}
            >
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  height: '80%',
                  alignItems: 'center',
                  borderRadius: 60,
                  marginStart: 10,
                  marginEnd: 10,
                  paddingStart: 10,
                  paddingEnd: 10,
                  paddingBottom: 5
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    marginVertical: 15,
                    alignItems: 'center'
                  }}
                >
                  <TouchableOpacity
                    onPress={() => this.setState({modalVisible: false})}
                  >
                    <Image
                      style={{
                        height: 20,
                        width: 20,
                        marginLeft: 20,
                        tintColor: '#6f67d9'
                      }}
                      source={require("../images/ic_back.png")}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      fontFamily: 'byekan',
                      fontSize: 20,
                      color: '#6f67d9'
                    }}
                  >
                    خلاصه ای از جلسه
                  </Text>
                  <View
                    style={{
                      marginRight: 30,
                    }}
                  >
                    <Image
                      style={{
                        height: 16,
                        width: 17,
                        tintColor: '#5f5fbe'
                      }}
                      source={require("../images/ic_dialog.png")}
                    />
                  </View>
                </View>
                <View style={{height: 1, width: '90%', backgroundColor: '#CCC'}}/>
                <View style={style.modalItem}>
                  <Text style={style.modalText}>
                    {this.result[0].meeting_title}
                  </Text>
                  <Image
                    style={style.modalImage}
                    source={require('../images/ic_title.png')}/>
                </View>
                <View style={{height: 1, width: '90%', backgroundColor: '#CCC'}}/>
                <View style={style.modalItem}>
                  <Text style={style.modalText}>
                    {MainPage.prettifyTime(this.result[0].start_time)}
                  </Text>
                  <Image
                    style={style.modalImage}
                    source={require('../images/ic_calendar.png')}/>
                </View>
                <View style={{height: 1, width: '90%', backgroundColor: '#CCC'}}/>
                <View style={style.modalItem}>
                  {
                    this.result[0].lat !== '0E-15' &&
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({modalVisible: false});
                        Linking.openURL(`geo:${this.result[0].lat},${this.result[0].lng}?q=${this.result[0].lat},${this.result[0].lng}(${this.result[0].meeting_title})`)
                      }}
                    >
                      <Image
                        style={{height: 40, width: 40}}
                        source={require("../images/ic_launcher.png")}
                      />
                    </TouchableOpacity>
                  }
                  <Text style={style.modalText}>
                    {this.result[0].place_address}
                  </Text>
                  <Image
                    style={style.modalImage}
                    source={require('../images/ic_location.png')}
                  />
                </View>
                <View style={{height: 1, width: '90%', backgroundColor: '#CCC'}}/>
                <View style={style.modalItem}>
                  <Text style={style.modalText}>
                    {this.result[0].start_time === undefined ? '' :
                      `از ساعت ${this.result[0].start_time.substr(11, 5)} تا ساعت ${this.result[0].end_time.substr(11, 5)}`}
                  </Text>
                  <Image
                    style={style.modalImage}
                    source={require('../images/alarm_clock.png')}/>
                </View>
                <View style={{height: 1, width: '90%', backgroundColor: '#CCC'}}/>
                <View style={style.modalItem}>
                  <Text style={style.modalText}>
                    اعضایی که در جلسه حضور دارند
                  </Text>
                  <Image
                    style={style.modalImage}
                    source={require('../images/ic_user.png')}/>
                </View>
                <View style={{height: 2, width: '90%', backgroundColor: Globals.PRIMARY_BLUE}}/>
                {this.sessionDetilItem()}
                <View style={{flex: 1}}/>
                <View style={{height: 1, width: '90%', backgroundColor: '#CCC'}}/>
                <TouchableOpacity
                  onPress={() => this.setState({modalVisible: false})}
                >
                  <View>
                    <Text
                      style={{
                        fontFamily: 'byekan',
                        fontSize: 18,
                        textAlign: 'center',
                        color: Globals.PRIMARY_BLUE,
                        alignSelf: 'center',
                      }}>
                      متوجه شدم
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Modal>
            <Modal
              isVisible={this.state.warning}
              onBackdropPress={() => {
                this.setState({warning: false})
              }}
              onBackButtonPress={() => {
                this.setState({warning: false})
              }}
            >
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 25,
                  marginStart: 10,
                  marginEnd: 10,
                  paddingStart: 10,
                  paddingEnd: 10,
                  paddingBottom: 5
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10
                  }}
                >
                  <TouchableOpacity
                    style={{paddingHorizontal: 10}}
                    onPress={() => {
                      this.setState({warning: false})
                    }}
                  >
                    <Image
                      style={{
                        height: 20,
                        width: 20,
                        marginLeft: 10,
                        tintColor: '#6f67d9'
                      }}
                      source={require("../images/ic_back.png")}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      fontFamily: 'byekan',
                      fontSize: 18,
                      color: '#6f67d9'
                    }}
                  >
                    توجه
                  </Text>
                  <View
                    style={{
                      borderColor: '#6f67d9',
                      borderWidth: 2,
                      height: 24,
                      width: 24,
                      borderRadius: 12,
                      marginRight: 10,
                    }}
                  >
                    <Image
                      style={{
                        height: 20,
                        width: 20,
                        tintColor: '#6f67d9'
                      }}
                      source={require("../images/ic_question.png")}
                    />
                  </View>
                </View>
                <View
                  style={{
                    height: 1,
                    width: '90%',
                    alignSelf: 'center',
                    marginTop: 5,
                    backgroundColor: '#CCC'
                  }}
                />
                <Text
                  style={{
                    fontFamily: 'byekan',
                    fontSize: 18,
                    marginTop: 10,
                    marginHorizontal: 20,
                    marginVertical: 10,
                    color: '#888'
                  }}

                >
                  آیا می خواهید این جلسه را حذف کنید؟
                </Text>
                <View
                  style={{
                    height: 1,
                    width: '90%',
                    alignSelf: 'center',
                    marginTop: 5,
                    backgroundColor: '#CCC'
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    height: 40,
                    alignItems: 'center',
                    width: DEVICE_WIDTH * 0.9
                  }}
                >
                  <TouchableWithoutFeedback
                    onPress={
                      () => this.setState({warning: false})
                    }
                  >
                    <View>
                      <Text
                        style={{
                          fontFamily: 'byekan',
                          fontSize: 17,
                          color: "#e36c35",
                          width: (DEVICE_WIDTH * 0.8) / 2,
                          textAlign: 'center'
                        }}>
                        خیر
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <View
                    style={{
                      height: 40,
                      width: 1,
                      marginTop: 2,
                      backgroundColor: '#CCC'
                    }}
                  />
                  <TouchableWithoutFeedback
                    onPress={async () => {
                      await RequestsController.deleteSession(this.deleting);
                      this.fetchData();
                      this.setState({warning: false})
                    }}>
                    <View>
                      <Text
                        style={{
                          fontFamily: 'byekan',
                          fontSize: 17,
                          color: "#7445e3",
                          width: (DEVICE_WIDTH * 0.8) / 2,
                          textAlign: 'center'
                        }}>
                        بله
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </Modal>
            <Modal
              isVisible={this.state.datePicker}
              onBackdropPress={() => this.setState({datePicker: false})}
              onBackButtonPress={() => this.setState({datePicker: false})}
              backdropOpacity={0.8}
            >
              <View
                style={{
                  backgroundColor: '#FFF',
                  paddingVertical: 20,
                  borderRadius: 20
                }}
              >
                <PersianCalendarPicker
                  isRTL
                  textStyle={{fontFamily: 'byekan'}}
                  onDateChange={(date) => {
                    let today = new Date();
                    const diffTime = date - today;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    this.difference = diffDays + 1;
                    this.setState({datePicker: false});
                    this._dayPressed(true);
                  }}
                />
              </View>
            </Modal>
          </View>
        </GestureRecognizer>
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 10,
            height: 50,
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            onPress={() => {
              NavigationService.navigate('AddNewSession');
            }}
          >
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: '#6d6dd9',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Image
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: '#7C7AF2',
                  borderWidth: 2,
                }}
                source={require("../images/ic_add.png")}
              />
            </View>
          </TouchableOpacity>
        </View>
        <TouchableWithoutFeedback
          onPress={() => {
            if (this.difference === 0) return;
            this.difference = 1;
            this._dayPressed(true);
          }}
        >
          <View
            style={{
              position: 'absolute',
              width: DEVICE_WIDTH / 3.75,
              height: DEVICE_WIDTH / 3.75,
              borderRadius: DEVICE_WIDTH / 7.5,
              top: 0,
              left: (DEVICE_WIDTH - DEVICE_WIDTH / 3.75) / 2 - 2,
              backgroundColor: '#866ef6',
              zIndex: 100,
              marginTop: (DEVICE_WIDTH / 3.25) * 0.22,
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: 'center'
              }}
            >
              <Text
                style={{
                  fontFamily: 'byekan',
                  fontSize: 15,
                  color: this.state.dayoff || this.state.todayPersian1 === 'جمعه' ? '#ff5a41' : '#FFFFFF',
                  width: '100%',
                  textAlign: 'center',
                  paddingEnd: 10,
                  paddingStart: 10
                }}
              >
                {this.state.todayPersian1}
              </Text>
              <Text
                style={{
                  fontFamily: 'byekan',
                  fontSize: 35,
                  color: this.state.dayoff || this.state.todayPersian1 === 'جمعه' ? '#ff5a41' : '#FFFFFF',
                  width: '100%',
                  textAlign: 'center',
                  paddingEnd: 10,
                  paddingStart: 10,
                  marginTop: -15,
                }}>
                {this.state.todayPersian2}
              </Text>
              <Text
                style={{
                  fontFamily: 'byekan',
                  fontSize: 15,
                  color: this.state.dayoff || this.state.todayPersian1 === 'جمعه' ? '#ff5a41' : '#FFFFFF',
                  width: '100%',
                  textAlign: 'center',
                  paddingEnd: 10,
                  paddingStart: 10,
                  marginTop: -15
                }}>
                {this.state.todayPersian3}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>);
  }

  sessionDetilItem() {
    return (
      <ScrollView>
        <View style={{flex: 1}}>
          {this.result[0].people.map((val, index) =>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingTop: 5,
                  paddingBottom: 5,
                }}
              >
                {!this.result[0].people[index].rep_last_name &&
                <Image
                  source={require("../images/ic_visibility.png")}
                  style={{
                    height: 20,
                    width: 20,
                    marginLeft: 20,
                    tintColor: this.result[0].people[index].seen &&
                    !this.result[0].people[index].rep_last_name ? '#000' : '#CCC'
                  }}
                />
                }
                <Text
                  style={{
                    flex: 1,
                    fontFamily: 'byekan',
                    textAlign: 'right',
                    color: this.result[0].people[index].rep_last_name ? 'rgba(145,107,255,0.44)' : '#6f67d9',
                  }}
                >
                  {this.result[0].people[index].first_name + " " + this.result[0].people[index].last_name}
                </Text>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    overflow: 'hidden',
                    borderWidth: 3,
                    borderColor: '#00b',
                    marginRight: 25,
                    marginVertical: 5,
                    marginLeft: 5
                  }}
                >
                  <Image
                    style={{
                      width: 44,
                      height: 44,
                      resizeMode: 'cover',
                    }}
                    source={{uri: this.result[0].people[index].image}}
                  />
                </View>
              </View>
              {this.result[0].people[index].rep_last_name &&
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingBottom: 5,
                  marginTop: -50
                }}>
                <Image
                  source={require("../images/ic_visibility.png")}
                  style={{
                    height: 20,
                    width: 20,
                    marginLeft: 20,
                    tintColor: this.result[0].people[index].rep_seen &&
                    !this.result[0].people[index].rep_last_name ? '#000' : '#CCC'
                  }}
                  resizeMode={"cover"}
                />
                <Text
                  style={{
                    flex: 1,
                    fontFamily: 'byekan',
                    textAlign: 'right',
                    color: '#6f67d9'
                  }}
                >
                  {this.result[0].people[index].rep_first_name + " " + this.result[0].people[index].rep_last_name}
                </Text>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    overflow: 'hidden',
                    borderWidth: 3,
                    borderColor: '#00b',
                    marginRight: 25,
                    marginVertical: 5,
                    marginLeft: 5
                  }}
                >
                  <Image
                    style={{
                      width: 44,
                      height: 44,
                      resizeMode: 'cover',
                    }}
                    source={{uri: this.result[0].people[index].rep_image}}/>
                </View>
              </View>
              }
              <View style={{height: 1, width: '90%', backgroundColor: '#CCC'}}/>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}

const MyDrawerNavigator = createDrawerNavigator({
    Home: {
      screen: MainPage, navigationOptions: ({navigation}) => ({
        title: 'پشتیبانی',
      }),
    }, Test: {
      screen: CalendarPage, navigationOptions: ({navigation}) => ({
        title: 'پرداخت ها',
      }),
    }, Test2: {
      screen: RequestCar, navigationOptions: ({navigation}) => ({
        title: 'درخواست خودرو',
      }),
    }, Test3: {
      screen: CalendarPage, navigationOptions: ({navigation}) => ({
        title: 'نظرسنجی',
      }), CalendarPage: {
        screen: CalendarPage, navigationOptions: ({navigation}) => ({
          title: 'تماس با ما',
        }),
      },
    }, Logout: {
      screen: Login, navigationOptions: ({navigation}) => ({
        title: 'خروج',
      }),
    }
  },
  {
    drawerBackgroundColor: '#FFFFFF00',
    drawerWidth: DEVICE_WIDTH * 0.7,
    contentComponent: (props) =>
      (
        <ImageBackground
          source={require("../images/drawer.png")}
          resizeMode='stretch'
          style={{
            flex: 1,
            paddingStart: DEVICE_WIDTH * 0.1
          }}
        >
          <View
            style={{
              flex: 1,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <SimpleImage/>
          </View>
          <DrawerItems
            {...props}
            getLabel={(scene) => (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '85%',
                    paddingVertical: 10
                  }}
                >
                  <Text
                    style={{
                      width: '80%',
                      fontFamily: 'byekan',
                      color: '#FFF'
                    }}
                  >
                    {props.getLabel(scene)}
                  </Text>
                  <Image
                    style={{
                      height: 16,
                      width: 16,
                      marginRight: 20,
                      marginLeft: 10,
                      alignSelf: 'center',
                      tintColor: '#FFF'
                    }}
                    source={MainPage.getIconFromLabel(props.getLabel(scene))}
                  />
                </View>
                <View
                  style={{
                    height: 1,
                    backgroundColor: '#FFF',
                    width: '85%'
                  }}
                />
              </View>
            )}
          />
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Image
              style={{
                width: 100,
                height: 100,
                resizeMode: 'contain'
              }}
              source={require('../images/logo_main.png')}
            />
          </View>
        </ImageBackground>
      ),
    contentOptions: {
      itemStyle: {justifyContent: 'flex-end'},
      inactiveBackgroundColor: 'argba(0,0,0,0)',
      activeBackgroundColor: 'argba(0,0,0,0)',
      inactiveLabelStyle: {fontFamily: 'byekan', textAlign: 'right', color: '#CCC'},
      activeLabelStyle: {fontFamily: 'byekan', textAlign: 'right', color: '#FFF'},
      labelStyle: {fontFamily: 'byekan', textAlign: 'right', color: '#FFF'},
    },
    drawerPosition: 'right'
  });

const style = StyleSheet.create({
  modalItem: {
    flexDirection: 'row',
    marginVertical: 10,
    paddingRight: 15
  },
  modalText: {
    fontFamily: 'byekan',
    flex: 1,
    textAlign: 'right'
  },
  modalImage: {
    width: 16,
    height: 13,
    margin: 5,
    marginLeft: 20,
    resizeMode: 'contain',
    tintColor: '#CCC'
  }
});

function mapStateToProps(state) {
  return {
    counter: state
  }
}

export default connect(mapStateToProps, {})(MyDrawerNavigator);

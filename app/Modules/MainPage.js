import React, {Component} from "react";
import {
  Button,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import {connect} from "react-redux";
import {counterAdd, counterSub} from "../actions";
import CalendarItem from "./Components/CalendarItem";
import NavigationService from "../service/NavigationService";
import SplashScreen from 'react-native-splash-screen';
import {createDrawerNavigator, DrawerActions, DrawerItems} from "react-navigation";
import AddNewSession from "./AddNewSession";
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

let months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
let gMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let weekDays = ['یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنج شنبه', 'جمعه', 'شنبه'];
let arabicNumbers = ['۰', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;


class MainPage extends Component {

  static getIconFromLabel(label) {
    if (label === 'صفحه اصلی')
      return require("../images/customerService.png");
    else if (label === 'تماس با ما')
      return require("../images/viber.png");
    else if (label === 'پرداخت ها')
      return require("../images/crediCard.png");
    else if (label === 'گزارش گیری')
      return require("../images/newspaper.png");
    else if (label === 'درخواست خودرو')
      return require("../images/sedanCarFront.png");
    else if (label === 'نظرسنجی')
      return require("../images/survey.png");
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
      sampleData: [],
      occasion: '',
      dayoff: false,
      me: {},
      visible: false,
      warning: false,
      datePicker: false
    };
    this.result = [{people: []}];
    this.deleting = undefined;
    this._dayPressed = this._dayPressed.bind(this);
    this._init = this._init.bind(this);
    this.parseGeorgianDate = this.parseGeorgianDate.bind(this);
    this.parseHijriDate = this.parseHijriDate.bind(this);
    this.parsePersianDate = this.parsePersianDate.bind(this);
    this._loadSessions = this._loadSessions.bind(this);
    this.getCalendarEvents = this.getCalendarEvents.bind(this);
    this._init = this._init.bind(this);
    this._itemClicked = this._itemClicked.bind(this);
    this._checkDelete = this._checkDelete.bind(this);
    this._init();
  }

  async _loadSessions() {
    let jalaali = require('jalaali-js');
    let date = new Date();
    date.setDate(date.getDate() + this.difference);
    let jalali = jalaali.toJalaali(date);
    let value = jalali.jy + "-" + (jalali.jm < 10 ? '0' + jalali.jm : jalali.jm) + "-" + (jalali.jd < 10 ? '0' + jalali.jd : jalali.jd);
    let result = await RequestsController.MySessions(value);
    result = result.filter((item) => {
        if (item.owner) return true;
        if (result.some(e => e.owner && e.id === item.id))
          return false;
        return true;
      }
    );
    this.setState({sampleData: result});
  }

  async _itemClicked(id) {
    this.result = await RequestsController.specificSession(id);
    this.setState({visible: true});
  }

  async _checkDelete(id) {
    this.deleting = id;
    this.setState({warning: true});
  }

  async componentDidMount() {
    RequestsController.loadTodayEvents();
    SplashScreen.hide();
    await this.checkToken();
    StatusBar.setBackgroundColor('#6A61D1');
    this.routeSubscription = this.props.navigation.addListener('willFocus', this.fetchData,);
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
    console.log('error');
    firebase.messaging().getToken()
      .then(fcmToken => {
        if (fcmToken) {
          RequestsController.sendFCMToken(fcmToken);
        } else {
          console.log('error');
        }
      });
    firebase.messaging().onMessage((message: RemoteMessage) => {
      const notification = new firebase.notifications.Notification()
        .android.setChannelId('channelId')
        .android.setSmallIcon('ic_launcher')
        .android.setBigText(message._data.body)
        .setNotificationId('notificationId')
        .setTitle('جلسه جدید!')
        .setBody(message._data.body);
      firebase.notifications().displayNotification(notification);
    });
    let token = await DBManager.getSettingValue('token');
    if (token === undefined || token === null || token.length !== 40) NavigationService.navigate('Login', null);
  }

  static prettifyTime(str) {
    if (str === undefined) return;
    const year = parseInt(str.substr(0, 4), 10);
    const month = parseInt(str.substr(6, 2), 10);
    const day = parseInt(str.substr(8, 2), 10);
    let jalaali = require('jalaali-js');
    const g = jalaali.toGregorian(year, month, day);
    const date = new Date();
    date.setDate(g.gd);
    date.setMonth(g.gm - 1);
    date.setFullYear(g.gy);
    return (`${weekDays[date.getDay()]} ${day} ${months[month - 1]}`);
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
    let jalaali = require('jalaali-js');
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
    let value = date.getDate() + " " + gMonths[date.getMonth()] + " " + date.getFullYear() + "\n" + date.getDate() + " / " + date.getMonth() + " / " + date.getFullYear();
    let chars = value.split('');
    return chars.join('');
  }

  parseHijriDate() {
    let hijri = require('hijri');
    let date = hijri.convert(new Date(), this.difference);
    let value = date.dayOfMonth + " " + date.monthText + " " + date.year + "\n" + date.year + " / " + date.month + " / " + date.dayOfMonth;
    let chars = value.split('');
    return chars.join('');
  }

  async getCalendarEvents() {
    let jalaali = require('jalaali-js');
    let hijri = require('hijri');
    let date = new Date();
    date.setDate(date.getDate() + this.difference);
    let jalali = jalaali.toJalaali(date);
    let hDate = hijri.convert(new Date(), this.difference);
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
      sampleData: []
    });
    this._loadSessions();
    this.getCalendarEvents();
  }

  render() {
    return (
      <ImageBackground
        source={require('../images/main.png')}
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
            <View
              style={{
                height: 20,
                flexDirection: 'row',
                marginLeft: 10,
              }}
            >
              <View style={{flex: 1}}>
                <TouchableOpacity
                  style={{
                    padding: 5,
                  }}
                  onPress={() => this.setState({datePicker: true})}
                >
                  <Image
                    style={{
                      width: 16,
                      height: 16,
                      margin: 5,
                      alignSelf: 'center',
                    }}
                    tintColor={'#FFFFFF'}
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
              }}>
              {this.state.todayGeorgian.substr(0, this.state.todayGeorgian.search("\n"))}
              <Text
                style={{
                  fontFamily: 'arial'
                }}
              >
                {this.state.todayGeorgian.substr(this.state.todayGeorgian.search("\n"))}
              </Text>
            </Text>
          </View>
          <View
            style={{
              flex: 2, alignItems: 'flex-end'
            }}>
            <TouchableWithoutFeedback
              onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())}>
              <Image
                style={{
                  width: 20, height: 20, margin: 10, marginRight: 20
                }}
                tintColor={'#FFFFFF'}
                source={require("../images/nav_icon.png")}/>
            </TouchableWithoutFeedback>
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
              }}>
              {this.state.todayHijri.substr(0, this.state.todayHijri.search("\n"))}
              <Text
                style={{
                  fontFamily: 'arial'
                }}
              >
                {this.state.todayHijri.substr(this.state.todayHijri.search("\n"))}
              </Text>
            </Text>
          </View>
        </View>
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
            }}>
            <View
              style={{
                width: '100%', flexDirection: 'row', alignItems: 'center', paddingBottom: 5
              }}
            >
              <Text
                style={{
                  flex: 1,
                  textAlign: 'center',
                  color: '#6f67d9',
                  fontSize:12,
                  fontFamily: 'byekan',
                }}>
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
              style={{
                flex: 1
              }}
              keyExtractor={(item, index) => item.id}
              data={this.state.sampleData}
              contentContainerStyle={{flexGrow: 1}}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={{flex: 1, justifyContent: 'center'}}>
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
                    tintColor={'#6f67d9'}
                    source={require('../images/exclamation_point.png')}
                  />
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#6f67d9',
                      fontFamily: 'byekan',
                      fontSize: 18
                    }}>
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
              isVisible={this.state.visible}
              onBackdropPress={() => this.setState({visible: false})}
              onBackButtonPress={() => this.setState({visible: false})}
            >
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  height: '80%',
                  alignItems: 'center',
                  borderRadius: 10,
                  marginStart: 10,
                  marginEnd: 10,
                  paddingStart: 10,
                  paddingEnd: 10,
                  paddingBottom: 5
                }}>
                <Text
                  style={{
                    fontFamily: 'byekan', color: '#6f67d9', fontSize: 18, textAlign: 'center'
                  }}>
                  خلاصه ای از جلسه
                </Text>
                <View style={{flexDirection: 'row', marginVertical: 10}}>
                  <Text style={{fontFamily: 'byekan', flex: 1, textAlign: 'right'}}>
                    {this.result[0].meeting_title}
                  </Text>
                  <Image
                    style={{width: 12, height: 12, margin: 5, marginLeft: 20}}
                    tintColor={'#CCC'}
                    source={require('../images/ic_title.png')}/>
                </View>
                <View style={{height: 1, width: '80%', backgroundColor: '#CCC'}}/>
                <View style={{flexDirection: 'row', marginVertical: 10}}>
                  <Text style={{fontFamily: 'byekan', flex: 1}}>
                    {MainPage.prettifyTime(this.result[0].start_time)}
                  </Text>
                  <Image
                    style={{width: 12, height: 12, margin: 5, marginLeft: 20}}
                    tintColor={'#CCC'}
                    source={require('../images/ic_calendar.png')}/>
                </View>
                <View style={{height: 1, width: '80%', backgroundColor: '#CCC'}}/>
                <View style={{flexDirection: 'row', marginVertical: 10}}>
                  <Text style={{fontFamily: 'byekan', flex: 1}}>
                    {this.result[0].start_time === undefined ? '' : `از ساعت ${this.result[0].start_time.substr(12, 5)} تا ساعت${this.result[0].end_time.substr(12, 5)}`}
                  </Text>
                  <Image
                    style={{width: 12, height: 12, margin: 5, marginLeft: 20}}
                    tintColor={'#CCC'}
                    source={require('../images/ic_clock.png')}/>
                </View>
                <View style={{height: 1, width: '80%', backgroundColor: '#CCC'}}/>
                <View style={{flexDirection: 'row', marginVertical: 10}}>
                  {
                    this.result[0].lat !== '0E-15' &&
                    <Button
                      title={'مشاهده روی نقشه'}
                      onPress={() => {
                        this.setState({visible: false});
                        NavigationService.navigate('Show', {
                          centerX: parseFloat(this.result[0].lng),
                          centerY: parseFloat(this.result[0].lat)
                        })
                      }}
                    />
                  }
                  <Text style={{fontFamily: 'byekan', flex: 1, textAlign: 'right'}}>
                    {this.result[0].place_address}
                  </Text>
                  <Image
                    style={{width: 12, height: 12, margin: 5, marginLeft: 20}}
                    tintColor={'#CCC'}
                    source={require('../images/ic_location.png')}
                  />
                </View>
                <View style={{height: 1, width: '80%', backgroundColor: '#CCC'}}/>
                <View style={{flexDirection: 'row', marginVertical: 10}}>
                  <Text style={{fontFamily: 'byekan', flex: 1}}>
                    افرادی که در جلسه حضور دارند
                  </Text>
                  <Image
                    style={{width: 12, height: 12, margin: 5, marginLeft: 20}}
                    tintColor={'#CCC'}
                    source={require('../images/ic_location.png')}/>
                </View>
                {this.sessionDetilItem()}
              </View>
            </Modal>
            <Modal
              isVisible={this.state.warning}
              onBackdropPress={() => {
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
                    flexDirection: 'row', marginTop: 10
                  }}
                >
                  <Image
                    style={{
                      height: 20, width: 20, marginLeft: 10, tintColor: '#6f67d9'
                    }}
                    source={require("../images/ic_back.png")}
                  />
                  <Text
                    style={{
                      flex: 1, textAlign: 'center', fontFamily: 'byekan', color: '#6f67d9'
                    }}
                  >
                    توجه
                  </Text>
                  <View
                    style={{
                      borderColor: '#6f67d9', borderWidth: 2, borderRadius: 12, marginRight: 10,
                    }}
                  >
                    <Image
                      style={{
                        height: 20, width: 20, tintColor: '#6f67d9'
                      }}
                      source={require("../images/ic_question.png")}
                    />
                  </View>
                </View>
                <View
                  style={{
                    height: 1, width: '90%', alignSelf: 'center', marginTop: 5, backgroundColor: '#CCC'
                  }}
                />
                <Text
                  style={{
                    fontFamily: 'byekan',
                    fontSize: 20,
                    marginTop: 10,
                    marginHorizontal: 20,
                    marginVertical: 10,
                    color: '#888'
                  }}>
                  آیا حذف جلسه انتخابی را تایید می کنید؟
                </Text>
                <View
                  style={{
                    height: 1, width: '90%', alignSelf: 'center', marginTop: 5, backgroundColor: '#CCC'
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row', height: 40, alignItems: 'center', width: DEVICE_WIDTH * 0.9
                  }}>
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
                      height: 40, width: 1, marginTop: 2, backgroundColor: '#CCC'
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
          <TouchableWithoutFeedback
            onPress={() => {
              NavigationService.navigate('AddNewSession');
              console.log(new Date().getTime());
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
          </TouchableWithoutFeedback>
        </View>
        <TouchableWithoutFeedback
          onPress={() => {
            this.difference = 1;
            this._dayPressed(true);
          }}
        >
          <View
            style={{
              position: 'absolute',
              width: DEVICE_WIDTH / 3.25,
              height: DEVICE_WIDTH / 3.25,
              borderRadius: DEVICE_WIDTH / 6.5,
              top: 0,
              left: (DEVICE_WIDTH - DEVICE_WIDTH / 3.25) / 2,
              right: (DEVICE_WIDTH - DEVICE_WIDTH / 3.25) / 2,
              backgroundColor: '#866ef6',
              zIndex: 100,
              marginTop: DEVICE_HEIGHT / 25,
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
                  fontSize: 40,
                  color: this.state.dayoff || this.state.todayPersian1 === 'جمعه' ? '#ff5a41' : '#FFFFFF',
                  width: '100%',
                  textAlign: 'center',
                  paddingEnd: 10,
                  paddingStart: 10,
                  marginTop: -15
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
      </ImageBackground>);
  }

  sessionDetilItem() {
    return (
      <ScrollView>
        <View style={{flex: 1}}>
          {this.result[0].people.map((val, index) =>
            <View
              style={{
                alignItems: 'center'
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  borderRadius: 10,
                  paddingTop: 5,
                  paddingBottom: 5,
                }}>
                <Text style={{fontFamily: 'byekan', color: this.result[0].people[index].seen ? '#27ffac' : '#ff8125'}}>
                  ✓
                </Text>
                <Text
                  style={{
                    flex: 1, fontFamily: 'byekan', textAlign: 'right', color: '#6f67d9'
                  }}>
                  {this.result[0].people[index].last_name + " " + this.result[0].people[index].first_name}
                </Text>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    overflow: 'hidden',
                    borderWidth: 2,
                    borderColor: '#00b',
                    margin: 5,
                  }}
                >
                  <Image
                    style={{
                      width: 50, height: 50, resizeMode: 'contain',
                    }}
                    source={{uri: this.result[0].people[index].image}}/>
                </View>
              </View>
              {this.result[0].people[index].rep_last_name &&
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{
                  color: Globals.PRIMARY_BLUE,
                  fontSize: DBManager.RFValue(12),
                  fontFamily: 'byekan',
                  textAlign: 'right'
                }}>
                  اشتراک گذاشته شد
                </Text>
                < Image
                  style={{
                    width: 50,
                    height: 50,
                    resizeMode: 'contain',
                    tintColor: Globals.PRIMARY_BLUE,
                    transform: [{rotate: '90deg'}]
                  }}
                  source={require("../images/arrow.png")}/>

              </View>
              }
              {this.result[0].people[index].rep_last_name &&
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  borderRadius: 10,
                  paddingBottom: 5,
                }}>
                <Text
                  style={{
                    fontFamily: 'byekan',
                    color: this.result[0].people[index].rep_seen ? '#27ffac' : '#ff8125'
                  }}>
                  ✓
                </Text>
                <Text
                  style={{
                    flex: 1, fontFamily: 'byekan', textAlign: 'right', color: '#6f67d9'
                  }}>
                  {this.result[0].people[index].rep_last_name + " " + this.result[0].people[index].rep_first_name}
                </Text>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    overflow: 'hidden',
                    borderWidth: 2,
                    borderColor: '#00b',
                    margin: 5,
                  }}
                >
                  <Image
                    style={{
                      width: 50, height: 50, resizeMode: 'contain',
                    }}
                    source={{uri: this.result[0].people[index].rep_image}}/>
                </View>
              </View>
              }
              < View style={{height: 1, width: '90%', backgroundColor: '#CCC'}}/>
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
        title: 'صفحه اصلی',
      }),
    }, CalendarPage: {
      screen: CalendarPage, navigationOptions: ({navigation}) => ({
        title: 'تماس با ما',
      }),
    }, Test: {
      screen: CalendarPage, navigationOptions: ({navigation}) => ({
        title: 'پرداخت ها',
      }),
    }, Test1: {
      screen: CalendarPage, navigationOptions: ({navigation}) => ({
        title: 'گزارش گیری',
      }),
    }, Test2: {
      screen: RequestCar, navigationOptions: ({navigation}) => ({
        title: 'درخواست خودرو',
      }),
    }, Test3: {
      screen: CalendarPage, navigationOptions: ({navigation}) => ({
        title: 'نظرسنجی',
      }),
    },
  },
  {
    drawerBackgroundColor: '#FFFFFF00',
    drawerWidth: DEVICE_WIDTH * 0.6,
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
            }}>
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                borderWidth: 2,
                borderColor: '#FFF',
                overflow: 'hidden'
              }}
            >
              <SimpleImage/>
            </View>
          </View>
          <DrawerItems
            {...props}
            getLabel={(scene) => (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
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
                      height: 20,
                      width: 20,
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
                width: 150,
                height: 150,
                borderRadius: 75,
                resizeMode: 'contain'
              }}
              source={require('../images/ic_launcher.png')}
            />
          </View>
        </ImageBackground>
      ),
    contentOptions: {
      itemStyle: {justifyContent: 'flex-end'},
      inactiveLabelStyle: {fontFamily: 'byekan', textAlign: 'right', color: '#CCC'},
      activeLabelStyle: {fontFamily: 'byekan', textAlign: 'right', color: '#FFF'},
      labelStyle: {fontFamily: 'byekan', textAlign: 'right', color: '#FFF'},
    },
    drawerPosition: 'right'
  });

function mapStateToProps(state) {
  return {
    counter: state
  }
}

export default connect(mapStateToProps, {counterAdd, counterSub})(MyDrawerNavigator);

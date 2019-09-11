import React, {Component} from "react";
import {
  Text, View, FlatList, Image, TouchableWithoutFeedback, StatusBar, Button, ImageBackground, Dimensions
} from 'react-native';
import {connect} from "react-redux";
import {counterAdd, counterSub} from "../actions";
import CalendarItem from "./Components/CalendarItem";
import NavigationService from "../service/NavigationService";
import SplashScreen from 'react-native-splash-screen';
import {createDrawerNavigator, DrawerItems, DrawerActions} from "react-navigation";
import AddNewSession from "./AddNewSession";
import CalendarPage from "./Drawer/CalendarPage";
import RequestCar from "./Drawer/RequestCar";
import DBManager from "../Utils/DBManager";
import {RequestsController} from "../Utils/RequestController";
import Modal from "react-native-modal";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

let months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
let gMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let weekDays = ['یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنج شنبه', 'جمعه', 'شنبه'];
let arabicNumbers = ['۰', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

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
    this.result = [{people: []}];
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
    let value = jalali.jy + "-" + (jalali.jm < 10 ? '0' + jalali.jm : jalali.jm) + "-" + (jalali.jd < 10 ? '0' + jalali.jd : jalali.jd);
    let result = await RequestsController.MySessions(value);
    this.setState({sampleData: result});
  }

  async _itemClicked(id) {
    this.result = await RequestsController.specificSession(id);
    this.setState({visible: true});
  }

  async componentDidMount() {
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
                height: 20, flexDirection: 'row', marginLeft: 20
              }}
            >
              <Image
                style={{
                  width: 15, height: 15, margin: 5
                }}
                tintColor={'#FFFFFF'}
                source={require('../images/ic_back.png')}
              />
              <Image
                style={{
                  width: 15, height: 15, margin: 5
                }}
                tintColor={'#FFFFFF'}
                source={require('../images/small_calendar.png')}
              />
              <Image
                style={{
                  width: 15, height: 15, margin: 5
                }}
                tintColor={'#FFFFFF'}
                source={require('../images/basket.png')}
              />
            </View>
            <Text
              style={{
                fontSize: 13,
                color: '#FFFFFF',
                width: '100%',
                textAlign: 'center',
                paddingEnd: 30,
                paddingStart: 0,
                marginTop: 35
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
                  width: 20, height: 20, margin: 10, marginRight: 30, transform: [{rotateY: '180deg'}]
                }}
                tintColor={'#FFFFFF'}
                source={require("../images/nav_icon.png")}/>
            </TouchableWithoutFeedback>
            <Text
              style={{
                fontFamily: 'byekan',
                fontSize: 13,
                color: '#FFFFFF',
                width: '100%',
                textAlign: 'center',
                paddingEnd: 0,
                paddingStart: 30,
                marginTop: 15
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
        <View
          style={{
            flex: 10,
            backgroundColor: '#FFFFFF',
            marginHorizontal: 20,
            borderRadius: 20,
            marginBottom: 30,
            paddingTop: 15,
          }}>
          <View
            style={{
              width: '100%', flexDirection: 'row', alignItems: 'center', paddingBottom: 5
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => this._dayPressed(true)}
            >
              <View
                style={{
                  width: 30, height: 30, borderRadius: 15, borderWidth: 1, backgroundColor: '#6f67d9',
                  alignItems: 'center', justifyContent: 'center', marginLeft: 15
                }}
              >
                <Image
                  style={{
                    width: 20, height: 20,
                  }}
                  tintColor={'#FFF'}
                  source={require('../images/ic_back.png')}
                />
              </View>
            </TouchableWithoutFeedback>
            <Text
              style={{
                flex: 1, textAlign: 'center', color: '#6f67d9', fontFamily: 'byekan',
              }}>
              روز معلم
            </Text>
            <TouchableWithoutFeedback
              onPress={() => this._dayPressed(false)}
            >
              <View
                style={{
                  width: 30, height: 30, borderRadius: 15, borderWidth: 1, backgroundColor: '#6f67d9',
                  alignItems: 'center', justifyContent: 'center', marginRight: 15
                }}
              >
                <Image
                  style={{
                    width: 20, height: 20, transform: [{rotateY: '180deg'}],
                  }}
                  tintColor={'#FFF'}
                  source={require('../images/ic_back.png')}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View
            style={{
              height: 1, width: '100%', backgroundColor: '#6f67d9', flexDirection: 'row', alignItems: 'center'
            }}/>

          <FlatList
            style={{
              flex: 1
            }}
            keyExtractor={(item, index) => index.toString()}
            data={this.state.sampleData}
            renderItem={(item) => <CalendarItem
              callback={this._itemClicked}
              share={() => NavigationService.navigate('Share', {session_id: item.item.id})}
              item={item}/>}
          />
          <Modal
            isVisible={this.state.visible}
            onBackdropPress={() => this.setState({visible: false})}
            onBackButtonPress={() => this.setState({visible: false})}>
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
                <Text style={{fontFamily: 'byekan', flex: 1, textAlign: 'right'}}>
                  {this.result[0].place_address}
                </Text>
                <Image
                  style={{width: 12, height: 12, margin: 5, marginLeft: 20}}
                  tintColor={'#CCC'}
                  source={require('../images/ic_location.png')}/>
              </View>
              <View style={{height: 1, width: '80%', backgroundColor: '#CCC'}}/>
              {this.sessionDetilItem()}
            </View>
          </Modal>
        </View>
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
            onPress={() => NavigationService.navigate('AddNewSession')}
          >
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: '#7C7AF2',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Image
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  tintColor: '#FFFFFF',
                  backgroundColor: '#7C7AF2',
                  borderWidth: 2,
                  borderColor: '#FFFFFF'
                }}
                source={require("../images/ic_add.png")}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View
          style={{
            position: 'absolute',
            width: DEVICE_WIDTH / 4,
            height: DEVICE_WIDTH / 4,
            borderRadius: DEVICE_WIDTH / 8,
            top: 0,
            left: (DEVICE_WIDTH - DEVICE_WIDTH / 4) / 2,
            right: (DEVICE_WIDTH - DEVICE_WIDTH / 4) / 2,
            backgroundColor: '#6f67d9',
            zIndex: 100,
            marginTop: DEVICE_HEIGHT / 30
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
                fontSize: 13,
                color: '#FFFFFF',
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
      </ImageBackground>);
  }

  sessionDetilItem() {
    return (<View>
      <View style={{flexDirection: 'row', marginVertical: 10}}>
        <Text style={{fontFamily: 'byekan', flex: 1}}>
          افرادی که در جلسه حضور دارند
        </Text>
        <Image
          style={{width: 12, height: 12, margin: 5, marginLeft: 20}}
          tintColor={'#CCC'}
          source={require('../images/ic_location.png')}/>
      </View>
      <View style={{height: 1, width: '90%', backgroundColor: '#CCC'}}/>
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
          <Text
            style={{
              flex: 1, fontFamily: 'byekan', textAlign: 'right', color: '#6f67d9'
            }}>
            {this.result[0].meeting_owner}
          </Text>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              overflow: 'hidden',
              borderWidth: 2,
              borderColor: '#00b',
              margin: 10,
            }}
          >
            <Image
              style={{
                width: 50, height: 50, resizeMode: 'contain',
              }}
              source={{uri: this.result[0].owner_image}}/>
          </View>
        </View>
        <View style={{height: 1, width: '90%', backgroundColor: '#CCC'}}/>
      </View>
      {this.result[0].people.map((val, index) => <View
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
              margin: 10,
            }}
          >
            <Image
              style={{
                width: 50, height: 50, resizeMode: 'contain',
              }}
              source={{uri: this.result[0].people[index].image}}/>
          </View>
        </View>
        <View style={{height: 1, width: '90%', backgroundColor: '#CCC'}}/>
      </View>)}
    </View>);
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
}, {
  drawerBackgroundColor: '#FFFFFF00', drawerWidth: DEVICE_HEIGHT / 2.5, contentComponent: (props) => (<ImageBackground
    source={require("../images/drawer.png")}
    resizeMode='contain'
    style={{
      flex: 1, paddingStart: DEVICE_HEIGHT * 0.14
    }}
  >
    <View
      style={{
        flex: 2, width: '100%', alignItems: 'center', justifyContent: 'center'
      }}>
      <View
        style={{
          width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#FFF', overflow: 'hidden'
        }}
      >
        <Image
          style={{
            width: 100, height: 100, resizeMode: 'contain'
          }}
          source={require('../images/ic_profile.png')}
        />
      </View>
    </View>
    <DrawerItems
      {...props}
    />
    <View
      style={{
        flex: 2, alignItems: 'center', justifyContent: 'center'
      }}
    >
      <Image
        style={{
          width: 150, height: 150, tintColor: 'rgb(148,142,246)', resizeMode: 'contain'
        }}
        source={require('../images/ic_clock.png')}
      />
    </View>
  </ImageBackground>), contentOptions: {
    itemStyle: {justifyContent: 'flex-end'},
    inactiveLabelStyle: {fontFamily: 'byekan', textAlign: 'right', color: '#CCC'},
    activeLabelStyle: {fontFamily: 'byekan', textAlign: 'right', color: '#FFF'},
  }, drawerPosition: 'right'
});

function mapStateToProps(state) {
  return {
    counter: state
  }
}

export default connect(mapStateToProps, {counterAdd, counterSub})(MyDrawerNavigator);

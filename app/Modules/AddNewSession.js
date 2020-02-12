import React, {Component} from "react";
import {
  StyleSheet, View, Image, TouchableWithoutFeedback, Text, TouchableOpacity,
  FlatList, ImageBackground, KeyboardAvoidingView, Dimensions, TextInput, ScrollView
} from 'react-native';
import {connect} from "react-redux";
import {setURI} from "../actions";
import NavigationService from "../service/NavigationService";
import Item from "./Components/Item";
import {RequestsController} from "../Utils/RequestController";
import Carousel, {getInputRangeFromIndexes} from 'react-native-snap-carousel';
import Modal from "react-native-modal";
import DBManager from "../Utils/DBManager";
import Globals from "../Utils/Globals";
import jalaali from 'jalaali-js';
import Toast from "./Components/EasyToast";
import {Menu, MenuOption, MenuOptions, MenuTrigger, renderers, MenuProvider} from "react-native-popup-menu";

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
    this._endMinute = Math.floor((date.getMinutes() - date.getMinutes() % 5) / 5);

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
      title: '',
      titleY: 0,
      titles: [],
      focusTitle: false,
      address: '',
      addressY: 0,
      addresses: [],
      focusAddress: false
    };
    this.saveValue = this.saveValue.bind(this);
    this._compareTitle = this._compareTitle.bind(this);
    this._compareAddress = this._compareAddress.bind(this);
    this._handleAddressClick = this._handleAddressClick.bind(this);
  }

  async componentDidMount() {
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

  _compareTitle(value) {
    return value.includes(this.state.title) && value !== this.state.title;
  }

  _compareAddress(value) {
    return value.includes(this.state.address) && value !== this.state.address;
  }

  _handleAddressClick(value){
    console.log('address', value);
    this.setState({focusAddress: false, address: value})
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
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: 'IRANSansMobile',
                  borderRadius: 12,
                  color: '#FFFFFF',
                  textAlign: 'center'
                }}>
                {DBManager.toArabicNumbers(data[index])}
              </Text>
            </View>
          )
        }
      </ScrollView>
    )
  }

  render() {
    const CustomMenu = (props) => {
      const {style, children, layouts, ...other} = props;
      const position = {
        top: this.state.focusAddress ?
          this.state.addresses.filter(this._compareAddress).length === 0 ? this.state.addressY - 30 : this.state.addressY - 30 * this.state.addresses.filter(this._compareAddress).length :
          this.state.titles.filter(this._compareTitle).length === 0 ? this.state.titleY - 30 : this.state.titleY - 30 * this.state.titles.filter(this._compareTitle).length,
        left: (DEVICE_WIDTH - 120) / 4
      };
      return (
        <View
          {...other}
          style={[
            style, position,
            {
              backgroundColor: 'argba(0,0,0,0)',
              width: '50%',
              height: this.state.focusAddress ? this.state.addresses.filter(this._compareAddress).length * 30 :
                this.state.titles.filter(this._compareTitle).length*30
            }]}
        >
          {children}
        </View>
      );
    };
    return (
      <MenuProvider backHandler={true}>
        <ImageBackground
          source={require('../images/menu.png')}
          style={{flex: 1,}}
        >
          <TouchableOpacity
            style={{
              paddingLeft: 5,
              paddingRight: 15,
              alignSelf: 'flex-start'
            }}
            onPress={NavigationService.goBack}
          >
            <Image
              style={{
                width: 25,
                height: 25,
                marginTop: 5,
                marginRight: 10,
                tintColor: 'white'
              }}
              source={require('../images/ic_back.png')}
            />
          </TouchableOpacity>

          <View
            style={{
              flex: 1,
              marginTop: 10,
              justifyContent: 'center'
            }}
          >
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
                  fontFamily: 'IRANSansMobile',
                  backgroundColor: 'white',
                  borderRadius: 12,
                  paddingHorizontal: 15,
                  textAlign: 'center'
                }}
              >
                تعیین روز
              </Text>
            </View>
            <View
              style={{
                height: 200,
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Carousel
                data={this.data}
                extras={this.extras}
                itemWidth={DBManager.RFWidth(15)}
                itemHeight={180}
                sliderWidth={DEVICE_WIDTH}
                sliderHeight={180}
                enableMomentum
                useScrollView={false}
                activeSlideAlignment={"start"}
                onSnapToItem={(item) => {
                  let date = new Date();
                  date.setDate(date.getDate() + item);
                  let jalali = jalaali.toJalaali(date);
                  this.state.selectedMonth = jalali.jm - 1;
                  this.state.selectedDay = jalali.jd - 1;
                }}
                layout={'default'}
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

          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
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
                fontFamily: 'IRANSansMobile',
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
              <Text style={{marginHorizontal: 10, color: '#FFFFFF'}}> : </Text>
              {
                this.renderCarousel(dailyMinutes, this._endMinute, (index) => {
                  this._endMinute = Math.floor(index / 50);
                })
              }
              <View style={{flex: 1}}/>
            </View>
            <Text
              style={{
                fontFamily: 'IRANSansMobile',
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
                fontFamily: 'IRANSansMobile',
                color: '#FFFFFF',
                fontSize: 15,
                textAlign: 'center',
                flex: 1
              }}
            >
              از
            </Text>
          </View>

          <View
            onLayout={(evt) => {
              this.setState({titleY: evt.nativeEvent.layout.y})
            }}
            style={{
              height: 40,
              borderRadius: 20,
              backgroundColor: '#FFFFFF',
              flexDirection: 'row-reverse',
              alignItems: 'center',
              marginHorizontal: 15
            }}
          >
            <Menu
              onBackdropPress={() => this.setState({focusTitle: false})}
              opened={this.state.focusTitle}
              renderer={CustomMenu}
            >
              <MenuTrigger/>
              <MenuOptions>
                {
                  this.state.titles.filter(this._compareTitle).map((val, index) =>
                    <MenuOption
                      customStyles={{
                        optionText: {
                          color: Globals.PRIMARY_DARK_BLUE,
                          fontSize: 15,
                          textAlign: 'center',
                          fontFamily: 'IRANSansMobile'
                        },
                        optionWrapper: {
                          height: 30,
                          backgroundColor: index % 2 === 0 ? '#d8d8d8' : '#c2c2c2'
                        }
                      }}
                      text={val}
                      onSelect={() => {
                        this.setState({focusTitle: false, title: val})
                      }}
                    />
                  )
                }
              </MenuOptions>
            </Menu>
            <View
              style={{
                backgroundColor: Globals.PRIMARY_DARK_BLUE,
                height: 40,
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
                borderBottomRightRadius: 20,
                paddingHorizontal: 20,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Text
                style={{color: '#FFFFFF', fontFamily: 'IRANSansMobile'}}
              >
                موضوع
              </Text>
            </View>
            <TextInput
              placeholder={"موضوع ..."}
              value={this.state.title}
              onFocus={() => this.setState({focusTitle: true})}
              onBlur={() => this.setState({focusTitle: false})}
              style={{
                flex: 1,
                color: '#000',
                textAlign: 'right',
                fontFamily: 'IRANSansMobile',
                marginStart: 15,
                marginEnd: 15,
              }}
              placeholderTextColor='#808080'
              onChangeText={(text) => {
                this.setState({title: text});
              }}
            />
          </View>

          <View
            onLayout={(evt) => {
              this.setState({addressY: evt.nativeEvent.layout.y})
            }}
            style={{
              height: 40,
              borderRadius: 20,
              backgroundColor: '#FFFFFF',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: 15,
              marginTop: 15
            }}>
            <Menu
              onBackdropPress={() =>{
                console.log('back drop');
                // this.setState({focusAddress: false})
              }}
              opened={this.state.focusAddress}
              renderer={CustomMenu}
            >
              <MenuTrigger/>
              <MenuOptions>
                {
                  this.state.addresses.filter(this._compareAddress).map((val, index) =>
                    <MenuOption
                      key={val}
                      text={val}
                      customStyles={{
                        optionText: {
                          color: Globals.PRIMARY_DARK_BLUE,
                          fontSize: 15,
                          textAlign: 'center',
                          fontFamily: 'IRANSansMobile'
                        },
                        optionWrapper: {
                          height: 30,
                          backgroundColor: index % 2 === 0 ? '#d8d8d8' : '#c2c2c2'
                        }
                      }}
                      onSelect={() => {
                        this._handleAddressClick(val)
                      }}
                    >
                    </MenuOption>
                  )
                }
              </MenuOptions>
            </Menu>
            <TextInput
              placeholder={"آدرس ..."}
              value={this.state.address}
              onFocus={() => this.setState({focusAddress: true})}
              onBlur={() => this.setState({focusAddress: false})}
              style={{
                flex: 1,
                color: '#000',
                textAlign: 'right',
                fontFamily: 'IRANSansMobile',
                marginStart: 15,
                marginEnd: 15,
              }}
              placeholderTextColor='#808080'
              onChangeText={(text) => {
                this.setState({address: text});
              }}
            />
            <View
              style={{
                backgroundColor: Globals.PRIMARY_DARK_BLUE,
                height: 40,
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
                borderBottomRightRadius: 20,
                paddingHorizontal: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{color: '#FFFFFF', fontFamily: 'IRANSansMobile'}}
              >
                {"آدرس "}
              </Text>
            </View>
          </View>

          <Text
            style={{
              fontFamily: 'IRANSansMobile',
              fontSize: 16,
              color: '#888',
              width: '50%',
              alignSelf: 'center',
              backgroundColor: '#FFF',
              textAlign: 'center',
              borderWidth: 2,
              borderRadius: 25,
              marginTop: 10,
              borderColor: '#808080',
              paddingHorizontal: 10,
            }}
          >
            انتخاب از روی نقشه
          </Text>
          <TouchableWithoutFeedback
            onPress={() => NavigationService.navigate('Save')}>
            <View
              style={{
                flex: 1,
                alignItems: 'center'
              }}
            >
              <View style={{height: 10}}/>
              <Image
                source={this.props.counter.uri === null ?
                  require("../images/logo_main.png") :
                  {uri: this.props.counter.uri}
                }
                resizeMode={this.props.counter.uri === null ? 'contain' : 'cover'}
                style={{
                  flex: 1,
                  borderRadius: 15,
                  margin: this.props.counter.uri === null ? 30 : 0,
                  overflow: 'hidden',
                  width: DEVICE_WIDTH - 40,
                }}
              />
              <View style={{height: 10}}/>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => {
              if (this._startHour > this._endHour || (this._startHour === this._endHour && this._startMinute > this._startMinute)) {
                this.refs.toast.show('زمان شروع جلسه باید قبل از زمان پایان جلسه باشد', 5000);
                return;
              }
              if (this.state.address === '') {
                this.refs.toast.close(100);
                this.refs.toast.show('لطفا آدرس محل جلسه را وارد نمایید', 5000);
                return;
              }
              if (this.state.title === '') {
                this.refs.toast.show('لطفا عنوان جلسه را وارد نمایید', 5000);
                return;
              }
              let date = new Date();
              const mHour = date.getHours();
              const jalali = jalaali.toJalaali(date);
              const month = jalali.jm - 1;
              const day = jalali.jd - 1;
              if (month === this.state.selectedMonth && day === this.state.selectedDay && mHour > this._startHour) {
                this.refs.toast.show(`امروز برای قبل از ساعت ${mHour} نمی توانید جلسه ثبت نمایید`, 5000);
                return;
              }
              this.saveValue();
              NavigationService.navigate('ChoosePeople', {
                date: '1398-' + (this.state.selectedMonth + 1) + '-' + (this.state.selectedDay + 1),
                start: dailyHour[this._startHour] + ":" + dailyMinutes[this._startMinute + 1],
                end: dailyHour[this._endHour] + ":" + dailyMinutes[this._endMinute + 1],
                place: this.state.address,
                meeting_title: this.state.title
              });
            }}
          >
            <View
              style={{
                marginVertical: 10,
                marginBottom: 20,
                flexDirection: 'row',
                backgroundColor: '#FFFFFF',
                borderRadius: 30,
                paddingVertical: 2,
                paddingHorizontal: 25,
                marginHorizontal: 25
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
                  fontFamily: 'IRANSansMobile',
                  fontSize: 22,
                  width: '80%',
                  textAlign: 'center',
                  color: '#675ec9',
                  alignSelf: 'center',
                }}
              >
                تایید
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <Toast
            ref="toast"
            style={{
              backgroundColor: '#444',
              marginHorizontal: 50
            }}
            position='center'
            positionValue={200}
            fadeInDuration={200}
            opacity={0.8}
            textStyle={{
              color: 'white',
              fontFamily: 'IRANSansMobile',
              fontSize: 15,
              textAlign: 'center'
            }}
          />
        </ImageBackground>
      </MenuProvider>
    );
  }
}

function mapStateToProps(state) {
  return {
    counter: state
  }
}

export default connect(mapStateToProps, {setURI})(AddNewSession);

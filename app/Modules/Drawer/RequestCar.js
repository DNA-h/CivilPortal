import React, {Component} from "react";
import Wallpaper from "../Components/Wallpaper";
import {connect} from "react-redux";
import {counterAdd, counterSub} from "../../actions";
import {ImageBackground, Text, Image, Dimensions, View, TouchableOpacity} from 'react-native';

let months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
let gMonths = ["ژانویه", "فوریه", "مارس", "آوریل", "مه", "ژوئن", "ژوئیه",
  "اوت", "سپتامبر", "اوکتبر", "نوامبر", "دسامبر"];
let arabicNumbers = ['۰', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

class CalendarPage extends Component {

  componentDidMount() {
    //SplashScreen.hide();
  }

  parsePersianDate() {
    let jalaali = require('jalaali-js');
    let jalali = jalaali.toJalaali(new Date());
    let value = jalali.jd + " " + months[jalali.jm - 1] + " " + jalali.jy % 100;
    let chars = value.split('');
    for (let index in chars)
      if (chars[index] >= '0' && chars[index] <= '9')
        chars[index] = arabicNumbers[chars[index] - '0'];
    return chars.join('');
  }

  parseGeorgianDate() {
    let date = new Date();
    let value = date.getDate() + " " + gMonths[date.getMonth()] + "\n" + date.getFullYear();
    let chars = value.split('');
    for (let index in chars)
      if (chars[index] >= '0' && chars[index] <= '9')
        chars[index] = arabicNumbers[chars[index] - '0'];
    return chars.join('');
  }

  parseHijriDate() {
    let hijri = require('hijri');
    let date = hijri.convert(new Date(), 0);
    let value = date.dayOfMonth + " " + date.monthText + "\n" + date.year;
    let chars = value.split('');
    for (let index in chars)
      if (chars[index] >= '0' && chars[index] <= '9')
        chars[index] = arabicNumbers[chars[index] - '0'];
    return chars.join('');
  }

  render() {
    let todayPersian = this.parsePersianDate();
    let todayGeorgian = this.parseGeorgianDate();
    let todayHijri = this.parseHijriDate();
    return (
      <ImageBackground
        source={require('../../images/menu.png')}
        style={{flex: 1, width: DEVICE_WIDTH,}}
      >
        <View
          style={{
            flex: 1,
            marginHorizontal: 10,
            marginVertical: 50,
            backgroundColor: '#FFFFFF',
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10
            }}
          >

            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
            >
              <Image
                style={{
                  height: 20,
                  width: 20,
                  marginLeft: 10,
                  tintColor: '#6f67d9'
                }}
                source={require("../../images/ic_back.png")}
              />
            </TouchableOpacity>
            <Text
              style={{
                flex: 1,
                textAlign: 'center',
                fontFamily: 'byekan',
                color: '#6f67d9'
              }}
            >
              درخواست خودرو
            </Text>
            <View
              style={{
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
                source={require("../../images/car.png")}
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
          <View style={{flex: 1}}/>
          <Image
            source={require("../../images/ic_car.png")}
            style={{
              flex: 2,
              aspectRatio: 1,
              resizeMode: 'contain'
            }}
          />
          <View style={{flex: 1}}/>
          <Text
            style={{
              flex: 1,
              fontFamily: 'byekan',
              fontSize: 15,
              textAlign: 'center',
              color: '#000',
              paddingHorizontal: 20
            }}
          >
            این صفحه به درخواست مشتری ایجاد میگردد در این خصوص مـی توانید از صفحه پشتیبانی درخواست خود را مطرح نمایید.
          </Text>
        </View>
      </ImageBackground>
    );
  }
}

function mapStateToProps(state) {
  return {
    counter: state
  }
}

export default connect(mapStateToProps, {counterAdd, counterSub})(CalendarPage);

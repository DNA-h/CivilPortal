import React, {Component} from "react";
import Wallpaper from "../Components/Wallpaper";
import {connect} from "react-redux";
import {counterAdd, counterSub} from "../../actions";
import {ImageBackground, Text, Image, Dimensions, View} from 'react-native';

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
            margin: 10,
            backgroundColor: '#FFFFFF',
            marginTop: 20,
            borderRadius: 25,
            alignItems: 'center',
            justifyContent:'center',
          }}>
          <Image
            source={require("../../images/ic_clock.png")}
            style={{
              height: 150,
              width: 150,
              marginTop: 10,
              tintColor: '#094aff50'
            }}
          />
          <Text
            style={{
              fontFamily: 'byekan',
              fontSize: 30,
              color: '#0a46ff'
            }}
          >
            مدیریت زمان
          </Text>
          <Text
            style={{
              fontFamily: 'byekan',
              fontSize: 18,
              textAlign:'center',
              color: '#000',
              paddingHorizontal:10
            }}
          >
            امروزه‌ عواملي‌ چون‌ بزرگ‌ شدن‌ سازمانها، پيچيدگي‌ ساختار و فعاليتهاي‌ آنها، افزايش‌ متغيرهاي‌ محيطي‌
            تاثيرگذار و... مديران‌ را ناگزير كرده‌ است. براي‌ انجام‌ بهتر وظايف‌ و اداره‌ موثر سازمان، از ساير اعضا كمك‌
            بگيرند. بدين‌منظور، مديران‌ معمولاً‌ جلساتي‌ را تشكيل‌ مي‌دهند و با همفكري‌ و تعامل‌ درمورد موضوعهاي‌ مطرح‌
            شده‌ به‌ تبادل‌ اطلاعات‌ مي‌پردازند يا تصميماتي‌ را به‌ صورت‌ گروهي‌ اتخاذ مي‌كنند. تشكيل‌ جلسات‌ نه‌ تنها
            منجر به‌ تبادل‌ اطلاعات‌ و اتخاذ تصميمات‌ مطلوب‌ مي‌شود بلكه‌ تا اندازه‌ زيادي‌ به‌ بهبود ارتباطات‌ و درك‌
            متقابل‌ واحدها از همديگر نيز كمك‌ مي‌كند. البته‌ موارد مذكور در صورتي‌ صادق‌ است‌ كه‌ جلسات‌ نيز همانند ساير
            فعاليتهاي‌ سازماني‌ از مديريت‌ مناسب‌ برخوردار باشد وگرنه‌ تشكيل‌ جلسات‌ نه‌ تنها به‌ بهبود كارايي‌ و
            كارآمدي‌ سازمان‌ كمك‌ نخواهدكرد بلكه‌ به‌عنوان‌ يك‌ غده‌ سرطاني‌ موجب‌ اتلاف‌ منابع‌ و ايجاد تضادهاي‌ درون‌
            سازماني‌ خواهد شد. در مقاله‌ حاضر ابتدا تعريفي‌ از جلسه‌ ارائه‌ مي‌شود، سپس‌ انواع‌ جلسه‌ و اركان‌ جلسه‌
            همراه‌ با وظايف‌ آنها تشريح‌ خواهدشد در نهايت‌ ضمن‌ معرفي‌ موانع‌ و مشكلات‌ جلسات، توصيه‌هايي‌ را نيز براي‌
            اثربخشي‌ جلسات‌ ارائه‌ خواهيم‌ كرد
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

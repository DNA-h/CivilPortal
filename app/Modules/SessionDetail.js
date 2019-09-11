import React, {Component} from "react";
import {Text, View, ScrollView, Image, FlatList, Dimensions} from 'react-native';
import Wallpaper from "./Components/Wallpaper";
import {connect} from "react-redux";
import {counterAdd, counterSub} from "../actions";
import PeopleItem from "./Components/PeopleItem";

let months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
let gMonths = ["ژانویه", "فوریه", "مارس", "آوریل", "مه", "ژوئن", "ژوئیه",
    "اوت", "سپتامبر", "اوکتبر", "نوامبر", "دسامبر"];
let arabicNumbers = ['۰', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
let sampleData = [{name:'naser',place:'مدیر گروه'},{name:'hamed',place:'مدیر'}];

class SessionDetail extends Component {

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
            <Wallpaper>
                <ScrollView>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center'
                        }}>
                        <Text
                            style={{
                                fontFamily: 'byekan',
                                fontSize: 18,
                                color: '#000000',
                                width: '100%',
                                textAlign: 'center',
                                paddingEnd: 10,
                                paddingStart: 10
                            }}>
                            عنوان جلسه : کارگروه
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'byekan',
                                fontSize: 18,
                                color: '#000000',
                                width: '100%',
                                textAlign: 'center',
                                paddingEnd: 10,
                                paddingStart: 10
                            }}>
                            {todayPersian}
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'byekan',
                                fontSize: 18,
                                color: '#000000',
                                width: '100%',
                                textAlign: 'center',
                                paddingEnd: 10,
                                paddingStart: 10
                            }}>
                            تاریخ شروع: 12:10
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'byekan',
                                fontSize: 18,
                                color: '#000000',
                                width: '100%',
                                textAlign: 'center',
                                paddingEnd: 10,
                                paddingStart: 10
                            }}>
                            تاریخ خاتمه: 15:45
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'byekan',
                                fontSize: 18,
                                color: '#000000',
                                width: '100%',
                                textAlign: 'center',
                                paddingEnd: 10,
                                paddingStart: 10
                            }}>
                            مکان جلسه: نواب، ساختمان مرکزی
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'byekan',
                                fontSize: 18,
                                color: '#000000',
                                width: '100%',
                                textAlign: 'center',
                                paddingEnd: 10,
                                paddingStart: 10
                            }}>
                            افراد حاضر در جلسه
                        </Text>
                        <FlatList
                            style={{
                                flex: 1
                            }}
                            keyExtractor={(item, index) => index.toString()}
                            data={sampleData}
                            renderItem={(item) =>
                                <PeopleItem
                                    showCheck={false}
                                    item={item}/>}
                        />
                    </View>
                </ScrollView>
            </Wallpaper>
        );
    }
}

function mapStateToProps(state) {
    return {
        counter: state
    }
}

export default connect(mapStateToProps, {counterAdd, counterSub})(SessionDetail);

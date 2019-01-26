import React, {Component} from "react";
import {Text, View, FlatList} from 'react-native';
import Wallpaper from "./Components/Wallpaper";
import {connect} from "react-redux";
import {counterAdd, counterSub} from "./Actions";
import CalendarItem from "./Components/CalendarItem";
import ActionButton from 'react-native-action-button';
import NavigationService from "./Service/NavigationService";

let months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
let gMonths = ["ژانویه", "فوریه", "مارس", "آوریل", "مه", "ژوئن", "ژوئیه",
    "اوت", "سپتامبر", "اوکتبر", "نوامبر", "دسامبر"];
let arabicNumbers = ['۰', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
let sampleData =["1","2"];

class MainPage extends Component {

    parsePersianDate() {
        let jalaali = require('jalaali-js');
        let jalali = jalaali.toJalaali(new Date());
        let value = jalali.jd + " " + months[jalali.jm] + " " + jalali.jy % 100;
        let chars = value.split('');
        for (let index in chars)
            if (chars[index] >= '0' && chars[index] <= '9')
                chars[index] = arabicNumbers[chars[index] - '0'];
        return chars.join('');
    }

    parseGeorgianDate() {
        let date = new Date();
        let value = date.getDate() + " " + gMonths[date.getMonth()] + "\n" + (date.getFullYear() % 100);
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
                <View style={{
                    flex: 2,
                    flexDirection: 'row'
                }}>
                    <View style={{
                        flex: 2,
                        justifyContent: 'center'
                    }}>
                        <Text
                            style={{
                                fontFamily: 'byekan',
                                fontSize: 13,
                                color: '#000000',
                                width: '100%',
                                textAlign: 'center',
                                paddingEnd: 10,
                                paddingStart: 10
                            }}>
                            {todayGeorgian}
                        </Text>
                    </View>
                    <View style={{
                        flex: 6,
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
                            {todayPersian}
                        </Text>
                    </View>
                    <View style={{
                        flex: 2,
                        justifyContent: 'center'
                    }}>
                        <Text
                            style={{
                                fontFamily: 'byekan',
                                fontSize: 13,
                                color: '#000000',
                                width: '100%',
                                textAlign: 'center',
                                paddingEnd: 10,
                                paddingStart: 10
                            }}>
                            {todayHijri}
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        height:1,
                        width:'100%',
                        backgroundColor: '#5555FF'
                    }}/>
                <View style={{
                    flex: 7
                }}>
                    <FlatList
                        style={{
                            flex: 1,
                            backgroundColor: '#CCCCCC77'
                        }}
                        keyExtractor={(item, index) => index.toString()}
                        data={sampleData}
                        renderItem={(item) =>
                            <CalendarItem/>}
                    />
                </View>
                <ActionButton buttonColor="rgba(231,76,60,1)"
                    onPress={() => NavigationService.navigate('AddNewSession',null)}>
                </ActionButton>
            </Wallpaper>
        );
    }
}

function mapStateToProps(state) {
    return {
        counter: state
    }
}

export default connect(mapStateToProps, {counterAdd, counterSub})(MainPage);
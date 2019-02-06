import React, {Component} from "react";
import {Text, View, FlatList, Image} from 'react-native';
import Wallpaper from "./Components/Wallpaper";
import {connect} from "react-redux";
import {counterAdd, counterSub} from "./Actions";
import CalendarItem from "./Components/CalendarItem";
import ActionButton from 'react-native-action-button';
import NavigationService from "./Service/NavigationService";
import SplashScreen from 'react-native-splash-screen';

let months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
let gMonths = ["ژانویه", "فوریه", "مارس", "آوریل", "مه", "ژوئن", "ژوئیه",
    "اوت", "سپتامبر", "اوکتبر", "نوامبر", "دسامبر"];
let arabicNumbers = ['۰', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
let sampleData = [{start: '9:45', end: '12:00', title: 'یک'}, {start: '15:00', end: '16:30', title: 'دو'}];

class MainPage extends Component {

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
                <View
                    style={{
                        flex: 2,
                        flexDirection: 'row',
                        backgroundColor: '#CCCCCCAA'
                    }}>
                    <View
                        style={{
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
                    <View
                        style={{
                            flex: 3,
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
                        <View
                            style={{
                                flexDirection: 'row'
                            }}>
                                <Image
                                    tintColor={"#6393ff"}
                                    source={require("./images/ic_back.png")}/>
                                <Image
                                    tintColor={"#6393ff"}
                                    source={require("./images/ic_back.png")}/>
                        </View>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'flex-end'
                        }}>
                        <Image
                            style={{
                                width: 30,
                                height: 30,
                                margin: 10
                            }}
                            source={require("./images/nav_icon.png")}/>
                    </View>
                </View>
                <View
                    style={{
                        height: 1,
                        width: '100%'
                    }}/>
                <View
                    style={{
                        flex: 9
                    }}>
                    <FlatList
                        style={{
                            flex: 1
                        }}
                        keyExtractor={(item, index) => index.toString()}
                        data={sampleData}
                        renderItem={(item) =>
                            <CalendarItem
                                item={item}/>}
                    />
                </View>
                <ActionButton
                    buttonColor="rgba(231,76,60,1)"
                    onPress={() => NavigationService.navigate('AddNewSession', null)}>
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

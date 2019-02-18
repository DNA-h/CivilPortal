import React, {Component} from "react";
import {Text, View, FlatList, Image, TouchableWithoutFeedback, Button} from 'react-native';
import Wallpaper from "./Components/Wallpaper";
import {connect} from "react-redux";
import {counterAdd, counterSub} from "./Actions";
import CalendarItem from "./Components/CalendarItem";
import ActionButton from 'react-native-action-button';
import NavigationService from "./Service/NavigationService";
import SplashScreen from 'react-native-splash-screen';
import {createDrawerNavigator, DrawerItems, DrawerActions} from "react-navigation";
import AddNewSession from "./AddNewSession";
import CalendarPage from "./CalendarPage";

let months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
let gMonths = ["ژانویه", "فوریه", "مارس", "آوریل", "مه", "ژوئن", "ژوئیه",
    "اوت", "سپتامبر", "اوکتبر", "نوامبر", "دسامبر"];
let arabicNumbers = ['۰', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
let sampleData = [{start: '9:45', end: '12:00', title: 'یک'}, {start: '15:00', end: '16:30', title: 'دو'}];

class MainPage extends Component {

    componentDidMount() {
        SplashScreen.hide();
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
                            flex: 3
                        }}>
                        <View style={{flex: 1, justifyContent: 'center'}}>
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
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingBottom: 10
                            }}>
                            <Image
                                style={{width: 20, height: 20}}
                                tintColor={"#6393ff"}
                                source={require("./images/ic_back.png")}/>
                            <View style={{flex: 1}}/>
                            <Image
                                style={{width: 20, height: 20}}
                                tintColor={"#6393ff"}
                                transform={[{rotateY: '180deg'}]}
                                source={require("./images/ic_back.png")}/>
                        </View>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'flex-end'
                        }}>
                        <TouchableWithoutFeedback
                            onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())}>
                            <Image
                                style={{
                                    width: 30,
                                    height: 30,
                                    margin: 10
                                }}
                                source={require("./images/nav_icon.png")}/>
                        </TouchableWithoutFeedback>
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
        navigationOptions: ({ navigation }) => ({
            title: 'صفحه اصلی',
        }),
    },
    AddNewSession: {
        screen: AddNewSession,
        navigationOptions: ({ navigation }) => ({
            title: 'ثبت جلسه جدید',
        }),
    },
    CalendarPage: {
        screen: CalendarPage,
        navigationOptions: ({ navigation }) => ({
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

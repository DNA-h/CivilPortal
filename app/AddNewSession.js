import React, {Component} from "react";
import {
    StyleSheet, View, Image,
    TouchableWithoutFeedback, Text,
    ScrollView, Keyboard, Dimensions, ImageBackground, TextInput
} from 'react-native';
import Wallpaper from "./Components/Wallpaper";
import {connect} from "react-redux";
import {counterAdd, counterSub} from "./Actions/index";
import PersianDatePicker from 'react-native-persian-date-picker';
import NavigationService from "./Service/NavigationService";
import KeyboardSpacer from "react-native-keyboard-spacer";

let dailyHour = ['00', '01', '02', '03',
    '04', '05', '06', '07', '08', '09', '10', '11',
    '12', '13', '14', '15', '16', '17', '18', '19',
    '20', '21', '22', '23'];
let dailyMinutes = ['00', '15', '30', '45'];
let monthsDays = ['01', '02', '03',
    '04', '05', '06', '07', '08', '09', '10', '11',
    '12', '13', '14', '15', '16', '17', '18', '19',
    '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
let months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

class AddNewSession extends Component {

    constructor(props) {
        super(props);
        this.myRef = 1;
        let jalaali = require('jalaali-js');
        let date = new Date();
        let jalali = jalaali.toJalaali(date);
        let month = jalali.jm - 1;
        let day = jalali.jd - 1;
        this.state = {
            selectedDay: day,
            selectedMonth: month,
        };
    }

    render() {
        return (
            <View
                style={{flex: 1}}>

                <View
                    style={{
                        flex: 1,
                        width: DEVICE_WIDTH,
                        height: DEVICE_HEIGHT,
                    }}
                >
                    <View
                        style={{
                            alignItems: 'center',
                            flex: 1
                        }}>
                        <Text
                            style={{
                                fontFamily: 'byekan',
                                color: '#000000',
                                width: '100%',
                                fontSize: 25,
                                textAlign: 'center'
                            }}>
                            انتخاب روز
                        </Text>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'center'
                            }}>
                            <View style={{flex: 1}}/>
                            <Image
                                style={{
                                    width: 15,
                                    height: 15,
                                }}
                                source={require("./images/ic_back.png")}/>
                            <Text>
                                سه شنبه
                                {"\n"}
                                10
                                {"\n"}
                                اردیبهشت
                            </Text>
                            <Image
                                style={{
                                    width: 15,
                                    height: 15,
                                }}
                                source={require("./images/ic_back.png")}/>
                            <View style={{flex: 1}}/>
                        </View>
                    </View>
                    <View style={{flex: 1}}/>
                    <View
                        style={{
                            alignItems: 'center',
                            flex: 1
                        }}>
                        <Text
                            style={{
                                fontFamily: 'byekan',
                                color: '#000000',
                                width: '100%',
                                fontSize: 25,
                                textAlign: 'center'
                            }}>
                            انتخاب ساعت
                        </Text>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'center'
                            }}>
                            <View style={{flex: 1}}/>
                            <View>
                                <Image
                                    style={{
                                        width: 15,
                                        height: 15,
                                    }}
                                    source={require("./images/ic_back.png")}/>
                                <Text>
                                    05
                                </Text>
                                <Image
                                    style={{
                                        width: 15,
                                        height: 15,
                                    }}
                                    source={require("./images/ic_back.png")}/>
                            </View>
                            <Text>:</Text>
                            <View>
                                <Image
                                    style={{
                                        width: 15,
                                        height: 15,
                                    }}
                                    source={require("./images/ic_back.png")}/>
                                <Text>
                                    05
                                </Text>
                                <Image
                                    style={{
                                        width: 15,
                                        height: 15,
                                    }}
                                    source={require("./images/ic_back.png")}/>
                            </View>
                            <View style={{flex: 1}}/>
                        </View>
                    </View>
                    <View style={{flex: 1}}/>
                    <View>
                        <Text
                            style={{
                                fontFamily: 'byekan',
                                color: '#000000',
                                width: '100%',
                                fontSize: 25,
                                textAlign: 'center'
                            }}>
                            موضوع و آدرس
                        </Text>
                        <TextInput
                            style={{
                                backgroundColor: '#7fb0ff',
                                color: '#000',
                                textAlign: 'center',
                                fontFamily: 'byekan',
                                flex: 1
                            }}
                            autoCapitalize="none"
                            onChangeText={(text) => {
                                this.text = text;
                            }}
                            defaultValue={'09140510168'}
                            autoCorrect={false}
                            keyboardType='email-address'
                            returnKeyType="next"
                            placeholder='موضوع ...'
                            placeholderTextColor='#000'/>
                        <TextInput
                            style={{
                                backgroundColor: '#7fb0ff',
                                color: '#000',
                                textAlign: 'center',
                                fontFamily: 'byekan',
                                marginVertical: 10,
                                flex: 1
                            }}
                            autoCapitalize="none"
                            onChangeText={(text) => {
                                this.text = text;
                            }}
                            defaultValue={'09140510168'}
                            autoCorrect={false}
                            keyboardType='email-address'
                            returnKeyType="next"
                            placeholder='آدرس ...'
                            placeholderTextColor='#000'/>
                    </View>
                    <View style={{flex:1}}/>
                    <View>
                        <Text
                            style={{
                                fontFamily: 'byekan',
                                color: '#000000',
                                width: '100%',
                                fontSize: 25,
                                textAlign: 'center'
                            }}>
                            انتخاب آدرس از روی نقشه
                        </Text>
                        <Image
                            style={{
                                width: '90%',
                                height: 100,
                                resizeMode: 'cover'
                            }}
                        source={require("./images/ic_map.png")}/>
                    </View>
                    <TouchableWithoutFeedback
                        style={{
                            marginVertical: 40,
                            marginBottom: 40,
                        }}
                        onPress={() => NavigationService.navigate('ChoosePeople',
                            {
                                date: '1397/' + (this.state.selectedMonth + 1) + '/' + (this.state.selectedDay + 1),
                            })}>
                        <View>
                            <Text
                                style={{
                                    fontFamily: 'byekan',
                                    fontSize: 18,
                                    width: '80%',
                                    textAlign: 'center',
                                    color: '#FFFFFF',
                                    alignSelf: 'center',
                                    backgroundColor: '#F035E0',
                                    borderRadius: 30,
                                    marginBottom: 40,
                                    paddingVertical: 10,
                                    paddingHorizontal: 25,
                                }}>
                                تایید
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <KeyboardSpacer/>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    textInput: {
        color: '#000000',
        fontSize: 18,
        fontFamily: 'byekan'
    }
});

function mapStateToProps(state) {
    return {
        counter: state
    }
}

export default connect(mapStateToProps, {counterAdd, counterSub})(AddNewSession);

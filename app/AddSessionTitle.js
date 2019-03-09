import React, {Component} from "react";
import {
    StyleSheet, View, TextInput,
    TouchableWithoutFeedback, Text,
    ScrollView, Keyboard, Dimensions
} from 'react-native';
import {connect} from "react-redux";
import {counterAdd, counterSub} from "./Actions/index";
import NavigationService from "./Service/NavigationService";
import SplashScreen from 'react-native-splash-screen';
import KeyboardSpacer from "react-native-keyboard-spacer";
import DateTimePicker from 'react-native-modal-datetime-picker';

let sampleData = ['12', '13', '14', '15', '16'];
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

class AddSessionTitle extends Component {

    constructor(props) {
        super(props);
        this.myRef = 1;
        this.title = "";
        this.location = "";
        this._keyboardDidHide = this._keyboardDidHide.bind(this);
        this._keyboardDidShow = this._keyboardDidShow.bind(this);
    }

    componentDidMount() {
        SplashScreen.hide();
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide,
        );
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow() {
        console.log('SV ', this.myRef);
        setTimeout(() =>
                this.myRef.scrollTo({y: 0.5 * DEVICE_HEIGHT - 80})
            , 100)
    }

    _keyboardDidHide() {
        setTimeout(() =>
                this.myRef.scrollTo({y: 0})
            , 100)
    }

    render() {
        return (
            <View
                style={{flex: 1}}>
                <ScrollView
                    ref={ref => this.myRef = ref}
                    style={{flex: 1}}>
                    <View
                        style={{
                            flex: 1,
                            width: DEVICE_WIDTH,
                            height: DEVICE_HEIGHT,
                        }}>
                        <View style={{flex: 1}}/>
                        <View
                            style={{
                                alignItems: 'center',
                                flex: 1
                            }}>
                            <TextInput
                                placeholderTextColor={'#C0C0C0'}
                                underlineColorAndroid="#C0C0C0"
                                style={styles.textInput}
                                onChangeText={(text) => {
                                    this.title = text
                                }}
                                placeholder={"عنوان"}/>
                        </View>
                        <View style={{flex: 1}}/>
                        <TextInput
                            placeholder={'مکان جلسه را وارد نمایید'}
                            placeholderTextColor={'#C0C0C0'}
                            underlineColorAndroid="#C0C0C0"
                            style={{fontFamily: 'byekan', textAlign: 'center', height: 40, color: '#000000'}}
                            onChangeText={(text) => {
                                this.location = text
                            }}/>
                        <View style={{flex: 1}}/>
                        <TouchableWithoutFeedback
                            style={{
                                marginVertical: 40,
                                marginBottom: 40,
                            }}
                            onPress={() => NavigationService.navigate('ChoosePeople',
                                {
                                    selectedDay: this.state.selectedDay,
                                    selectedMonth: this.state.selectedMonth,
                                    title: this.title,
                                    location: this.location,
                                    startTime: this.state.start_time,
                                    endTime: this.state.end_time
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
                                    بعدی
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <KeyboardSpacer/>
                </ScrollView>
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

export default connect(mapStateToProps, {counterAdd, counterSub})(AddSessionTitle);

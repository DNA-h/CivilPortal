import React, {Component} from "react";
import {
    StyleSheet, View, TextInput,
    TouchableWithoutFeedback, Text,
    ScrollView, Keyboard, Dimensions
} from 'react-native';
import Wallpaper from "./Components/Wallpaper";
import {connect} from "react-redux";
import {counterAdd, counterSub} from "./Actions/index";
import PersianDatePicker from 'react-native-persian-date-picker';
import NavigationService from "./Service/NavigationService";
import SplashScreen from 'react-native-splash-screen';
import KeyboardSpacer from "react-native-keyboard-spacer";
import DateTimePicker from 'react-native-modal-datetime-picker';
import {Dropdown} from 'react-native-material-dropdown';

let sampleData = [{value: 'دفتر مرکزی'}, {value: 'دفتر جنوب تهران'}];
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

class AddNewSession extends Component {

    constructor(props) {
        super(props);
        this.myRef = 1;
        this.state = {
            isDateTimePickerVisible: false,
            start_time: 'ساعت شروع',
            end_time: 'ساعت پایان',
            which: -1
        };
        this._keyboardDidHide = this._keyboardDidHide.bind(this);
        this._keyboardDidShow = this._keyboardDidShow.bind(this);
        this._onConfirm = this._onConfirm.bind(this);
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
        //console.log('SV ', this.myRef);
        setTimeout(() =>
                this.myRef.scrollTo({y: 0.5 * DEVICE_HEIGHT - 80})
            , 100)
    }

    _keyboardDidHide() {
        setTimeout(() =>
                this.myRef.scrollTo({y: 0})
            , 100)
    }

    _onConfirm(time) {
        if (this.state.which === 1) {
            this.setState({
                start_time: time.getHours() + ":" + time.getMinutes(),
                isDateTimePickerVisible: false
            })
        } else {
            this.setState({
                end_time: time.getHours() + ":" + time.getMinutes(),
                isDateTimePickerVisible: false
            })
        }
    }

    render() {
        return (
            <View
                style={{flex: 1}}>
                <ScrollView
                    ref={ref => this.myRef = ref}
                    style={{flex: 1}}>
                    <Wallpaper>
                        <View style={{flex: 2}}/>
                        <View>
                            <PersianDatePicker
                                textStyle={{
                                    fontFamily: 'byekan'
                                }}/>
                        </View>
                        <View style={{flex: 1}}/>
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                            <TextInput
                                placeholderTextColor={'#C0C0C0'}
                                style={styles.textInput}
                                placeholder={"عنوان"}/>

                            <TouchableWithoutFeedback
                                onPress={() => this.setState({isDateTimePickerVisible: true, which: 1})}>
                                <View>
                                    <Text
                                        style={styles.textInput}>
                                        {this.state.start_time}
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>

                            <TouchableWithoutFeedback
                                onPress={() => this.setState({isDateTimePickerVisible: true, which: 2})}>
                                <View>
                                    <Text
                                        style={styles.textInput}>
                                        {this.state.end_time}
                                    </Text>
                                </View></TouchableWithoutFeedback>
                            <DateTimePicker
                                mode={'time'}
                                isVisible={this.state.isDateTimePickerVisible}
                                onConfirm={this._onConfirm}
                                onCancel={() => this.setState({isDateTimePickerVisible: false})}/>
                        </View>
                        <View style={{flex: 1}}/>
                        <Dropdown
                            label={'انتخاب محل جلسه'}
                            itemTextStyle={{fontFamily: 'byekan', textAlign: 'center'}}
                            style={{
                                flex: 1
                            }}
                            data={sampleData}/>

                        <View style={{flex: 1}}/>
                        <TouchableWithoutFeedback
                            style={{
                                marginVertical: 40,
                                marginBottom: 40,
                            }}
                            onPress={() => NavigationService.navigate('ChoosePeople', null)}>
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
                                    "بعدی"
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </Wallpaper>

                    <KeyboardSpacer/>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    textInput: {
        color: '#FFFFFF',
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

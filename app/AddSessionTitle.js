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

let sampleData = ['12', '13', '14', '15', '16'];
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

class AddSessionTitle extends Component {

    constructor(props) {
        super(props);
        this.title = "";
        this.location = "";
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
                                    date: this.props.navigation.getParam('date'),
                                    start: this.props.navigation.getParam('start'),
                                    end: this.props.navigation.getParam('end'),
                                    title: this.title
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
        fontFamily: 'byekan',
        width: '100%'
    }
});

function mapStateToProps(state) {
    return {
        counter: state
    }
}

export default connect(mapStateToProps, {counterAdd, counterSub})(AddSessionTitle);

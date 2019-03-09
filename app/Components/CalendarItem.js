import React, {Component} from "react";
import {Text, View, TouchableWithoutFeedback, Image} from 'react-native';
import Wallpaper from "./Wallpaper";
import {connect} from "react-redux";
import {counterAdd, counterSub} from "../Actions";

class CalendarItem extends Component {

    render() {
        return (
            <TouchableWithoutFeedback
                onPress={() => this.props.callback(this.props.item.item.index)}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#6A6A6A55',
                        borderRadius: 10,
                        paddingStart: 10,
                        marginStart: 5,
                        marginEnd: 5,
                        marginTop: 10,
                        marginBottom: 10
                    }}>
                    <View>
                        <Text
                            style={{
                                fontFamily: 'byekan',
                                color: '#FFFFFF'
                            }}>
                            {this.props.item.item.start}
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'byekan',
                                color: '#FFFFFF'
                            }}>
                            {this.props.item.item.end}
                        </Text>
                    </View>
                    <Text
                        style={{
                            flex: 1,
                            fontFamily: 'byekan',
                            textAlign: 'center',
                            color: '#FFFFFF'
                        }}>
                        {this.props.item.item.title}
                    </Text>
                    <View
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderTopLeftRadius: 25,
                            borderBottomLeftRadius: 25
                        }}>
                        <Image
                            style={{
                                width: 50,
                                height: 50,
                                resizeMode: 'contain',
                                tintColor: '#641e87'
                            }}
                            source={require('../images/ic_no_profile.png')}/>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

function mapStateToProps(state) {
    return {
        counter: state
    }
}

export default connect(mapStateToProps, {counterAdd, counterSub})(CalendarItem);

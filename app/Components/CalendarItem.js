import React, {Component} from "react";
import {Text, View, Image} from 'react-native';
import {connect} from 'react-redux';
import {counterAdd, counterSub} from "../Actions";

class CalendarItem extends Component {

    render() {
        return (
            <View
                style={{flexDirection: 'row'}}>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#6A6A6A55',
                        borderRadius: 10,
                        paddingStart: 10,
                        paddingEnd: 10,
                        paddingTop: 5,
                        paddingBottom: 5,
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
                </View>
                <View
                    style={{
                        backgroundColor: '#C0C0C0',
                        borderTopRightRadius: 15,
                        borderBottomRightRadius: 15,
                        borderBottomLeftRadius: 15
                    }}>
                    <Image style={{width: 15, height: 15, margin: 5}} tintColor={'#FFFFFF'}
                           source={require('../images/ic_back.png')}/>
                    <Image style={{width: 15, height: 15, margin: 5}} tintColor={'#FFFFFF'}
                           source={require('../images/small_calendar.png')}/>
                    <Image style={{width: 15, height: 15, margin: 5}} tintColor={'#FFFFFF'}
                           source={require('../images/basket.png')}/>
                </View>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        counter: state
    }
}

export default connect(mapStateToProps, {counterAdd, counterSub})(CalendarItem);

import React, {Component} from "react";
import {Text, View, Image} from 'react-native';
import {connect} from 'react-redux';
import {counterAdd, counterSub} from "../Actions";

class CalendarItem extends Component {

    _renderLeft(){
        return (
        <View
            style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
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
            <View
                style={{
                    flex: 5,
                    flexDirection: 'row',
                    backgroundColor: '#6A6A6A55',
                    borderTopLeftRadius: 20,
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                    alignItems: 'center'
                }}>
                <Image
                    style={{
                        width: 70,
                        height: 70,
                        margin: 10,
                        borderWidth: 2,
                        borderColor: '#00b',
                        borderRadius: 40,
                    }}
                    tintColor={'#FFFFFF'}
                    source={require('../images/ic_no_profile.png')}/>
                <View style={{flex: 1}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{flex: 1}}>
                            جلسخ شورای معاونین
                        </Text>
                        <Image style={{width: 15, height: 15, margin: 5}} tintColor={'#000000'}
                               source={require('../images/ic_back.png')}/>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{flex: 1}}>
                            ساعت 10 تا 12
                        </Text>
                        <Image style={{width: 15, height: 15, margin: 5}} tintColor={'#000000'}
                               source={require('../images/ic_back.png')}/>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{flex: 1}}>
                            مکان: ساختمان اصلی
                        </Text>
                        <Image style={{width: 15, height: 15, margin: 5}} tintColor={'#000000'}
                               source={require('../images/ic_back.png')}/>
                    </View>
                </View>
            </View>
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#6A6A6A55',
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                    borderTopRightRadius: 20,
                    marginHorizontal: 3,
                    alignItems: 'center'
                }}>
                <Image style={{width: 20, height: 20, margin: 5}} tintColor={'#000000'}
                       source={require('../images/basket.png')}/>
                <Image style={{width: 20, height: 20, margin: 5}} tintColor={'#000000'}
                       source={require('../images/ic_brief.png')}/>
                <Image style={{width: 20, height: 20, margin: 5}} tintColor={'#000000'}
                       source={require('../images/ic_share.png')}/>
            </View>
            <View style={{flex:1}}/>
        </View>
        );
    }

    _renderRight(){
        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
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
                <View style={{flex:1}}/>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: '#6A6A6A55',
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20,
                        borderTopLeftRadius: 20,
                        marginHorizontal: 3,
                        alignItems: 'center'
                    }}>
                    <Image style={{width: 20, height: 20, margin: 5}} tintColor={'#000000'}
                           source={require('../images/basket.png')}/>
                    <Image style={{width: 20, height: 20, margin: 5}} tintColor={'#000000'}
                           source={require('../images/ic_brief.png')}/>
                    <Image style={{width: 20, height: 20, margin: 5}} tintColor={'#000000'}
                           source={require('../images/ic_share.png')}/>
                </View>
                <View
                    style={{
                        flex: 5,
                        flexDirection: 'row',
                        backgroundColor: '#6A6A6A55',
                        borderTopRightRadius: 20,
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20,
                        alignItems: 'center'
                    }}>
                    <Image
                        style={{
                            width: 70,
                            height: 70,
                            margin: 10,
                            borderWidth: 2,
                            borderColor: '#00b',
                            borderRadius: 40,
                        }}
                        tintColor={'#FFFFFF'}
                        source={require('../images/ic_no_profile.png')}/>
                    <View style={{flex: 1}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{flex: 1}}>
                                جلسخ شورای معاونین
                            </Text>
                            <Image style={{width: 15, height: 15, margin: 5}} tintColor={'#000000'}
                                   source={require('../images/ic_back.png')}/>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{flex: 1}}>
                                ساعت 10 تا 12
                            </Text>
                            <Image style={{width: 15, height: 15, margin: 5}} tintColor={'#000000'}
                                   source={require('../images/ic_back.png')}/>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{flex: 1}}>
                                مکان: ساختمان اصلی
                            </Text>
                            <Image style={{width: 15, height: 15, margin: 5}} tintColor={'#000000'}
                                   source={require('../images/ic_back.png')}/>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    render() {
        let left = this.props.item.item.left ? this._renderLeft() : this._renderRight();
        return (
            <View
                style={{flexDirection: 'row'}}>
                {left}
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

import React, {Component} from "react";
import {Text, View, CheckBox} from 'react-native';
import Wallpaper from "./Wallpaper";
import {connect} from "react-redux";
import {counterAdd, counterSub} from "../Actions";

class PeopleItem extends Component {
    check =  this.props.showCheck === false ? null : <CheckBox/>;
    render() {
        return (
            <View
                style={{
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
                <Text
                    style={{
                        flex: 1,
                        fontFamily: 'byekan',
                        textAlign: 'center'
                    }}>
                    {this.props.item.item.place}
                </Text>
                <Text
                    style={{
                        flex: 1,
                        fontFamily: 'byekan',
                        textAlign: 'center'
                    }}>
                    {this.props.item.item.name}
                </Text>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        counter: state
    }
}

export default connect(mapStateToProps, {counterAdd, counterSub})(PeopleItem);

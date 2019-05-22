import React from 'react';
import {View, Text, Animated, TouchableWithoutFeedback} from 'react-native';

export default class Item extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scale: new Animated.Value(0),
            color: '#000',
            back: '#FFF'
        };
        this.prevPercent = 0.0;
        this.animView = this.state.scale.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [1, 1.4, 1]
        });
    }

    componentDidUpdate(prevProps) {
        // if (this.props.currentItem === this.props.index) {
        //     console.log(this.props.currentPercent);
        // }

        // if (prevProps.currentItem === this.props.currentItem) return;
        // if (this.props.currentItem === this.props.index) {
        //     this.setState({color: 'white', back: 'blue'});
        // } else
        //     this.setState({color: '#000', back: '#FFF'});

        if (prevProps.currentItem === this.props.currentItem //nothing changed, not me
            && this.props.currentItem !== this.props.index) return;
        if (prevProps.currentItem !== this.props.currentItem//something changed, was it me
            && prevProps.currentItem === this.props.index) {
            this.state.scale.setValue(0);
            this.setState({color: '#000', back: '#FFF'});
            return;
        }
        if (prevProps.currentItem !== this.props.currentItem //something changed, was not me
            && prevProps.currentItem !== this.props.index
            && this.props.currentItem !== this.props.index) {
            return;
        }
        if (Math.abs(this.props.currentPercent - this.prevPercent) > 0.001) {
            this.state.scale.setValue(this.props.currentPercent);
            // Animated.timing(
            //     this.state.scale, {
            //         toValue: this.props.currentPercent,
            //         duration: 100
            //     }
            // ).start();
            this.prevPercent = this.props.currentPercent;
            this.setState({color: 'white', back: 'blue'});
        }
    }

    render() {
        return (
            <View style={{flexDirection: 'row'}}>
                <Animated.View
                    style={{
                        marginHorizontal: 10,
                        width: 50,
                        backgroundColor: this.state.back,
                        borderWidth: 1,
                        borderColor: 'green',
                        borderRadius: 25,
                        justifyContent: 'center',
                        margin: 20,
                        padding: 5,
                        transform: [{scale: this.animView}]
                    }}>
                    <Animated.Text
                        style={{
                            color: this.state.color,
                            fontSize: 13
                        }}>
                        {this.props.date}
                    </Animated.Text>
                    <Text
                        style={{
                            color: this.state.color,
                            fontSize: 12
                        }}>
                        {this.props.month}
                    </Text>
                    <Text
                        style={{
                            color: this.state.color,
                            fontSize: 13
                        }}>
                        {this.props.day}
                    </Text>
                </Animated.View>
            </View>
        );
    }
}
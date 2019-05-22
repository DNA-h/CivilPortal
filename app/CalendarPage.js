import React, {Component} from "react";
import Wallpaper from "./Components/Wallpaper";
import {connect} from "react-redux";
import {counterAdd, counterSub} from "./Actions";

let months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
let gMonths = ["ژانویه", "فوریه", "مارس", "آوریل", "مه", "ژوئن", "ژوئیه",
    "اوت", "سپتامبر", "اوکتبر", "نوامبر", "دسامبر"];
let arabicNumbers = ['۰', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
let sampleData = [{name:'naser',place:'مدیر گروه'},{name:'hamed',place:'مدیر'}];

class CalendarPage extends Component {

    componentDidMount() {
        //SplashScreen.hide();
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
            <Wallpaper
                style={{
                    justifyContent: 'center'
                }}>
            </Wallpaper>
        );
    }
}

function mapStateToProps(state) {
    return {
        counter: state
    }
}

export default connect(mapStateToProps, {counterAdd, counterSub})(CalendarPage);

import React from "react";
import {create} from "react-test-renderer";
import CalendarItem from "../app/Components/CalendarItem";
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import reducer from '../app/Reducers/ReducerOne';

const store = createStore(reducer);
let item = {
    id:0,
    start: "1398-03-18 10:59:00",
    end: "1398-03-18 10:00:00",
    title: "کلاس تکمیلی",
    left: 0,
};
describe("Feature component", () => {
    test("it matches the snapshot", () => {
        const component = create(
            <Provider
                store={store}><CalendarItem item={{item}}/>
            </Provider>);
        expect(component.toJSON()).toMatchSnapshot();
    });
});
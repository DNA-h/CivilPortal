import GLOBALS from "./Globals";

let Parse = require('parse/react-native');

export class ConnectionManager {
    static async doFetch(url, method, body, headers, callback = false) {
        console.log("url is ", url);
        // console.log("body is ", body);
        // console.log("headers tag ", headers);

        // console.log('url ', url);
        if (callback)
            try {
                let response = await ConnectionManager.helperFetch(url, method, body, headers);
                // console.log('url ', url);
                console.log('response', response);
                return await response.json();
            } catch (e) {
                // console.log(e.toString());
                return undefined;
            }
        else
            await fetch(url, {
                method: method,
                body: body,
                headers: headers
            });
    }

    static async helperFetch(url, method, body, headers) {
        return await Promise.race([
            fetch(url, {
                method: method,
                body: body,
                headers: headers
            })
            ,
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('timeout')), 10000)
            )
        ]);
    }

    static async getPeople() {
        // let json = await ConnectionManager.doFetch(
        //     GLOBALS.BASE_URL + GLOBALS.URL_PEOPLE,
        //     'GET', null, new Headers(), true
        // );
        // return json !== undefined ? json : undefined;
        const People = Parse.Object.extend("People");
        const query = new Parse.Query(People);
        let res = await query.find();
        let result = [];
        for (let i = 0; i < res.length; i++) {
            let object = res[i];
            let item = {
                'name': object.get('name'),
                'rank': object.get('rank'),
                'flag': false,
                'id': object.id
            };
            result.push(item)
        }
        return result;
    }

    static async sendCode(mobile) {
        let json = await ConnectionManager.doFetch(
            GLOBALS.BASE_URL + GLOBALS.URL_SMS + "?mobile=" + mobile,
            'POST', null, new Headers(), true
        );
        return json !== undefined ? json : undefined;
    }

    static async confirmCode(code) {
        let json = await ConnectionManager.doFetch(
            GLOBALS.BASE_URL + GLOBALS.URL_PEOPLE + "?code=" + code,
            'POST', null, new Headers(), true
        );
        return json !== undefined ? json : undefined;
    }

    static async loadSessions(date) {
        // let json = await ConnectionManager.doFetch(
        //     GLOBALS.BASE_URL + GLOBALS.URL_LOAD_SESSIONS + "?date=" + date+"&token=1316244843",
        //     'POST', null, new Headers(), true
        // );
        // console.log('json ', json);
        // return json !== undefined ? json : undefined;
        const Sessions = Parse.Object.extend("Sessions");
        const query = new Parse.Query(Sessions);
        query.matches("date", date);
        let res = await query.find();
        let result = [];
        for (let i = 0; i < res.length; i++) {
            let object = res[i];
            let item = {
                'start': object.get('start'),
                'end': object.get('end'),
                'title': object.get('title'),
                'location': object.get('location'),
                'index': i.toString(),
                'id': object.id
            };
            result.push(item)
        }
        // console.log("result ", result);
        return result;
    }

    static async loadSessionsPeople(session_id) {
        // let json = await ConnectionManager.doFetch(
        //     GLOBALS.BASE_URL + GLOBALS.URL_LOAD_SESSIONS + "?date=" + date+"&token=1316244843",
        //     'POST', null, new Headers(), true
        // );
        // console.log('json ', json);
        // return json !== undefined ? json : undefined;
        const SessionPeople = Parse.Object.extend("SessionPeople");
        const query = new Parse.Query(SessionPeople);
        query.matches("session_id", session_id);
        let res = await query.find();
        let result = [];
        for (let i = 0; i < res.length; i++) {
            let object = res[i];
            let item = {
                'people_id': object.get('people_id'),
                'replace_id': object.get('replace_id'),
                'id': object.id
            };
            result.push(item)
        }
        //console.log("result ", result);
        return result;
    }

    static async loadLocation(id) {
        // let json = await ConnectionManager.doFetch(
        //     GLOBALS.BASE_URL + GLOBALS.URL_LOAD_SESSIONS + "?date=" + date+"&token=1316244843",
        //     'POST', null, new Headers(), true
        // );
        // console.log('json ', json);
        // return json !== undefined ? json : undefined;
        const Locations = Parse.Object.extend("Locations");
        const query = new Parse.Query(Locations);
        query.matches("objectId", id);
        let res = await query.find();
        let object = res[0];
        return {
            'tilte': object.get('title'),
            'address': object.get('address'),
            'id': object.id
        };
    }

    static async saveSession(start, date, end, title, location, owner) {
        // let json = await ConnectionManager.doFetch(
        //     GLOBALS.BASE_URL + GLOBALS.URL_SESSIONS + "?usr=" + usr + "&people=" + people + "&desc=" + desc +
        //     "&date=" + date + "&stime=" + stime + "&etime=" + etime + "&location=" + location + "&force=" + force,
        //     'POST', null, new Headers(), true
        // );
        // return json !== undefined ? json : undefined;
        const Sessions = Parse.Object.extend("Sessions");
        const session = new Sessions();

        session.set("start", start);
        session.set("end", end);
        session.set("date", date);
        session.set("title", title);
        session.set("location", location);
        session.set("owner", owner);

        session.save().then((nazr) => {
            console.log("object created ", nazr.id);
            return nazr.id;
        }, (error) => {
            console.log("error: ", error.message);
            return null;
        });
    }

    static async saveSessionPeople(session_id, people_id) {
        // let json = await ConnectionManager.doFetch(
        //     GLOBALS.BASE_URL + GLOBALS.URL_SESSIONS + "?usr=" + usr + "&people=" + people + "&desc=" + desc +
        //     "&date=" + date + "&stime=" + stime + "&etime=" + etime + "&location=" + location + "&force=" + force,
        //     'POST', null, new Headers(), true
        // );
        // return json !== undefined ? json : undefined;
        const SessionPeople = Parse.Object.extend("SessionPeople");
        const session = new SessionPeople();

        session.set("session_id", session_id);
        session.set("people_id", people_id);
        session.set("replace_id", "0");

        session.save().then((nazr) => {
            console.log("object created ", nazr.id);
            return nazr.id;
        }, (error) => {
            console.log("error: ", error.message);
            return null;
        });
    }
}

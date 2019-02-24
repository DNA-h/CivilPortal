import GLOBALS from "./Globals";

export class ConnectionManager {
    static async doFetch(url, method, body, headers, callback = false) {
        console.log("url is ", url);
        console.log("body is ", body);
        // console.log("headers tag ", headers);

        // console.log('url ', url);
        if (callback)
            try {
                let response = await ConnectionManager.helperFetch(url, method, body, headers);
                // console.log('url ', url);
                //console.log('response', json);
                return response.json();
            } catch (e) {
                console.log(e.toString());
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
        let json = await ConnectionManager.doFetch(
            GLOBALS.BASE_URL + GLOBALS.URL_PEOPLE,
            'GET', null, new Headers(), true
        );
        return json !== undefined ? json : undefined;
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
        let json = await ConnectionManager.doFetch(
            GLOBALS.BASE_URL + GLOBALS.URL_LOAD_SESSIONS + "?date=" + date+"&token=1316244843",
            'POST', null, new Headers(), true
        );
        return json !== undefined ? json : undefined;
    }

    static async saveSession(usr, people, desc, date, stime, etime, location, force) {
        let json = await ConnectionManager.doFetch(
            GLOBALS.BASE_URL + GLOBALS.URL_SESSIONS + "?usr=" + usr + "&people=" + people + "&desc=" + desc +
            "&date=" + date + "&stime=" + stime + "&etime=" + etime + "&location=" + location + "&force=" + force,
            'POST', null, new Headers(), true
        );
        return json !== undefined ? json : undefined;
    }
}

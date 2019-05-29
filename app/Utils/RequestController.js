import {ConnectionManager} from "./ConnectionManager";
import DBManager from "./DBManager";

export class RequestsController {

    static async loadToken(mobile) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let json = await ConnectionManager.doFetch("http://185.211.57.73/auth/mobile/", 'POST',
            JSON.stringify({'mobile': mobile}), headers, true);
        // console.log('json is ', json);
        return json.detail;
    }

    static async SendCode(code) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let json = await ConnectionManager.doFetch("http://185.211.57.73/callback/auth/", 'POST',
            JSON.stringify({'token': code}), headers, true);
        // console.log('json is ', json);
        return json.token;
    }

    static async MySessions(day) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization','token '+await DBManager.getSettingValue('token'));
        let json = await ConnectionManager.doFetch("http://185.211.57.73/api/get-sessions-by-owner-for-day/", 'POST',
            JSON.stringify({'time': day}), headers, true);
        // console.log('json is ', json);
        return json;
    }

    static async MyPlaces() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization','token '+await DBManager.getSettingValue('token'));
        let json = await ConnectionManager.doFetch("http://185.211.57.73/api/place-by-owner/", 'POST',
            null, headers, true);
        // console.log('json is ', json);
        return json;
    }

    static async loadPeople() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization','token '+await DBManager.getSettingValue('token'));
        let json = await ConnectionManager.doFetch("http://185.211.57.73/api/get-childern-by-token/", 'POST',
            null, headers, true);
        console.log('json is ', json);
        return json;
    }
}

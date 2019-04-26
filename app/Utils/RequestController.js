import {ConnectionManager} from "./ConnectionManager";

export class RequestsController {

    static async loadToken(mobile) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let json = await ConnectionManager.doFetch("http://185.211.57.73/auth/mobile/", 'POST',
            JSON.stringify({'mobile': mobile}), headers, true);
        console.log('json is ', json);
        return json.detail;
    }

    static async SendCode(code) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let json = await ConnectionManager.doFetch("http://185.211.57.73/callback/auth/", 'POST',
            JSON.stringify({'token': code}), headers, true);
        console.log('json is ', json);
        return json.token;
    }
}

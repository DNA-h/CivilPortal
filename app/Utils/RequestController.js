import {ConnectionManager} from "./ConnectionManager";

export class RequestsController {

    static async loadToken(mobile) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let json = await ConnectionManager.doFetch("http://karbamabnd.ir/auth/mobile/", 'POST',
            JSON.stringify({'mobile': mobile}), headers, true);
        console.log('json is ', json);
        return json.detail;
    }

    static async SendCode(code) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let json = await ConnectionManager.doFetch("http://karbamabnd.ir/callback/auth/", 'POST',
            JSON.stringify({'token': code}), headers, true);
        console.log('json is ', json);
        return json.token;
    }
}

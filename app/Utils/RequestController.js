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
    headers.append('Authorization', 'token ' + await DBManager.getSettingValue('token'));
    let json = await ConnectionManager.doFetch("http://185.211.57.73/api/get-sessions-by-date/", 'POST',
      JSON.stringify({'time': day}), headers, true);
    // console.log('json is ', json);
    return json;
  }

  static async specificSession(id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'token ' + await DBManager.getSettingValue('token'));
    let json = await ConnectionManager.doFetch("http://185.211.57.73/api/session-by-id/", 'POST',
      JSON.stringify({'id': id}), headers, true);
    // console.log('json is ', json);
    return json;
  }

  static async MyPlaces() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'token ' + await DBManager.getSettingValue('token'));
    let json = await ConnectionManager.doFetch("http://185.211.57.73/api/place-by-owner/", 'POST',
      null, headers, true);
    // console.log('json is ', json);
    return json;
  }

  static async loadPeople() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'token ' + await DBManager.getSettingValue('token'));
    let json = await ConnectionManager.doFetch("http://185.211.57.73/api/get-childern-by-token/", 'POST',
      null, headers, true);
    return json;
  }

  static async loadMyself() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'token ' + await DBManager.getSettingValue('token'));
    let json = await ConnectionManager.doFetch("http://185.211.57.73/api/peoples/", 'POST',
      JSON.stringify({places: []}), headers, true);
    // console.log('json is ', json);
    return json;
  }

  static async saveAddress(title, addres, lat, lng) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'token ' + await DBManager.getSettingValue('token'));
    await ConnectionManager.doFetch("http://185.211.57.73/api/peoples/", 'POST',
      JSON.stringify({
        places: [{
          place_title: title, place_address: addres,
          Latitude: lat, Longitude: lng
        }]
      }), headers, true);
    // console.log('json is ', json);
    let json = await RequestsController.MyPlaces();
    return json;
  }

  static async shareSession(session, user) {
    let headers = new Headers();
    console.log("session ", session);
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'token ' + await DBManager.getSettingValue('token'));
    let json = await ConnectionManager.doFetch("http://185.211.57.73/api/replaces/", 'POST',
      JSON.stringify({
          rep_ppl: user,
          session_id: session,
          force: 0
        }), headers, true);
    return json;
  }

  static async saveSession(start_time, place, end_time, meeting_title, force, audiences) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'token ' + await DBManager.getSettingValue('token'));
    let aud = [];
    for (let i = 0; i < audiences.length; i++) {
      aud.push({people: audiences[i].mobile, rep_ppl: ""})
    }
    let json = await ConnectionManager.doFetch("http://185.211.57.73/api/sessions/", 'POST',
      JSON.stringify({
        start_time: start_time, place: place,
        end_time: end_time, meeting_title: meeting_title,
        force: force, audiences: aud
      }),
      headers, true);
    console.log('json is ', json);
    return json;
  }
}

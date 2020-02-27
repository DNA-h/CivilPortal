import {ConnectionManager} from "./ConnectionManager";
import DBManager from "./DBManager";

export class RequestsController {
  static async loadTodayEvents(shD, shM, wcD, wcM, icD, icM) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let json = await ConnectionManager.doFetch(
      `https://farsicalendar.com/api/sh,wc,ic/${shD},${wcD},${icD}/${shM},${wcM},${icM}`, 'GET',
      null, headers, true);
    return json;
  }

  static async loadToken(mobile) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let json = await ConnectionManager.doFetch("http://185.211.57.73/auth/mobile/", 'POST',
      JSON.stringify({'mobile': mobile}), headers, true);
    console.log('detail', json);
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

  static async seenSession(id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'token ' + await DBManager.getSettingValue('token'));
    let json = await ConnectionManager.doFetch("http://185.211.57.73/api/seen-session-by-ppl/", 'POST',
      JSON.stringify({'session_id': id}), headers, false);
    // console.log('json is ', json);
    return json;
  }

  static async sendFCMToken(token) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'token ' + await DBManager.getSettingValue('token'));
    let json = await ConnectionManager.doFetch("http://185.211.57.73/api/api/set_fcm_token/", 'POST',
      JSON.stringify({'fcm_token': token}), headers, false);
    // console.log('json is ', json);
    return json;
  }

  static async deleteSession(id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'token ' + await DBManager.getSettingValue('token'));
    let json = await ConnectionManager.doFetch("http://185.211.57.73/api/sessions/" + id + "/", 'DELETE',
      null, headers, true);
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
    let json = await ConnectionManager.doFetch("http://185.211.57.73/api/get-children/", 'GET',
      null, headers, true);
    console.log('json is ', json);
    return json;
  }

  static async loadMyself() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'token ' + await DBManager.getSettingValue('token'));
    let json = await ConnectionManager.doFetch("http://185.211.57.73/api/get_self_rank/", 'GET',
      null, headers, true);
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

  static async shareSession(session, user, force) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'token ' + await DBManager.getSettingValue('token'));
    let json = await ConnectionManager.doFetch("http://185.211.57.73/api/replaces/", 'POST',
      JSON.stringify({
        rep_ppl: user,
        session_id: session,
        force: force
      }), headers, true);
    return json;
  }

  static async saveSession(
    start_time, end_time, place, meeting_title, audiences, lng, lat, self, force) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'token ' + await DBManager.getSettingValue('token'));
    let aud = [];
    for (let i = 0; i < audiences.length; i++) {
      aud.push({people: audiences[i].mobile, rep_ppl: ""})
    }
    let json = await ConnectionManager.doFetch("http://185.211.57.73/api/sessions/", 'POST',
      JSON.stringify({
        start_time: start_time,
        end_time: end_time,
        address: place,
        Longitude: lng,
        Latitude: lat,
        meeting_title: meeting_title,
        audiences: aud,
        selfPresent: self,
        force: force,
      }),
      headers, true);
    return json;
  }
}

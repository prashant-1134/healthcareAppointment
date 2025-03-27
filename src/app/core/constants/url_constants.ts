export class  UrlConstants {

    // base application url
    baseUrl : string =  'http://localhost:8080';

    // base patient url
    patient_baseUrl : string = `${this.baseUrl}/api/patients`

    // base doctor url
     doctor_baseUrl : string = `${this.baseUrl}/api/doctors`

    // auth url for login
    auth_baseUrl : string = `${this.baseUrl}/api/auth`
}
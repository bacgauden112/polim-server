import {BaseAPIClient} from "../Base/BaseAPIClient";
import {RandomUtils} from "../../../../libs/RandomUtils";
/**
 * Created by Piggat on 8/4/2017.
 */
export class KeySecretAPIClient extends BaseAPIClient {
    private _key;
    private _secret;

    constructor(key:string, secret:string) {
        super();
        this._key = key;
        this._secret = secret;
    }

    /**
     * Gửi request đến endpoint, sử dụng HTTP METHOD method
     * @param endpoint
     * @param method
     * @param data
     * @returns {Promise<any>}
     */
    public async request(endpoint, method, data) {
        //sign request
        data.signature = this.getSignature(endpoint, method, data);

        return super.request(endpoint, method, data);
    }

    /**
     * Lấy về chữ ký với dữ liệu như yêu cầu
     * @param endpoint
     * @param method
     * @param data
     * @returns {any}
     */
    public getSignature(endpoint, method, data) {
        //sign request
        data.consumer_key = this._key;
        data.nonce = this.generateNonce();
        data.timestamp = this.getTimestamp();
        data.signature_method = 'HMAC-SHA1';

        let baseString:string = this.getBaseString(endpoint, method, data);

        let hashKey = KeySecretAPIClient.urlEncodeRfc3986(this._secret);
        let sha1 = require('hmacsha1');
        return sha1(hashKey, baseString);
    }

    //noinspection JSMethodCanBeStatic
    /**
     * Tạo ra một key chỉ sử dụng một lần để tránh call API trùng 2 lần
     */
    public generateNonce() {
        //tạo key dùng một lần bằng cách tạo chuỗi ngẫu nhiên 64 ký tự
        return RandomUtils.randomString(64);
    }

    //noinspection JSMethodCanBeStatic
    /**
     * trả về Unix timestamp hiện tại
     */
    public getTimestamp() {
        return Math.floor((new Date()).getTime()/1000);
    }

    //noinspection JSMethodCanBeStatic
    /**
     * Lấy chuỗi cơ sở để mã hóa
     * @param url
     * @param method
     * @param data
     * @returns {string}
     */
    public getBaseString(url:string, method:string,data):string {
        let parts:string[] = ['','',''];

        parts[0] = method.toUpperCase();
        parts[1] = KeySecretAPIClient.urlEncodeRfc3986(url);
        parts[2] = KeySecretAPIClient.urlEncodeRfc3986(KeySecretAPIClient.standardHttpQuery(data));
        return parts.join('&');
    }

    /**
     * Đưa url về chuẩn RFC 3986
     * @param url
     * @returns {string}
     */
    private static urlEncodeRfc3986(url:string):string {
        return encodeURIComponent(url);
    }

    /**
     * Đưa data về dạng query chuẩn, có sắp xếp theo thứ tự Alphabet
     * @param data
     * @param isPost
     * @returns {any}
     */
    private static standardHttpQuery(data, isPost = false) {
        let keys = Object.keys(data);

        if (keys.length === 0) {
            return '';
        }

        keys.sort();

        let keyValuePair = [];

        for (let ii = 0; ii < keys.length; ii ++) {
            let value = data[keys[ii]];

            if (isPost && value !== null && value !== '') {
                value = encodeURIComponent(value);
            }

            keyValuePair.push(`${keys[ii]}=${value}`);
        }

        return keyValuePair.join('&');
    }
}
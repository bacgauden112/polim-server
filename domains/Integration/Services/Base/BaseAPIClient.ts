import {ErrorFactory} from "../../../../server/utils/ErrorFactory";
/**
 * Created by Piggat on 8/4/2017.
 */
require('isomorphic-fetch');
declare let fetch:IFetch;
/**
 * Lớp cơ sở cho các HTTP API client
 */
export class BaseAPIClient {
    constructor() {
        this._compress = false;
    }

    protected _accessToken;
    protected _timeout;
    protected _compress;

    public set AccessToken(value) {
        this._accessToken = value;
    }

    public set Timeout(value) {
        this._timeout = value;
    }

    public async request(url, method, data) {
        if (/^\/\//.test(url)) {
            url = 'https:' + url;
        }

        let config;
        if (method != 'GET') {
            config = this.getRequestConfig(method, data);
            url = url + this.getQueryString('x');
        }
        else {
            config = this.getRequestConfig(method, data);
            url = url + this.getQueryString(data);
        }

        // let argv = require('minimist')(process.argv.slice(2));
        // if (!argv.hideUrl) {
        //     console.info(method, url);
        // }

        try {
            let fetched = await fetch(url, config);
            return fetched;
        }
        catch (err) {
            if (err.name === 'FetchError' && err.type === 'request-timeout') {
                throw ErrorFactory.createError(
                    'Dịch vụ liên kết phản hồi chậm hoặc không có kết quả, quý khách vui lòng thử lại sau',450, 'REQUEST_TIME_OUT');
            }
        }
    }

    /**
     * Create query string from data to send
     * @param data
     * @returns {any}
     */
    protected getQueryString(data):string {
        if (!data) {
            return '';
        }

        let query = '';
        for (let key in data) {
            if (!data.hasOwnProperty(key)) {
                continue;
            }
            if (typeof data[key] == 'object') {
                if (typeof data[key].toJSON === 'function') {
                    query += encodeURIComponent(key)+"="+encodeURIComponent(data[key].toJSON())+"&";
                }
                else {
                    query += encodeURIComponent(key)+"="+encodeURIComponent(JSON.stringify(data[key]))+"&";
                }
            }
            else {
                query += encodeURIComponent(key)+"="+encodeURIComponent(data[key])+"&";
            }
        }

        return '?' + query;
    }

    protected getRequestConfig(method, data) {
        return this.getRestfulRequestConfig(method, data, 'Authorization', this._accessToken);
    }

    /**
     * Tạo config để fetch dữ liệu qua http
     * @param method
     * @param data
     * @param authorizationKey
     * @param accessToken
     * @returns {any}
     */
    protected getRestfulRequestConfig(method, data, authorizationKey, accessToken) {
        if (method === 'GET') {
            data = data ? data : '';
        }
        let body = typeof data === 'string' ? data : JSON.stringify(data);
        let config = {
            method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'User-Agent': 'Polim NodeJs Fetch'
            },
            body,
            timeout: this._timeout || 5000,
            compress: this._compress
        };

        if (authorizationKey) {
            config.headers[authorizationKey] = accessToken ? accessToken : '';
        }

        return config;
    }
}

interface IFetch {
    (url:string, config:any): Promise<any>
}

export const HttpMethod = {
    GET: 'GET',
    POST: 'POST',
    DELETE: 'DELETE'
};
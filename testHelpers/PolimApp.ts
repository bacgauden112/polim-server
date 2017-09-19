/**
 * Created by Piggat on 8/1/2017.
 */
const path = require('path');
require('isomorphic-fetch');
declare let fetch:IFetch;
export const SECRET = {
    BAOGAM: 'BAOGAM_STAGING',
    SEUDO: 'SEUDO_STAGING'
}

/**
 * Polim Server app to do action
 */
export class PolimServerApp {
    /**
     * Loopback
     */
    private _loopback;

    /**
     * Main app
     */
    private _app;

    /**
     * Worker process
     */
    private _worker;

    constructor() {
        this._loopback = require('loopback');
        this._app = require('../server/server');

        (<any>global).dirname = __dirname + path.sep+ '..'+ path.sep+ 'server';

        this._worker = require("../server/worker");
    }

    public get Server() {
        return this._app;
    }

    private static _instance;
    public static getInstance():PolimServerApp {
        if (PolimServerApp._instance == null) {
            PolimServerApp._instance = new PolimServerApp();
        }

        return PolimServerApp._instance;
    }

    public static getClient(externalToken=null, secretKey=null, externalId = null) {
        let argv = require('minimist')(process.argv.slice(2));
        let baseUrl:string;
        if (argv.baseUrl) {
            baseUrl = argv.baseUrl;
        }
        else {
            baseUrl = 'http://localhost:3000/api/';
        }
        return new PolimClient(baseUrl, externalToken, secretKey, externalId);
    }
}

/**
 * Polim mock client
 */
export class PolimClient {
    private _externalToken;
    private _secretKey;
    private _externalId;
    private _accessToken;
    private _baseUrl;

    constructor(baseUrl = null, externalToken= null, secretKey = null, externalId = null) {
        this._externalToken = externalToken;
        this._accessToken = '';
        this._secretKey = secretKey;
        this._externalId = externalId;
        this._baseUrl = baseUrl;
    }

    public set AccessToken(value) {
        this._accessToken = value;
    }

    public set SecretKey(value) {
        this._secretKey = value;
    }

    /**
     * Gửi request
     * @param url
     * @param method
     * @param data
     * @returns {Promise<any>}
     */
    public async request(url, method = RequestMethod.GET, data = {}) {
        if (this._baseUrl) {
            url = this._baseUrl + url;
        }

        let externalToken = this._externalToken;
        let accessToken = this._accessToken;
        let secretKey = this._secretKey;
        let externalId = this._externalId;

        if (/^\/\//.test(url)) {
            url = 'https:' + url;
        }

        let config;
        if (method != 'GET') {
            config = PolimClient.getRestfulRequestConfig(method, data ? data : '', accessToken, externalToken, secretKey, externalId);
        }
        else {
            config = PolimClient.getRestfulRequestConfig(method, '', accessToken, externalToken, secretKey, externalId);
            if (data) {
                let query = '';
                for (let key in data) {
                    if (!data.hasOwnProperty(key)) {
                        continue;
                    }
                    if (typeof data[key] == 'object') {
                        query += encodeURIComponent(key)+"="+encodeURIComponent(JSON.stringify(data[key]))+"&";
                    }
                    else {
                        query += encodeURIComponent(key)+"="+encodeURIComponent(data[key])+"&";
                    }
                }
                url = url + '?' + query;
            }
        }

        let argv = require('minimist')(process.argv.slice(2));
        if (!argv.hideUrl) {
            console.info(method, url);
        }

        let fetched = await fetch(url, config);
        return fetched;
    }

    /**
     * Tạo config để fetch dữ liệu qua http
     * @param method
     * @param data
     * @param authenticate
     * @returns {{method: any, headers: {Accept: string, Content-Type: string, Authorization: string}, body: string}}
     */
    private static getRestfulRequestConfig(method, data, authenticate, externalToken, secret, external) {
        let body = typeof data === 'string' ? data : JSON.stringify(data);

        return {
            method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': authenticate ? authenticate : '',
                'x-secret-key': secret ? secret : '',
                'external-id': external,
                'access-token': externalToken ? externalToken : ''
            },
            body,
        }
    }
}

export const RequestMethod = {
    PUT: 'PUT',
    PATCH: 'PATCH',
    POST: 'POST',
    GET: 'GET'
};

interface IFetch {
    (url:string, config:any): Promise<any>
}
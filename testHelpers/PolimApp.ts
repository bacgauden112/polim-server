/**
 * Created by Piggat on 8/1/2017.
 */
const path = require('path');
require('isomorphic-fetch');
declare let fetch:IFetch;

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

    public static getClient() {
        let argv = require('minimist')(process.argv.slice(2));
        let baseUrl:string;
        if (argv.baseUrl) {
            baseUrl = argv.baseUrl;
        }
        else {
            baseUrl = 'http://localhost:3000/api/';
        }
        return new PolimClient(baseUrl);
    }
}

/**
 * Polim mock client
 */
export class PolimClient {
    private _accessToken;
    private _baseUrl;

    constructor(baseUrl = null) {
        this._accessToken = '';
        this._baseUrl = baseUrl;
    }

    public set AccessToken(value) {
        this._accessToken = value;
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

        let accessToken = this._accessToken;

        if (/^\/\//.test(url)) {
            url = 'https:' + url;
        }

        let config;
        if (method != 'GET') {
            config = PolimClient.getRestfulRequestConfig(method, data ? data : '', accessToken);
        }
        else {
            config = PolimClient.getRestfulRequestConfig(method, '', accessToken);
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
    private static getRestfulRequestConfig(method, data, authenticate) {
        let body = typeof data === 'string' ? data : JSON.stringify(data);
        return {
            method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': authenticate ? authenticate : ''
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
import {PolimClient, RequestMethod} from "../PolimApp";
/**
 * Created by Piggat on 8/3/2017.
 * Lớp actor cơ bản
 */
export class BaseActor {
    protected _polimClient;
    protected _accessToken;

    constructor() {
        let argv = require('minimist')(process.argv.slice(2));
        let baseUrl:string;
        if (argv.baseUrl) {
            baseUrl = argv.baseUrl;
        }
        else {
            baseUrl = 'http://localhost:3000/api/';
        }
        this._polimClient = new PolimClient(baseUrl);
    }

    public get AccessToken() {
        return this._accessToken;
    }

    /**
     * Gửi request sử dụng access token của khách hàng này
     * @param url
     * @param method
     * @param data
     * @returns {}
     */
    public async request(url, method = RequestMethod.GET, data = {}) {
        this._polimClient.AccessToken = this._accessToken;
        return await this._polimClient.request(url, method, data)
    }
}
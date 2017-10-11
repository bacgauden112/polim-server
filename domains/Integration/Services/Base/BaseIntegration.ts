import {BaseDomainService} from "../../../Base/BaseDomainService";
import IntegrationSetting = Models.IntegrationSetting;
import {BaseAPIClient} from "./BaseAPIClient";
import Customer = Models.Customer;
import CustomerIntegration = Models.CustomerIntegration;
import LoopBackBase = LoopBack.LoopBackBase;
import IntegrationDomain from "../../IntegrationDomain";
export class BaseIntegration extends BaseDomainService {
    protected _name: string;
    protected _id: number;
    protected _code: string;
    protected _secret_key: string;
    protected _settings:any = {};
    protected _client;
    protected _implementation: any;
    protected _domain:IntegrationDomain;
    protected _parent:BaseIntegration;

    constructor(id, name, code, secret_key) {
        super(new IntegrationDomain);
        this._id = id;
        this._name = name;
        this._code = code;
        this._secret_key = secret_key;
        this._settings = {};

        this._implementation = {};
    }

    /**
     * Load integration settings from database
     * @returns {Promise<void>}
     */
    public async loadSetting() {
        let settingModels = this._domain.IntegrationSetting;

        let settings:IntegrationSetting[] = await settingModels.find({
            where: {
                integrationId: this._id,
                customerId: null
            }
        });

        for (let setting of settings) {
            this._settings[setting.key] = setting.value;
        }
    }

    /**
     * Set parent Integration
     * @param value
     * @constructor
     */
    public set Parent(value) {
        this._parent = value;
    }

    /**
     * Lấy setting về
     * @param setting
     * @param defaultValue
     */
    public getSetting(setting, defaultValue = '') {
        if (this._settings.hasOwnProperty(setting)) {
            return this._settings[setting];
        }

        return defaultValue;
    }

    /**
     * Create API client object
     */
    protected async createClient(customerId: number): Promise<BaseAPIClient> {
        if (this._parent) {
            return this._parent.createClient(customerId);
        }
        let accessToken = await this.getAccessToken(customerId);
        // get externalId
        let externalId = await this.getExternalId(customerId);
        return await this.createClientWithAccessToken(accessToken, externalId);
    }

    /**
     * Create API client object with known access token
     * @param accessToken
     * @returns {Promise<BaseAPIClient>}
     */
    protected async createClientWithAccessToken(accessToken:string, externalId:number):Promise<BaseAPIClient> {
        if (this._parent) {
            return this._parent.createClientWithAccessToken(accessToken, externalId);
        }
        let client = new BaseAPIClient();
        client.AccessToken = accessToken;
        client.ExternalId= externalId;
        return client;
    }

    /**
     * Get access token from customer id
     * @param customerId
     * @returns {Promise<string>}
     */
    protected async getAccessToken(customerId:number):Promise<string> {
        if (this._parent) {
            return this._parent.getAccessToken(customerId);
        }
        let loopback:LoopBackBase = require('loopback');
        let customerIntegrationModel = loopback.getModel('CustomerIntegration');

        let integration:CustomerIntegration = await customerIntegrationModel.findOne({
            where: {
                customerId: customerId,
                integrationId: this._id
            }
        });

        if (!integration) {
            throw new Error(`Customer ${customerId} has not installed ${this._name} yet`);
        }

        return integration.accessToken;
    }

    /**
     * Lấy externalId
     * @param {number} customerId
     * @returns {Promise<string>}
     */
    protected async getExternalId(customerId:number):Promise<number> {
        if (this._parent) {
            return this._parent.getExternalId(customerId);
        }
        let loopback:LoopBackBase = require('loopback');
        let customerIntegrationModel = loopback.getModel('CustomerIntegration');

        let integration:CustomerIntegration = await customerIntegrationModel.findOne({
            where: {
                customerId: customerId,
                integrationId: this._id
            }
        });

        if (!integration) {
            throw new Error(`Customer ${customerId} has not installed ${this._name} yet`);
        }

        return integration.externalId;
    }

    /**
     * Thêm implementation vào trong đối tượng này, sử dụng để tạo ra các dịch vụ phức hợp
     * Kết hợp của nhiều component khác nhau
     * (hiện chưa sử dụng)
     * @param name
     * @param desiredClassObject
     */
    public addImplementation(name:string, desiredClassObject: BaseIntegration) {
        //overwrite desired base function with my function
        //desiredClassObject.createClientWithAccessToken = this.createClientWithAccessToken;
        //desiredClassObject.createClient = this.createClient;
        //desiredClassObject.getAccessToken = this.getAccessToken;
        desiredClassObject._settings = this._settings;
        desiredClassObject._parent = this;

        this._implementation[name] = desiredClassObject;
    }

    /**
     * Lấy một implementation từ trong class gốc
     * @param name
     * @returns {any}
     */
    public getImplementation<T>(name) {
        if (this._implementation.hasOwnProperty(name)) {
            return this._implementation[name];
        }

        return null;
    }
}
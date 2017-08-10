import {BaseDomainService} from "../../../Base/BaseDomainService";
import IntegrationSetting = Models.IntegrationSetting;
import {BaseAPIClient} from "./BaseAPIClient";
import Customer = Models.Customer;
import CustomerIntegration = Models.CustomerIntegration;
export class BaseIntegration extends BaseDomainService {
    protected _name: string;
    protected _id: number;
    protected _code: string;
    protected _secret_key: string;
    protected _settings:any = {};
    protected _client;

    constructor(id, name, code, secret_key) {
        super();
        this._id = id;
        this._name = name;
        this._code = code;
        this._secret_key = secret_key;
        this._settings = {};
    }

    /**
     * Load integration settings from database
     * @returns {Promise<void>}
     */
    public async loadSetting() {
        let loopback = this._loopback();
        let settingModels = loopback.models.IntegrationSetting;

        let settings:IntegrationSetting[] = await settingModels.find({
            where: {
                integrationId: this._id,
                customerId: null
            }
        });

        for (let setting of settings) {
            this._settings[setting.key] = this._settings[setting.value];
        }
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
        let accessToken = await this.getAccessToken(customerId);
        return this.createClientWithAccessToken(accessToken);
    }

    /**
     * Create API client object with known access token
     * @param accessToken
     * @returns {Promise<BaseAPIClient>}
     */
    protected async createClientWithAccessToken(accessToken:string):Promise<BaseAPIClient> {
        let client = new BaseAPIClient();
        client.AccessToken = accessToken;
        return client;
    }

    protected async getAccessToken(customerId:number):Promise<string> {
        let loopback = require('loopback')();
        let customerIntegrationModel = loopback.models.CustomerIntegration;

        let integration:CustomerIntegration = customerIntegrationModel.findOne({
            where: {
                customerId: customerId
            }
        });

        if (!integration) {
            throw new Error(`Customer ${customerId} has not installed ${this._name} yet`);
        }

        return integration.accessToken;
    }

    /**
     * Thêm implementation vào trong đối tượng này, sử dụng để tạo ra các dịch vụ phức hợp
     * Kết hợp của nhiều component khác nhau
     * (hiện chưa sử dụng)
     * @param desiredClassObject
     */
    public addImplementation(desiredClassObject) {
        Object.assign(this,desiredClassObject);
    }
}
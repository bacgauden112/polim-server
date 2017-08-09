import {BaseDomainService} from "../../../Base/BaseDomainService";
import IntegrationSetting = Models.IntegrationSetting;
import {BaseAPIClient} from "./BaseAPIClient";
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
     * Create client object
     */
    protected createClient() {
        this._client = new BaseAPIClient();
    }

    /**
     * Get current client object
     * @returns {any}
     */
    public getClient() {
        if (!this._client) {
            this.createClient();
        }
        return this._client;
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
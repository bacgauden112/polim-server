import {BaseIntegration} from "../Base/BaseIntegration";
import {KeySecretAPIClient} from "./KeySecretAPIClient";
import {BasePurchasing} from "../Base/BasePurchasing";
import {APIClient} from "./APIClient";
import {BaseAPIClient} from "../Base/BaseAPIClient";
/**
 * Created by Piggat on 8/4/2017.
 */
export class SeuDoService extends BaseIntegration {

    constructor(id, name, code, secret_key) {
        super(id, name, code, secret_key);
    }

    public async loadSetting() {
        await super.loadSetting();

        this.addImplementation('IPurchasing',new BasePurchasing(
            this._id, this._name, this._code, this._secret_key));
    }

    /**
     * Create client object
     */
    protected async createClientWithAccessToken(accessToken: string):Promise<BaseAPIClient> {
        let client = new APIClient();
        client.AccessToken = accessToken;
        return client;
    }
}
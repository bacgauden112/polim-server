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

        this.addImplementation(new BasePurchasing(id, name, code, secret_key));
    }

    /**
     * Create client object
     */
    protected async createClient(customerId: number):Promise<BaseAPIClient> {
        let client = new APIClient();
        client.AccessToken = this.getAccessToken(customerId);
        return client;
    }
}
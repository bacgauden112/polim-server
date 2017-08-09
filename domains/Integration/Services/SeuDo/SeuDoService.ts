import {BaseIntegration} from "../Base/BaseIntegration";
import {KeySecretAPIClient} from "./KeySecretAPIClient";
import {BasePurchasing} from "../Base/BasePurchasing";
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
    protected createClient() {
        this._client = new KeySecretAPIClient(this.getSetting('API_KEY'),
            this.getSetting('API_SECRET'));
    }
}
import {BaseDomainPackage} from "../Base/BaseDomainPackage";
/**
 * Created by Piggat on 8/22/2017.
 */
export default class IntegrationDomain extends BaseDomainPackage {
    get CustomerIntegration() {
        return this.getModel('CustomerIntegration');
    }

    get Integration() {
        return this.getModel('Integration');
    }

    get IntegrationSetting() {
        return this.getModel('IntegrationSetting');
    }
}
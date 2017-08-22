import {BaseDomainPackage} from "../Base/BaseDomainPackage";
/**
 * Created by Piggat on 8/20/2017.
 */
export default class CustomerDomain extends BaseDomainPackage {
    public get Customer() {
        return this.getModel('Customer');
    }
}
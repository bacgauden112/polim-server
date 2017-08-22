import LoopBackBase = LoopBack.LoopBackBase;
import {BaseDomainPackage} from "./BaseDomainPackage";
/**
 * Created by Piggat on 7/26/2017.
 */
export class BaseDomainService {
    private _loopback:LoopBackBase;
    /**
     * Contains public models of this domain
     */
    protected _domain:BaseDomainPackage;
    protected static _serviceInstances = [];

    constructor(domain: BaseDomainPackage = null) {
        this._loopback = require('loopback');
        if (domain) {
            this._domain = domain;
        }
    }
    
    /**
     * Get singleton instance
     * @returns this
     */
    public static getInstance<T extends BaseDomainService>(): T {
        let key = (<any>this).name;

        if (!BaseDomainService._serviceInstances[key]) {
            BaseDomainService._serviceInstances[key] = new this;
        }

        return BaseDomainService._serviceInstances[key];
    }
}
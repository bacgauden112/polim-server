import LoopBackBase = LoopBack.LoopBackBase;
/**
 * Created by Piggat on 7/26/2017.
 */
export class BaseDomainService {
    protected _loopback:LoopBackBase;
    protected static _serviceInstances = [];

    constructor() {
        this._loopback = require('loopback');
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
import LoopBackBase = LoopBack.LoopBackBase;
/**
 * Created by Piggat on 8/20/2017.
 */
export class BaseDomainPackage {
    private _loopback:LoopBackBase;

    constructor() {
        this._loopback = require('loopback');
    }

    protected getModel(modelName: string) {
        return this._loopback.getModel(modelName);
    }
}
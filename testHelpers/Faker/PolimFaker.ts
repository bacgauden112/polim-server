import {NameService} from "./Services/NameService";
/**
 * Created by Piggat on 8/4/2017.
 */
export class PolimFaker {
    private _name;

    constructor() {
        this._name = new NameService;
    }

    public get Name():NameService {
        return this._name;
    }
}
import {BackgroundWorker} from "./BackgroundWorker";
/**
 * Created by Piggat on 1/5/2017.
 */
export class IntervalWorker extends BackgroundWorker {
    private _doWork;
    private _interval;
    private _intervalHandler;
    private _isInProcess;
    private _singleProcess;

    constructor(doWork, interval, singleProcess = true) {
        super();
        this._doWork = doWork;
        this._interval = interval;
        this._singleProcess = singleProcess;
        this._isInProcess = false;
    }

    async startWork(): Promise<any> {
        let process = this;
        this._intervalHandler = setInterval(function() {
            process.doTask();
        }, this._interval);
        return this;
    }

    protected doTask() {
        this._isInProcess = true;
        let i = this;
        if (!this._isShutdown) {
            let t = this._doWork();
            if (t && t.then) {
                t.then(()=> {
                    i._isInProcess = false;
                });
            }
            else {
                this._isInProcess = false;
            }
        }
        else {
            clearInterval(this._intervalHandler);
            this.exit();
        }
    }
}
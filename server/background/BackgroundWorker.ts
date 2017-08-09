import {ProcessManager} from "./ProcessManager";
/**
 * Created by Piggat on 1/5/2017.
 * Process chạy background
 */
export abstract class BackgroundWorker {
    protected _isShutdown: boolean;
    protected _isRunning: boolean;
    protected _manager:ProcessManager;

    constructor() {
        this._isShutdown = false;
    }

    /**
     * Gắn process này vào một ProcessManager
     * @param value
     * @constructor
     */
    set Manager(value) {
        this._manager = value;
    }

    /**
     * Hàm startWork chứa logic cần chạy
     */
    public abstract async startWork(): Promise<BackgroundWorker>;

    /**
     * Bật cho process chạy cùng với một ProcessManager
     * @param manager
     */
    public run(manager:ProcessManager) {
        this._isRunning = true;
        this.startWork().then((process)=> {
            manager.addProcess(process);
        });
    }

    /**
     * Đánh dấu dừng process này
     */
    public shutdown() {
        this._isShutdown = true;
    }

    /**
     * Thoát process
     */
    public exit() {
        this._manager.onProcessStopped();
    }
}
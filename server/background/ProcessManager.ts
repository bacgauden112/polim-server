import {BackgroundWorker} from "./BackgroundWorker";
/**
 * Created by Piggat on 1/6/2017.
 * Quản lý các process giúp chạy background
 */
export class ProcessManager {
    private _processes: BackgroundWorker[];
    private _processCount;
    private _exit: boolean;

    /**
     * Khởi tạo
     */
    constructor () {
        this._processes = [];
        this._processCount = 0;
        this._exit = true;
    }

    /**
     * Thêm process chạy mới
     * @param process
     */
    public addProcess(process: BackgroundWorker) {
        this._processes.push(process);
        this._processCount++;
        process.Manager = this;
    }

    /**
     * Xử lý khi process dừng, nếu tất cả các process dừng thì sẽ exit
     */
    public onProcessStopped() {
        this._processCount--;
        console.info(this._processCount);

        if (this._exit && this._processCount == 0) {
            if (typeof this.onExit === 'function') {
                this.onExit();
            }
        }
    }

    /**
     * Tắt tất cả các process mà nó đang quản lý
     */
    public shutdownAll() {
        let instance = this;
        if (this._processes.length == 0) {
            setTimeout(function() {
                instance.onExit();
            }, 1000);
        }

        for (let process of this._processes) {
            process.shutdown();
        }
    }

    public onExit;
}
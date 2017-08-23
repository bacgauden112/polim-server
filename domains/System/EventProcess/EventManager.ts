/**
 * Created by Piggat on 2/22/2017.
 * Event Manager control event-based application logic with
 */
export class EventManager {
    private static _eventHandlers:any = {};
    private static _instance;
    public static _canRun = true;

    /**
     * Singleton
     * @returns {any}
     */
    public static getInstance():EventManager {
        if (!EventManager._instance) {
            EventManager._instance = new EventManager();
        }

        return EventManager._instance;
    }

    /**
     * Ghi lại một event dành cho objectType với id là objectId, bao gồm thêm tên event và tham số event
     * @param objectType
     * @param objectId
     * @param eventName
     * @param params
     */
    public static emitEvent(objectType, objectId, eventName, params) {
        EventManager.getInstance().emitEvent(objectType, objectId, eventName, params);
    }

    /**
     * Đăng ký event handler
     * @param objectType
     * @param eventName
     * @param handler
     */
    public static registerHandler(objectType, eventName, handler: EventHandler) {
        if (!EventManager._eventHandlers[`${objectType}.${eventName}`]) {
            EventManager._eventHandlers[`${objectType}.${eventName}`] = [];
        }
        let eventHandlers = EventManager._eventHandlers[`${objectType}.${eventName}`];
        eventHandlers.push(handler);
    }

    /**
     * Thực thi một loạt các event, chưa implement
     */
    public static executeEvents() {
        let instance = EventManager.getInstance();
    }

    private _loopback;
    private _model;
    private _sleepTime = 750;

    constructor() {
        this._loopback = require('loopback');
        this._model = this._loopback.getModel('EventQueue');
    }

    /**
     * Phát ra một event
     * @param objectType
     * @param objectId
     * @param eventName
     * @param params
     */
    public emitEvent(objectType, objectId, eventName, params) {
        this._model.create({
            objectType: objectType,
            objectId: objectId,
            eventName: eventName,
            params: params,
            createdAt: new Date(),
            executedTimes: 0,
            isSuccess: 0,
            errors: ''
        });
    }

    /**
     * Thực thi 01 event tiếp theo
     * @returns {Promise<boolean>}
     */
    public async executeNextEvent():Promise<boolean> {
        let events = await this._model.find({limit: 1, where: { isSuccess: 0}});
        if (events.length == 0) {
            return false; //nothing to do
        }

        return await this.executeEvent(events[0]);
    }

    /**
     * Thực thi event được truyền vào
     * @param event
     * @returns {Promise<boolean>}
     */
    public async executeEvent(event) {
        let objType = event.objectType;
        let key = `${objType}.${event.eventName}`;
        let errors = [];
        if (EventManager._eventHandlers[key]) {
            let model = this._loopback.getModel(objType);
            if (!model) {
                //TODO: handle errors and retry
                await event.updateAttributes({
                    executedTimes: event.executedTimes + 1,
                    errors: 'Model not found',
                    isSuccess: 1
                });
                return true;
            }
            let obj = await model.findById(event.objectId);
            for (let handler of EventManager._eventHandlers[key]) {
                let error = await handler(obj, event.params, event.createdAt);
                errors.push(error);
            }
        }

        await event.updateAttributes({
            executedAt: new Date(),
            isSuccess: 1,
            errors: errors.length > 0 ? JSON.stringify(errors) : ''
        });
        return true;
    }

    /**
     * Chạy xử lý event liên tục, nếu không còn event nào thì sẽ dừng chạy trong vòng sleepTime
     * @param sleepTime
     * @returns {Promise<void>}
     */
    public async run(sleepTime = 750) {
        this._sleepTime = sleepTime;
        let lastExecuted = true;
        while (EventManager._canRun) {
            try {
                lastExecuted = await this.runQueue(!lastExecuted);
            }
            catch (err) {
                lastExecuted = false;
            }

            if (!lastExecuted) {
                //console.info('what a peaceful time, with no event to run we will sleep for a while');
            }
        }
    }

    /**
     * Thực thi việc chạy xử lý event, nếu delay = true thì đợi theo _sleepTime, nếu delay = false thì chạy sau 1ms
     * @param delay
     * @returns {Promise<boolean>}
     */
    private runQueue(delay = true):Promise<boolean> {
        let timeout = 1;
        if (delay) {
            timeout = this._sleepTime;
        }
        let instance = this;
        return new Promise<boolean>((resolve, reject)=> {
            setTimeout(function() {
                instance.executeNextEvent().then((result)=> {
                    resolve(result);
                }).catch((err) => {
                    reject(err);
                });
            },timeout);
        });
    }
}

/**
 * Interface for one event handler
 */
export interface EventHandler {
    (obj, params, eventTime): Promise<any>
}
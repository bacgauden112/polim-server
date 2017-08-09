/**
 * Created by Piggat on 9/28/2016.
 */
let winston = require('winston');
export class Logger {
    public static _loggers = [];
    public static _instances = [];
    private _winstonLogger;

    constructor(logger) {
        this._winstonLogger = logger;
    }

    //region -- static methods --
    public static error(err: any, context = null, logger = winston) {
        logger.error('Error name: ' + err.name
            + ' Error message: ' + err.message + '\r\n Stack:' + err.stack, context);
    }

    public static debug(message:any, context = null, logger = winston) {
        logger.debug(message, context);
    }
    public static warn(message:any, context = null, logger = winston) {
        logger.warn(message, context);
    }
    public static info(message:any, context = null, logger = winston) {
        logger.info(message, context);
    }

    public static getDirname() {
        return (<any>global).dirname || __dirname;
    }

    public static factory(channel: any, level = 'info'):Logger {
        if (!Logger._instances[channel]) {
            let logger = new (winston.Logger)({
                transports: [
                    new (winston.transports.Console)()
                ]
            });
            let path = require('path');
            let dirname = Logger.getDirname();

            logger.add(require('winston-daily-rotate-file'), {
                datePattern: 'yyyyMMdd',
                dirname: path.join(dirname, "log"),
                filename: path.join(dirname, "log", channel + ".txt"),
                level: level
            });

            Logger._loggers[channel] = logger;
            Logger._instances[channel] = new Logger(logger);
        }

        return Logger._instances[channel];
    }
    //endregion

    public error(err, context = null):void {
        Logger.error(err, context, this._winstonLogger);
    }

    public debug(message, context = null):void {
        Logger.debug(message, context, this._winstonLogger);
    }

    public warn(message, context = null):void {
        Logger.warn(message, context, this._winstonLogger);
    }

    public info(message, context = null):void {
        Logger.info(message, context, this._winstonLogger);
    }
}
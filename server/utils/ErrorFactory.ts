/**
 * Created by Piggat on 7/26/2017.
 */
import IRemoteMethodCallback = LoopBack.IRemoteMethodCallback;
/**
 * Created by Piggat on 9/19/2016.
 */
export class ErrorFactory{
    public static UNEXPECTED_ERROR_MESSAGE = 'Lỗi hệ thống (chưa xác định), vui lòng liên hệ kỹ thuật để cảnh báo';

    constructor (err, callback: IRemoteMethodCallback) {
        callback(null, {
            error: {
                "statusCode": err.statusCode
            }
        });
    }

    /**
     * Create Error object
     * @param message
     * @param httpCode
     * @param code
     * @param details
     */
    public static createError(message: string, httpCode: number, code: string, details = null) {
        let err:any = new Error();
        err.statusCode = httpCode;
        err.code = code;
        err.message = message;

        if (err.statusCode < 500 && details) {
            err.details = details;
        }
        return err;
    }

    //public static createValidationError()

    public static ERRORS = {
        E101_NOT_IMPLEMENTED: {
            code: 'E101_NOT_IMPLEMENTED',
            message: 'This function has not yet implemented, either because it is not supported yet or integration app has not support it'
        }
    }
}
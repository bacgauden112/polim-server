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
     */
    public static createError(message: string, httpCode: number, code: string) {
        let err:any = new Error(message);
        err.statusCode = httpCode;
        err.code = code;
        err.name = code;
        err.message = message;
        return err;
    }

    //public static createValidationError()
}
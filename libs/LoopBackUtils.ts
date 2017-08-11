/**
 * Created by Piggat on 8/10/2017.
 */
export class LoopBackUtils {
    /**
     * Xử lý một promise, sử dụng callback
     * @param promise
     * @param callback
     */
    public static processPromiseCallback(promise: Promise<any>, callback) {
        promise.then((data)=> {
            callback(null, data);
        }).catch((err) => {
            callback(err);
        });
    }
}
/**
 * Created by Piggat on 7/25/2017.
 */
export class SharedUtils {
    /**
     * Await this for pause
     * @param ms
     * @returns {Promise<T>|Promise}
     */
    public static delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
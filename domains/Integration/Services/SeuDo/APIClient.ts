import {BaseAPIClient} from "../Base/BaseAPIClient";
/**
 * Created by Piggat on 8/9/2017.
 */
export class APIClient extends BaseAPIClient {
    /**
     * Overwrite request config, without access token in header
     * @param method
     * @param data
     * @returns {any}
     */
    protected getRequestConfig(method, data) {
        return this.getRestfulRequestConfig(method, data, null, this._accessToken);
    }

    /**
     * Overwrite get query string, add token to it
     * @param data
     * @returns {string}
     */
    protected getQueryString(data):string {
        let query = super.getQueryString(data);
        if (query == '') {
            query = `?token=${this._accessToken}`;
        }
        else {
            query += `&token=${this._accessToken}`;
        }

        return query
    }
}
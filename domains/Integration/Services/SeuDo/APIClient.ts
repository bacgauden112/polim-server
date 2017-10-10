import {BaseAPIClient} from "../Base/BaseAPIClient";
import {Logger} from "../../../../libs/Logger";
import {IntegrationAPIError} from "../Base/IntegrationErrors";

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
    protected getQueryString(data): string {
        let query = super.getQueryString(data);
        if (data == 'x') {
            query = `&token=${this._accessToken}`;
        }
        if (query == '') {
            query = `?token=${this._accessToken}`;
        }
        else {
            query += `&token=${this._accessToken}`;
        }

        return query
    }

    /**
     * Overwrite request, because SD return its data in data property instead of root
     * @param url
     * @param method
     * @param data
     */
    public async request(url, method, data) {
        let response = await super.request(url, method, data);

        if(response.status == 500 || response.status == 200) {
            data = await response.json();

            return {
                status: data.error ? 888 : 200,
                json: function () {
                    return data.data;
                }
            };
        }
        throw IntegrationAPIError;
    }
}
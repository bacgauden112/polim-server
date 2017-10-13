import {BaseAPIClient} from "../Base/BaseAPIClient";
import {Logger} from "../../../../libs/Logger";
import {IntegrationAPIError} from "../Base/IntegrationErrors";
import {ErrorFactory} from "../../../../server/utils/ErrorFactory";

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
            query = `?token=${this._accessToken}&userId=${this._externalId}`;
        }
        if (query == '') {
            query = `?token=${this._accessToken}&userId=${this._externalId}`;
        }
        else {
            query += `&token=${this._accessToken}&userId=${this._externalId}`;
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
        data = await response.json();

        // Lỗi trả về bên Sếu Đỏ
        if(response.status == 500 ) {
            throw ErrorFactory.createError(data.data.errorMessage, 400, data.data.errorMessage);
        }
        // Thành công
        if(response.status == 200) {
            return {
                status: 200,
                json: function () {
                    return data.data;
                }
            };
        }
        // Lỗi kết nối
        let logger = Logger.factory('integration');
        let context = {
            request: {
                url: url,
                data: data
            },
            response: await response.text()
        };
        logger.error(new Error("Error response from server"), context);
        throw IntegrationAPIError;
    }
}
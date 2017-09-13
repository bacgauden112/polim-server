import {IPurchasing, IExchangeRate, ICost, IDatas} from "./IPurchasing";
import {BaseIntegration} from "./BaseIntegration";
import {BaseAPIClient, HttpMethod} from "./BaseAPIClient";
import {Logger} from "../../../../libs/Logger";
import {ErrorFactory} from "../../../../server/utils/ErrorFactory";
import {IntegrationAPIError} from "./IntegrationErrors";
/**
 * Created by Piggat on 8/9/2017.
 * Class chứa các hàm cơ sở sẽ được add thêm vào BaseIntegration để phục vụ dịch vụ nhập hàng
 */
export class BasePurchasing extends BaseIntegration implements IPurchasing {
    protected static SETTING_KEY = {
        GET_EXCHANGE_API: 'GET_EXCHANGE_API',
        GET_COST_API: 'GET_COST_API'
    };

    public async getExchange(customerId: number, appliedTime = new Date()): Promise<IExchangeRate> {
        let client:BaseAPIClient = await this.createClient(customerId);

        let data:any = {};
        if (appliedTime) {
            data.appliedTime = appliedTime;
        }

        let url = this.getSetting(BasePurchasing.SETTING_KEY.GET_EXCHANGE_API);
        if (!url) {
            throw ErrorFactory
                .createError('Integration do not support this function yet', 400, 'NOT_SUPPORTED',
                    [
                        ErrorFactory.ERRORS.E101_NOT_IMPLEMENTED
                    ]
                );
        }

        let response = await client.request(
            url,
            HttpMethod.GET,
            data
        );

        if (response.status != 200) {
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
        else {
            return await response.json();
        }
    }

    public async getCost(customerId: number, datas): Promise<ICost> {
        let client:BaseAPIClient = await this.createClient(customerId);

        let data:any = {};
        if(datas) {
            data = datas;
        }

        let url = this.getSetting(BasePurchasing.SETTING_KEY.GET_COST_API);

        if (!url) {
            throw ErrorFactory
                .createError('Integration do not support this function yet', 400, 'NOT_SUPPORTED',
                    [
                        ErrorFactory.ERRORS.E101_NOT_IMPLEMENTED
                    ]
                );
        }

        let response = await client.request(
            url,
            HttpMethod.POST,
            data
        );

        if (response.status != 200) {
            let logger = Logger.factory('integration');
            let context = {
                request: {
                    url: url,
                    data: data
                },
                response: await response.text()
            };
            logger.error(new Error("Error response from server"), context)
        }
        else {
            return await response.json();
        }
    }
}
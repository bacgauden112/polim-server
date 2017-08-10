import {IPurchasing, IExchangeRate} from "./IPurchasing";
import {BaseIntegration} from "./BaseIntegration";
import {BaseAPIClient, HttpMethod} from "./BaseAPIClient";
import {Logger} from "../../../../libs/Logger";
/**
 * Created by Piggat on 8/9/2017.
 * Class chứa các hàm cơ sở sẽ được add thêm vào BaseIntegration để phục vụ dịch vụ nhập hàng
 */
export class BasePurchasing extends BaseIntegration implements IPurchasing {
    protected static SETTING_KEY = {
        GET_EXCHANGE_API: 'GET_EXCHANGE_API'
    };

    public async getExchange(customerId: number, appliedTime = new Date()): Promise<IExchangeRate> {
        let client:BaseAPIClient = await this.createClient(customerId);

        let data:any = {};
        if (appliedTime) {
            data.appliedTime = appliedTime;
        }

        let response = await client.request(
            this.getSetting(BasePurchasing.SETTING_KEY.GET_EXCHANGE_API),
            HttpMethod.GET,
            data
        );

        if (response.code != 200) {
            let logger = Logger.factory('integration');
            let context = {
                request: {
                    url: this.getSetting(BasePurchasing.SETTING_KEY.GET_EXCHANGE_API),
                    data: data
                },
                response: await response.text()
            };
            logger.error(new Error("Error response from server"), )
        }
        else {
            return await response.json();
        }
    }
}
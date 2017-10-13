import {IPurchasing, IExchangeRate, IFee, IOrderFeature, IAddress} from "./IPurchasing";
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
        GET_FEE_API: 'GET_FEE_API',
        GET_FEATURE_ORDER_API: 'GET_FEATURE_ORDER_API',
        GET_ADDRESS_API: 'GET_ADDRESS_API',
        CREATE_ADDRESS_API: 'CREATE_ADDRESS_API',
        UPDATE_ADDRESS_API: 'UPDATE_ADDRESS_API',
        DELETE_ADDRESS_API: 'DELETE_ADDRESS_API',
        CREATE_ORDER_API: 'CREATE_ORDER_API'
    };

    /**
     * gửi request lấy tỉ giá
     * @param customerId
     * @param appliedTime
     * @returns {Promise<any>}
     */
    public async getExchange(customerId: number, appliedTime = new Date()): Promise<IExchangeRate> {
        let client: BaseAPIClient = await this.createClient(customerId);

        let data: any = {};
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

        return await response.json();
    }

    /**
     * gửi request lấy tính chất đơn hàng
     * @param customerId
     * @param appliedTime
     * @returns {Promise<any>}
     */
    public async getOrderFeature(customerId: number, appliedTime = new Date()): Promise<IOrderFeature> {
        let client: BaseAPIClient = await this.createClient(customerId);

        let data: any = {};
        if (appliedTime) {
            data.appliedTime = appliedTime;
        }

        let url = this.getSetting(BasePurchasing.SETTING_KEY.GET_FEATURE_ORDER_API);

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

        return await response.json();
    }

    /**
     * gửi request lấy phí tạm tính
     * @param customerId
     * @param datas
     * @returns {Promise<any>}
     */
    public async getFee(customerId: number, datas): Promise<IFee> {
        let client:BaseAPIClient = await this.createClient(customerId);

        let data:any = {};
        if(datas) {
            data = datas;
        }

        let url = this.getSetting(BasePurchasing.SETTING_KEY.GET_FEE_API);

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

        return await response.json();
    }

    public async createAddress(customerId: number, datas): Promise<IFee> {
        let client:BaseAPIClient = await this.createClient(customerId);

        let data:any = {};
        if(datas) {
            data = datas;
        }

        let url = this.getSetting(BasePurchasing.SETTING_KEY.CREATE_ADDRESS_API);

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

        return await response.json();
    }

    public async editAddress(customerId: number, id, datas): Promise<IFee> {
        let client:BaseAPIClient = await this.createClient(customerId);

        let data:any = {};
        if(datas) {
            data = datas;
        }

        let url = this.getSetting(BasePurchasing.SETTING_KEY.UPDATE_ADDRESS_API);
        url = url.replace('{id}', id);

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
            HttpMethod.PUT,
            data
        );

        return await response.json();
    }

    public async getAddress(customerId: number): Promise<IAddress[]> {
        let client:BaseAPIClient = await this.createClient(customerId);

        let data:any = {
            customerId: customerId
        };

        let url = this.getSetting(BasePurchasing.SETTING_KEY.GET_ADDRESS_API);

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

        return await response.json();
    }

    public async deleteAddress(customerId: number, id): Promise<any> {
        let client:BaseAPIClient = await this.createClient(customerId);

        let data:any = {
            customerId: customerId,
            id: id
        };

        let url = this.getSetting(BasePurchasing.SETTING_KEY.DELETE_ADDRESS_API);
        url = url.replace("{id}", id);

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
            HttpMethod.DELETE,
            data
        );

        return await response.json();
    }

    public async createOrder(customerId: number, data): Promise<any> {
        let client:BaseAPIClient = await this.createClient(customerId);

        let url = this.getSetting(BasePurchasing.SETTING_KEY.CREATE_ORDER_API);

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

        return await response.json();
    }
}
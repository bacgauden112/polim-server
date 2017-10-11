import {SecurityService} from "../../System/Services/SecurityService";
import {IntegrationService} from "../../Integration/Services/IntegrationService";
import {ErrorFactory} from "../../../server/utils/ErrorFactory";
import LoopBackBase = LoopBack.LoopBackBase;
import ExchangeRate = Models.ExchangeRate;

/**
 * Created by Piggat on 8/10/2017.
 */
export class PurchaseOrder {
    /**
     * Lấy về tỉ giá áp dụng cho khách hàng
     * @param ctx
     * @param appliedTime
     * @returns {Promise<IExchangeRate>}
     */
    public static async getExchangeRate(ctx, appliedTime) {
        let customerId = SecurityService.getCurrentCustomerId(ctx);

        let loopback: LoopBackBase = require('loopback');
        let exchangeRateModel = loopback.getModel('ExchangeRate');
        let exchangeRate: ExchangeRate = await exchangeRateModel.findOne({
            where: {
                "modifier": customerId
            }
        });

        // check exp exchange rate
        let isExpired = false;

        if (exchangeRate) {
            let preDate = exchangeRate.modifiedAt;
            let curDate = new Date();
            if (curDate.getDay() - preDate.getDay() >= 1) {
                isExpired = true;
            } else {
                isExpired = false;
            }
        }

        if (!exchangeRate || isExpired) {
            let purchasingService = await IntegrationService.getPurchasingService(customerId);
            if (!purchasingService) {
                throw ErrorFactory
                    .createError(`Customer has not installed any purchasing app yet`, 400, 'INVALID_SERVICE');
            }
            let result = await purchasingService.getExchange(customerId, appliedTime);
            result['modifier'] = customerId;
            let created = await exchangeRateModel.upsertWithWhere({
                "where": {
                    "modifier": customerId
                }
            }, result);
            exchangeRate = await exchangeRateModel.findOne({
                where: {
                    "modifier": customerId
                }
            });
            return exchangeRate;
        } else {
            return exchangeRate;
        }
    }

    /**
     * Lấy về thông tin đơn hàng
     * @param ctx
     * @param appliedTime
     * @returns {Promise<IOrderFeature>}
     */
    public static async getOrderFeature(ctx, appliedTime) {
        let customerId = SecurityService.getCurrentCustomerId(ctx);

        let purchasingService = await IntegrationService.getPurchasingService(customerId);
        if (!purchasingService) {
            throw ErrorFactory
                .createError(`Customer has not installed any purchasing app yet`, 400, 'INVALID_SERVICE');
        }

        return await purchasingService.getOrderFeature(customerId, appliedTime);
    }

    /**
     * Lấy về phí tạm tính
     * @param ctx
     * @param datas
     * @returns {Promise<IFee>}
     */
    public static async getFee(ctx, datas) {
        let customerId = SecurityService.getCurrentCustomerId(ctx);
        let purchasingService = await IntegrationService.getPurchasingService(customerId);
        if (!purchasingService) {
            throw ErrorFactory
                .createError(`Customer has not installed any purchasing app yet`, 400, 'INVALID_SERVICE');
        }

        return await purchasingService.getFee(customerId, datas);
    }

    public static async getAddress(ctx, id) {
        let customerId = SecurityService.getCurrentCustomerId(ctx);
        if (customerId == id) {
            let purchasingService = await IntegrationService.getPurchasingService(customerId);
            if (!purchasingService) {
                throw ErrorFactory
                    .createError(`Customer has not installed any purchasing app yet`, 400, 'INVALID_SERVICE');
            }

            return await purchasingService.getAddress(customerId);
        }
        throw ErrorFactory
            .createError(`Customer id invalid`, 403, 'INVALID_ID');
    }


    public static async createAddress(ctx, id, datas) {
        let customerId = SecurityService.getCurrentCustomerId(ctx);
        if (customerId == id) {
            let purchasingService = await IntegrationService.getPurchasingService(customerId);
            if (!purchasingService) {
                throw ErrorFactory
                    .createError(`Customer has not installed any purchasing app yet`, 400, 'INVALID_SERVICE');
            }

            return await purchasingService.createAddress(customerId, datas);
        }
        throw ErrorFactory
            .createError(`Customer id invalid`, 403, 'INVALID_ID');
    }

    public static async editAddress(ctx, cid, id, data) {
        let customerId = SecurityService.getCurrentCustomerId(ctx);
        if (customerId == cid) {

            let purchasingService = await IntegrationService.getPurchasingService(customerId);
            if (!purchasingService) {
                throw ErrorFactory
                    .createError(`Customer has not installed any purchasing app yet`, 400, 'INVALID_SERVICE');
            }

            return await purchasingService.editAddress(customerId, id, data);
        }
        throw ErrorFactory
            .createError(`Customer id invalid`, 403, 'INVALID_ID');
    }

    public static async deleteAddress(ctx, cid, id) {
        let customerId = SecurityService.getCurrentCustomerId(ctx);
        if (customerId == cid) {
            let purchasingService = await IntegrationService.getPurchasingService(customerId);
            if (!purchasingService) {
                throw ErrorFactory
                    .createError(`Customer has not installed any purchasing app yet`, 400, 'INVALID_SERVICE');
            }

            return await purchasingService.deleteAddress(customerId, id);
        }
        throw ErrorFactory
            .createError(`Customer id invalid`, 403, 'INVALID_ID');
    }

    public static async createOrder(ctx, data) {
        let customerId = SecurityService.getCurrentCustomerId(ctx);
        let purchasingService = await IntegrationService.getPurchasingService(customerId);
        if (!purchasingService) {
            throw ErrorFactory
                .createError(`Customer has not installed any purchasing app yet`, 400, 'INVALID_SERVICE');
        }

        return await purchasingService.createOrder(customerId, data);
    }
}
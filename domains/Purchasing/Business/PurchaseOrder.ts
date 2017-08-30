import {SecurityService} from "../../System/Services/SecurityService";
import {IntegrationService} from "../../Integration/Services/IntegrationService";
import {ErrorFactory} from "../../../server/utils/ErrorFactory";
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

        let purchasingService = await IntegrationService.getPurchasingService(customerId);
        if (!purchasingService) {
            throw ErrorFactory
                .createError(`Customer has not installed any purchasing app yet`,400,'INVALID_SERVICE');
        }

        return await purchasingService.getExchange(customerId, appliedTime);
    }

    public static async getOrderFeature(ctx, appliedTime) {
        let customerId = SecurityService.getCurrentCustomerId(ctx);

        let purchasingService = await IntegrationService.getPurchasingService(customerId);
        if (!purchasingService) {
            throw ErrorFactory
                .createError(`Customer has not installed any purchasing app yet`,400,'INVALID_SERVICE');
        }

        return await purchasingService.getOrderFeature(customerId, appliedTime);
    }
}
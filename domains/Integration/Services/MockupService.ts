/**
 * Created by Piggat on 8/4/2017.
 */
import {BaseIntegration} from "./Base/BaseIntegration";
import {IFee, IPurchasing, IServiceFee} from "./Base/IPurchasing";
import {IExchangeRate} from "./Base/IPurchasing";
/**
 * Mockup service, dùng cho việc test
 */
export class MockupService extends BaseIntegration implements IPurchasing{
    //region -- IPurchasing implement --
    async getExchange(customerId, appliedTime = new Date()): Promise<IExchangeRate> {
        return {
            rate: 3000,
            baseCurrency: 'CNY',
            targetCurrency: 'VND'
        }
    }

    async getFee(customerId, data): Promise<IFee> {
        let serviceFees: Array<IServiceFee> = [
            {
                code: "BUYING",
                name: "Mua Hàng",
                rawAmount: 645120,
                amount: 548352,
                currency: "VND"
            },
            {
                code: "CHECKING",
                name: "Kiểm Hàng",
                rawAmount: 120000,
                amount: 102000,
                currency: "VND"
            },
            {
                code: "FIXED",
                name: "Phí cố định",
                rawAmount: 5000,
                amount: 0,
                currency: "VND"
            }
        ];
        return {
            total: 53760000,
            currency: "VND",
            serviceFees: serviceFees
        }
    }
    //endregion
}
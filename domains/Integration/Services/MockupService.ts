/**
 * Created by Piggat on 8/4/2017.
 */
import {BaseIntegration} from "./Base/BaseIntegration";
import {IPurchasing} from "./Base/IPurchasing";
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
    //endregion
}
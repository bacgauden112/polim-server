/**
 * Created by anhdq on 31/08/2017.
 */
import {SecurityService} from "../../System/Services/SecurityService";
import {ErrorFactory} from "../../../server/utils/ErrorFactory";
import PersistedModel = LoopBack.PersistedModel;
/**
 * Created by Piggat on 8/10/2017.
 */
export class Customer {
    /**
     * Lấy về tỉ giá áp dụng cho khách hàng
     * @param ctx
     * @param appliedTime
     * @returns {Promise<IExchangeRate>}
     */
    public static async getCustomer(Model: PersistedModel, ctx) {
        let customerId = SecurityService.getCurrentCustomerId(ctx);

        let customer = await Model.find(
            {
                where: {
                    id: customerId
                }
            }
        )
        return customer;
    }
}
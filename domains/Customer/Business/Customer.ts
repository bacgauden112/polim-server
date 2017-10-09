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

        let customer = await Model.findById(customerId);
        return customer;
    }

    public static async confirmPassword(Model: PersistedModel, data, ctx) {
        let customerId = SecurityService.getCurrentCustomerId(ctx);

        let customer = await Model.findById(customerId);

        if(!data.hasOwnProperty('password')) {
            return ErrorFactory.createError('Không có mật khẩu', 401, "NO_PASSWORD");
        }
        let result = await customer.hasPassword(data.password);
        if(result == false) {
            return ErrorFactory.createError('Mật khẩu không đúng', 400, "CONFIRM_FAILED");
        }
        return result;
    }

}
/**
 * Created by Piggat on 8/8/2017.
 */
import {SecurityService} from "../../System/Services/SecurityService";
import {IntegrationService} from "../../Integration/Services/IntegrationService";
import {LoopBackUtils} from "../../../libs/LoopBackUtils";
import {PurchaseOrder} from "../Business/PurchaseOrder";
export = function(Model) {
    Model.getExchangeRate = function(ctx, appliedTime, next) {
        LoopBackUtils.processPromiseCallback(PurchaseOrder.getExchangeRate(ctx, appliedTime), next);
    };

    Model.remoteMethod(
        'getExchangeRate',
        {
            accepts: [{arg: 'context', type: 'Object', http: function(ctx) {
                return ctx;
            }}, {arg: 'appliedTime', type:'Date', description: "Thời gian áp dụng tỉ giá"}
            ],
            returns: {arg: 'exchangeRate', type: 'Object', root: true},
            http: {path: '/exchangeRate', verb: 'get'},
            description: "Lấy tỉ giá áp dụng cho một thời điểm (tạm thời chỉ có CNY sang VND)"
        }
    );
}
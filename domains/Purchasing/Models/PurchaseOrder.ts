/**
 * Created by Piggat on 8/8/2017.
 */
import {LoopBackUtils} from "../../../libs/LoopBackUtils";
import {PurchaseOrder} from "../Business/PurchaseOrder";
export = function (Model) {
    /**
     * API trả về tỉ giá
     * @param ctx
     * @param appliedTime
     * @param next
     */
    Model.getExchangeRate = function (ctx, appliedTime, next) {
        LoopBackUtils.processPromiseCallback(PurchaseOrder.getExchangeRate(ctx, appliedTime), next);
    };

    Model.remoteMethod(
        'getExchangeRate',
        {
            accepts: [{
                arg: 'context', type: 'Object', http: function (ctx) {
                    return ctx;
                }
            }, {arg: 'appliedTime', type: 'Date', description: "Thời gian áp dụng tỉ giá"}
            ],
            returns: {arg: 'exchangeRate', type: 'Object', root: true},
            http: {path: '/exchangeRate', verb: 'get'},
            description: "Lấy tỉ giá áp dụng cho một thời điểm (tạm thời chỉ có CNY sang VND)"
        }
    );

    Model.getOrderFeature = function(ctx, appliedTime, next) {
        LoopBackUtils.processPromiseCallback(PurchaseOrder.getOrderFeature(ctx, appliedTime), next);
    };

    Model.remoteMethod(
        'getOrderFeature',
        {
            accepts: [{arg: 'context', type: 'Object', http: function(ctx) {
                return ctx;
            }}, {arg: 'appliedTime', type:'Date', description: "Thời gian áp dụng chính sách này"}
            ],
            returns: {arg: 'orderFeature', type: 'Object', root: true},
            http: {path: '/orderFeature', verb: 'get'},
            description: "Lấy thông tin các tính chất đơn"
        }
    );

    /**
     * Từ thông tin sản phẩm & các tính chất đơn gửi lên trả về chi tiết các phí tạm tính khi tạo đơn.
     * @param ctx
     * @param seller
     * @param items
     * @param features
     * @param next
     */
    Model.getFee = function (ctx, datas, next) {
        LoopBackUtils.processPromiseCallback(PurchaseOrder.getFee(ctx, datas), next);
    };

    Model.remoteMethod(
        'getFee',
        {
            accepts: [
                {
                    arg: 'context', type: 'Object', http: function (ctx) {
                        return ctx;
                    }
                },
                {
                    arg: 'datas',
                    type: 'Object',
                    description: "Thông tin người bán, danh sách sản phẩm và danh sách các tính chất đơn",
                    default:`{
 "seller": {
   "id": "string",
   "name": "string",
   "source": "string"
 },
 "items": [
   {
     "originId": "number",
     "originName": "string",
     "name": "string",
     "originUrl": "string",
     "mainImage": "string",
     "variantImage": "string",
     "quantity": "number",
     "originPrice": "number",
     "salePrice": "number",
     "originCurrency": "string",
     "properties": [
       {
         "id":"string",
         "originName": "string",
         "name": "string"
       }
     ],
     "note": "string"
   }
 ],
 "features": [
   {
     "code": "string"
   }
 ]
}`,
                    http: {
                        source: 'body'
                    }
                },
            ],
            returns: {
                arg: 'fee',
                type: 'Object',
                root: true,
                default: `{
"total": "number",
"currency": "string",
"serviceFees": [
    {
        "code": "string",
        "name": "string",
        "rawAmount": "number",
        "amount": "number",
        "currency": "string"
    },
    {
        "code": "string",
        "name": "string",
        "rawAmount": "number",
        "amount": "number",
        "currency": "string"
    },
    {
        "code": "string",
        "name": "string",
        "rawAmount": "number",
        "amount": "number",
        "currency": "string"
    }
]
}`
            },
            http: {path: '/fee', verb: 'post'},
            description: "Từ thông tin sản phẩm & các tính chất đơn gửi lên trả về chi tiết các phí tạm tính khi tạo đơn."
        }
    );

    /**
     *
     * @param ctx
     * @param datas
     * @param next
     */
    Model.getAddress = function (ctx, next) {
        LoopBackUtils.processPromiseCallback(PurchaseOrder.getAddress(ctx), next);
    };
    /**
     * API trả về địa chỉ của khách
     */
    Model.remoteMethod(
        'getAddress',
        {
            accepts: [{
                arg: 'context', type: 'Object', http: function (ctx) {
                    return ctx;
                }
            }],
            returns: {arg: 'address', type: 'Object', root: true},
            http: {path: '/address', verb: 'get'},
            description: "Lấy các thông tin địa chỉ nhận hàng của khách"
        }
    );
    /**
     * API tạo địa chỉ mới
     * @param ctx
     * @param appliedTime
     * @param next
     */
    Model.createAddress = function (ctx, datas, next) {
        LoopBackUtils.processPromiseCallback(PurchaseOrder.createAddress(ctx, datas), next);
    };

    Model.remoteMethod(
        'createAddress',
        {
            accepts: [{
                arg: 'context', type: 'Object', http: function (ctx) {
                    return ctx;
                }
            },
                {
                    arg: 'datas',
                    type: 'Object',
                    description: "Thông tin người bán, danh sách sản phẩm và danh sách các tính chất đơn",
                    default:`{
 "streetAddress": "string",
 "districtId": "string",
 "provinceId": "string",
 "contactName": "string",
 "contactPhone": "string",
 "isDefault": "boolean",
 "type": "number"
}`,
                    http: {
                        source: 'body'
                    }
                }],
            returns: {arg: 'result', type: 'Object', root: true},
            http: {path: '/addresses', verb: 'post'},
            description: "Tạo địa chỉ mới"
        }
    );
    Model.deleteAddress = function (ctx, id, next) {
        LoopBackUtils.processPromiseCallback(PurchaseOrder.deleteAddress(ctx, id), next);
    };

    Model.remoteMethod(
        'deleteAddress',
        {
            accepts: [{
                    arg: 'context', type: 'Object', http: function (ctx) {
                        return ctx;
                    }
                },
                { arg: 'id', type: 'number' }
            ],
            returns: {arg: 'result', type: 'Object', root: true},
            http: {path: '/addresses', verb: 'delete'},
            description: "Xoa dia chi"
        }
    );
}
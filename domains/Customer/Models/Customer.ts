import {CustomerHook} from '../Business/CustomerHook';
import {LoopBackUtils} from "../../../libs/LoopBackUtils";
import {RelationMethod, RelationType} from "../../Common/Constants";
import {Customer as CustomerBussiness} from "../Business/Customer";
import Customer = Models.Customer;
import {PurchaseOrder} from "../../Purchasing/Business/PurchaseOrder";

export = function (Customer) {
    LoopBackUtils.disableAllRelationMethods(Customer, 'integrations', RelationType.hasManyThrough);
    LoopBackUtils.disableAllRelationMethods(Customer, 'customerSettings', RelationType.hasMany);
    LoopBackUtils.disableAllRelationMethods(Customer, 'accessTokens', RelationType.hasMany, [RelationMethod.findRelationObjectById]);
    LoopBackUtils.disableAllRelationMethods(Customer, 'customerIntegration', RelationType.hasMany, [RelationMethod.findAllRelationObject]);

    Customer.beforeRemote('create', function (ctx, user, next) {
        CustomerHook.checkAccessToken(ctx, user, next);
    });

    Customer.beforeRemote('create', function (ctx, user, next) {
        CustomerHook.checkSecretKey(ctx, user, next);
    });

    Customer.beforeRemote('create', function (ctx, user, next) {
        CustomerHook.checkExternalId(ctx, user, next);
    });

    Customer.beforeRemote('create', function (ctx, user, next) {
        CustomerHook.checkUserNameBeforeRegister(ctx, user, next);
    });

    Customer.beforeRemote('create', function (ctx, user, next) {
        CustomerHook.lowerCaseUserName(ctx, user, next);
    });

    Customer.beforeRemote('create', function (ctx, user, next) {
        CustomerHook.lowerCaseEmail(ctx, user, next);
    });

    Customer.afterRemote('create', function (ctx, user, next) {
        CustomerHook.mappingCustomer(ctx, user, next);
    });

    Customer.beforeRemote('login', function (ctx, user, next) {
        CustomerHook.lowerCaseUserName(ctx, user, next);
    });

    Customer.beforeRemote('login', function (ctx, user, next) {
        CustomerHook.lowerCaseEmail(ctx, user, next);
    });

    Customer.beforeRemote('**', function(ctx, model, next) {
        next();
    })

    /**
     * api lấy thông tin người dùng
     * @param token
     * @param next
     */
    Customer.me = function(ctx, next) {
        LoopBackUtils.processPromiseCallback(CustomerBussiness.getCustomer(Customer, ctx),next);
    };

    Customer.remoteMethod(
        'me',
        {
            accepts: [
                // {arg: 'token', type: 'string', description: "Access token", required: true}
                {arg: 'context', type: 'Object', http: function(ctx) {
                    return ctx;
                }}
            ],
            returns: {arg: 'profile', type: 'Object', root: true},
            http: {path: '/me', verb: 'get'},
            description: "Lấy thông tin người dùng"
        }
    );

    //region -- Full name computed value --
    Customer.getFullName = (instance:Customer) => {
        if (!instance.firstName) {
            return instance.lastName;
        }
        else if (!instance.lastName) {
            return instance.firstName;
        }
        else if (!instance.firstName && !instance.lastName) {
            return '';
        }
        return `${instance.lastName} ${instance.firstName}`;
    };

    Customer.prototype.getFullName = function() {
        if (!this.firstName) {
            return this.lastName;
        }
        else if (!this.lastName) {
            return this.firstName;
        }
        else if (!this.firstName && !this.lastName) {
            return '';
        }
        return `${this.lastName} ${this.firstName}`;
    }
    //endregion

    // region -- Address API --
    /**
     *
     * @param ctx
     * @param next
     */
    Customer.getAddress = function (ctx, id, next) {
        LoopBackUtils.processPromiseCallback(PurchaseOrder.getAddress(ctx, id), next);
    };
    /**
     * API trả về địa chỉ của khách
     */
    Customer.remoteMethod(
        'getAddress',
        {
            accepts: [{
                arg: 'context', type: 'Object', http: function (ctx) {
                    return ctx;
                }
            }, {arg: 'id', type: 'number', required: true}],
            returns: {arg: 'addresses', type: 'Object', root: true},
            http: {path: '/:id/addresses', verb: 'get'},
            description: "Lấy các thông tin địa chỉ nhận hàng của khách"
        }
    );

    /**
     * API tạo địa chỉ mới
     * @param ctx
     * @param appliedTime
     * @param next
     */
    Customer.createAddress = function (ctx, id, datas, next) {
        LoopBackUtils.processPromiseCallback(PurchaseOrder.createAddress(ctx, id, datas), next);
    };

    Customer.remoteMethod(
        'createAddress',
        {
            accepts: [{
                arg: 'context', type: 'Object', http: function (ctx) {
                    return ctx;
                }
            },
                {arg: 'id', type: 'number', required: true},
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
            http: {path: '/:id/addresses', verb: 'post'},
            description: "Tạo địa chỉ mới"
        }
    );

    /**
     *
     * @param context
     * @param cid
     * @param id
     * @param data
     * @param next
     */
    Customer.editAddress = function (context, cid, id, datas, next) {
        LoopBackUtils.processPromiseCallback(PurchaseOrder.editAddress(context, cid, id, datas), next);
    };
    /**
     * API chỉnh sửa địa chỉ của khách
     */
    Customer.remoteMethod(
        'editAddress',
        {
            accepts: [
                {
                    arg: 'context', type: 'Object', http: function (ctx) {
                        return ctx;
                    }
                },
                {
                    arg: 'cid', type: 'number', required: true
                },
                {
                    arg: 'id', type: 'number', required: true
                },
                {
                    arg: 'datas',
                    type: 'Object',
                    description: "Địa chỉ nhận hàng",
                    default: `{
    "streetAddress": "string",
    "districtId": "string",
    "provinceId": "string",
    "contactName": "string",
    "contactPhone": "string",
    "isDefault": "boolean"
}`,
                    http: {
                        source: 'body'
                    }
                }
            ],
            returns: {arg: 'address', type: 'Object', root: true},
            http: {path: '/:cid/address/:id', verb: 'put'},
            description: "Chỉnh sửa thông tin địa chỉ nhận hàng của khách"
        }
    );

    Customer.deleteAddress = function (ctx, cid, id, next) {
        LoopBackUtils.processPromiseCallback(PurchaseOrder.deleteAddress(ctx, cid, id), next);
    };

    Customer.remoteMethod(
        'deleteAddress',
        {
            accepts: [{
                arg: 'context', type: 'Object', http: function (ctx) {
                    return ctx;
                }
            },
                { arg: 'cid', type: 'number', required: true },
                { arg: 'id', type: 'number', required: true }
            ],
            returns: {arg: 'result', type: 'Object', root: true},
            http: {path: '/:cid/addresses/:id', verb: 'delete'},
            description: "Xoa dia chi"
        }
    );
    //endregion
    //region -- Confirm password --
    Customer.confirmPassword = function(ctx, datas, next) {
        LoopBackUtils.processPromiseCallback(CustomerBussiness.confirmPassword(Customer, datas, ctx),next);
    };

    Customer.remoteMethod(
        'confirmPassword',
        {
            accepts: [{
                arg: 'context', type: 'Object', http: function (ctx) {
                    return ctx;
                }
            },
            {
                arg: 'datas',
                type: 'Object',
                description: "Mật khẩu",
                http: {
                    source: 'body'
                },
                default: `{"password":"string"}`
            }],
            returns: {arg: 'result', type: 'boolean', root: true},
            http: {path: '/confirmPassword', verb: 'post'},
            description: "Xác nhận mật khẩu"
        }
    );
    // endregion
}
import {CustomerHook} from '../Business/CustomerHook';
import {LoopBackUtils} from "../../../libs/LoopBackUtils";
import {RelationMethod, RelationType} from "../../Common/Constants";
import {Customer as CustomerBussiness} from "../Business/Customer";
import Customer = Models.Customer;

export = function (Customer) {
    LoopBackUtils.disableAllRelationMethods(Customer, 'integrations', RelationType.hasManyThrough);
    LoopBackUtils.disableAllRelationMethods(Customer, 'customerSettings', RelationType.hasMany);
    LoopBackUtils.disableAllRelationMethods(Customer, 'accessTokens', RelationType.hasMany);
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
}
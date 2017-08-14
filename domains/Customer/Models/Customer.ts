import {CustomerHook} from '../Business/CustomerHook';
import {LoopBackUtils} from "../../../libs/LoopBackUtils";
import {RelationType} from "../../Common/Constants";

export = function (Customer) {
    LoopBackUtils.disableAllRelationMethods(Customer, 'integrations', RelationType.hasManyThrough);
    LoopBackUtils.disableAllRelationMethods(Customer, 'customerSettings', RelationType.hasMany);
    LoopBackUtils.disableAllRelationMethods(Customer, 'accessTokens', RelationType.hasMany);

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
        CustomerHook.lowerCaseUserName(ctx, user, next);
    });

    Customer.afterRemote('create', function (ctx, user, next) {
        CustomerHook.mappingCustomer(ctx, user, next);
    });

    Customer.beforeRemote('**', function(ctx, model, next) {
        next();
    })
}
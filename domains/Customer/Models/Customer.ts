import {CustomerHook} from '../Business/CustomerHook';
import {LoopBackUtils} from "../../../libs/LoopBackUtils";
import {RelationType} from "../../Common/Constants";
import Customer = Models.Customer;

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
    });

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
import {CustomerHook} from '../Business/CustomerHook';

export = function (Customer) {
    Customer.beforeRemote('create', function(ctx, user, next){
        CustomerHook.checkSecretKey(ctx, user, next);
    });

    Customer.afterRemote('create', function (ctx, user, next) {
        CustomerHook.mappingCustomer(ctx, user, next);
    });
}
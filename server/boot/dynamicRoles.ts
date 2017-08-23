/**
 * Created by Piggat on 8/11/2017.
 */
export = function (app) {
    let Role = app.models.Role;

    Role.registerResolver('$staff', function(role, context, cb) {
        let isStaff = context.accessToken && context.accessToken.principalType === 'STAFF';
        cb(null, isStaff);
    });

    Role.registerResolver('$customer', function(role, context, cb) {
        let isCustomer = context.accessToken && context.accessToken.principalType === 'Customer';
        cb(null, isCustomer);
    });
}
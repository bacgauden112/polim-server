import {ErrorFactory} from '../../../server/utils/ErrorFactory';
let app = require('../../../server/server');

export class CustomerHook {
    public static checkSecretKey(ctx, user, next) {
        let headers = ctx.req.headers;
        if (!headers.hasOwnProperty('x-secret-key')) {
            next(ErrorFactory.createError('Nguồn không xác định', '400', 'NO_SERVICE'));
            return;
        }
        let secret_key = headers['x-secret-key'];

        let integrationModel = app.models.Integration;
        integrationModel.findOne({
            where: {
                secretKey: secret_key
            }
        }).then((result) => {
            if (result == null) {
                next(ErrorFactory.createError('Nguồn không đúng', '401', 'INVALID_SERVICE'));
                return;
            }
            else {
                ctx.serviceCode = result.serviceCode;
                next();
            }
        });
    }

    public static mappingCustomer(ctx, user, next) {
        let mappingAccountsModel = app.models.MappingAccounts;
        mappingAccountsModel.create({
            "userId": user.id,
            "serviceCode": ctx.serviceCode
        });
        next();
    }
}

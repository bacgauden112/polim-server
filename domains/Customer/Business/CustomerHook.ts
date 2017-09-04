import {ErrorFactory} from '../../../server/utils/ErrorFactory';
let app = require('../../../server/server');

export class CustomerHook {
    /**
     * Before hook kiểm tra Secret key trong header
     * @param ctx
     * @param user
     * @param next
     * @returns {Promise<void>}
     */
    public static async checkSecretKey(ctx, user, next) {
        let headers = ctx.req.headers;
        if (!headers.hasOwnProperty('x-secret-key')) {
            next(ErrorFactory.createError('Nguồn không xác định', 400, 'NO_SERVICE'));
            return;
        }
        let secret_key = headers['x-secret-key'];

        let integrationModel = app.models.Integration;
        let integrationObj = await integrationModel.findOne({
            where: {
                secretKey: secret_key
            }
        });
        if (integrationObj == null) {
            next(ErrorFactory.createError('Nguồn không đúng', 400, 'INVALID_SERVICE'));
            return;
        }
        else {
            ctx.secretKey = integrationObj.secretKey;
            next();
        }
    }

    /**
     * Before hook kiểm tra mã id tài khoản bên tích hợp đã có trong header chưa.
     * @param ctx
     * @param user
     * @param next
     * @returns {Promise<void>}
     */
    public static async checkExternalId(ctx, user, next) {
        let headers = ctx.req.headers;
        if (!headers.hasOwnProperty('external-id')) {
            next(ErrorFactory.createError('Thiếu id tài khoản dịch vụ', 400, 'NO_EXTERNAL_ID'));
            return;
        }
        let externalId = headers['external-id'];

        /*let integrationModel = app.models.Integration;
        let integrationObj = await integrationModel.findOne({
            where: {
                externalId: externalId
            }
        });
        if (integrationObj != null) {
            next(ErrorFactory.createError('Đã tồn tại id tài khoản dịch vụ', '400', 'INVALID_EXTERNAL_ID'));
            return;
        } else {
            ctx.externalId = integrationObj.externalId;
            next();
        }*/
        ctx.externalId = externalId;
        next();
    }

    public static async checkAccessToken(ctx, user, next) {
        let headers = ctx.req.headers;
        if (!headers.hasOwnProperty('access-token')) {
            next(ErrorFactory.createError('Thiếu access token', 400, 'NO_ACCESS_TOKEN'));
            return;
        }
        let token = headers['access-token'];

        ctx.token = token;

        next();
    }

    /**
     * After hook mapping khách hàng với bên thứ 3.
     * @param ctx
     * @param user
     * @param next
     * @returns {Promise<void>}
     */
    public static async mappingCustomer(ctx, user, next) {
        let customerIntegrationModel = app.models.CustomerIntegration;
        let integrationModel = app.models.Integration;
        let integrationObj = await integrationModel.findOne({
            where: {
                secretKey: ctx.secretKey
            }
        });
        customerIntegrationModel.create({
            "customerId": user.id,
            "integrationId": integrationObj.id,
            "externalId": ctx.externalId,
            "accessToken": ctx.token
        });
        next();
    }

    /**
     * Before hook chuyển các ký tự hoa trong username khi request thành chữ thường.
     * @param ctx
     * @param user
     * @param next
     */
    public static lowerCaseUserName(ctx, user, next) {
        if(ctx.req.body.hasOwnProperty('username')) {
            ctx.req.body.username = ctx.req.body.username.toLowerCase();
        }
        next();
    }

    /**
     * Before hook chuyển các ký tự hoa trong email khi request thành chữ thường.
     * @param ctx
     * @param user
     * @param next
     */
    public static lowerCaseEmail(ctx, user, next) {
        if(ctx.req.body.hasOwnProperty('email')) {
            ctx.req.body.email = ctx.req.body.email.toLowerCase();
        }
        next();
    }
}

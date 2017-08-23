import {SystemSetting} from "../Config/SystemSetting";
let app = require('../../../server/server');

export = function (Setting) {
    Setting.reloadSettings = function (next) {
        let settingModel = app.models.Setting;
        SystemSetting.init(settingModel).then(() => {
            next(null, {message: 'System settings have been reloaded'});
        }).catch((err) => {
            next(err);
        });
    };

    Setting.appSettings = function (appKey, next) {
        let settingModel = app.models.Setting;
        settingModel.find({
            where: {
                or: [
                    {app: appKey},
                    {app: 'ALL'}
                ]
            }
        }).then((result) => {
            let configs = {};
            for (let setting of result) {
                configs[setting.key] = setting.value;
            }

            next(null, configs);
        });
    };

    Setting.remoteMethod("appSettings", {
        accepts: [{arg: 'app', type: 'string'}],
        returns: {arg: 'settings', root: true},
        http: {path: '/appSettings', verb: 'get'}
    });

    Setting.systemSettings = function (key, next) {
        next(null, SystemSetting.get(key, ''));
    };

    Setting.remoteMethod("systemSettings", {
        accepts: [{arg: 'key', type: 'string'}],
        returns: {arg: 'settings', root: true},
        http: {path: '/systemSettings', verb: 'get'}
    });
}
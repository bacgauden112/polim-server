/**
 * Created by Piggat on 7/25/2017.
 */
let loopback = require('loopback');

export = function (app) {
    app.use(loopback.token({ model: app.models.AccessToken }));
};

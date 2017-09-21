import {ErrorFactory} from "./utils/ErrorFactory";
/**
 * Created by Piggat on 7/25/2017.
 */
//require('cls-hooked');
let loopback = require('loopback');
let boot = require('loopback-boot');
let LoopBackContext = require('loopback-context');
let path = require('path');

let app = module.exports = loopback();
//region -- winston config, we need to move this to Setting.json --
let winston = require('winston');
let SystemSetting = require("../domains/System/Config/SystemSetting").SystemSetting;
winston.add(require('winston-daily-rotate-file'), {
    datePattern: 'yyyyMMdd',
    dirname: path.join(__dirname, "log"),
    filename: path.join(__dirname, "log", "log.txt")
});
winston.remove(winston.transports.Console);
winston.level = 'debug';

// noinspection TypeScriptUnresolvedVariable
global['dirname'] = __dirname;
//winston.debug('winston testing at' + path.join(__dirname, "log-access", "log_file.log"));
//endregion

let env = process.argv[2] || 'dev';

//process.env.TZ = 'Asia/Ho_Chi_Minh';

//console.info('env:'+ env);
//TODO: require env from node.js instead of using parameter
switch (env) {
    case 'dev':
        process.on('uncaughtException', function (err) {
            console.log('Caught exception', err);
            console.log(err.stack);
            winston.error('Uncaught exception: ' + err, err.stack)
        });

        process.on('unhandledRejection', function(reason, p){
            console.log("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
            winston.error('Unhandled rejecjtion: ' + reason, p);
            // application specific logging here
        });

        break;
    case 'prod':
        // Setup production config
        break;
}

app.start = function () {
    // start the web server
    return app.listen(function () {
        app.emit('started');
        let baseUrl = app.get('url').replace(/\/$/, '');
        console.log('Web server listening at: %s', baseUrl);
        if (app.get('loopback-component-explorer')) {
            let explorerPath = app.get('loopback-component-explorer').mountPath;
            console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
        }
    });
};

// Bootstrap the application, configure Models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts
boot(app, __dirname, function (err) {
    let helmet = require('helmet');
    app.use(helmet());
    let cors = require('cors');
    let corsOptions = {
        origin: '*',
    };
    //TODO: CORS enable by config
    app.use(cors(corsOptions));

    let fakeNetworkSlow = app.get('fakeNetworkSlow');
    if (fakeNetworkSlow) {
        let FakeNetworkSlow = require('./middlewares/FakeNetworkSlow');
        app.use(FakeNetworkSlow({timeout: fakeNetworkSlow}));
    }

    if (err) throw err;

    //region context testing
    //endregion

    // start the server if `$ node server.js`
    if (require.main === module) {
        app.start();
        // app.io = require('socket.io')(app.start());
        // app.ioAuth = {};
        // app.socketAuth = {};
        //
        // require('socketio-auth')(app.io, {
        //     authenticate: function (socket, value, callback) {
        //
        //         let AccessToken = app.Models.CommonAccessToken;
        //         //get credentials sent by the client
        //         AccessToken.authenticateSocketIo(value, callback); //find function..
        //     } //authenticate function..
        // });
        //
        // app.io.on('connection', function (socket) {
        //     console.log('a user connected');
        //     socket.on('disconnect', function () {
        //         console.log('user disconnected');
        //         delete app.socketAuth[socket.id];
        //     });
        // });
    }

    let settingModel = app.models.Setting;
    SystemSetting.init(settingModel);
});

//region -- handle api errors --
app.get('remoting').errorHandler = {
    handler: function(error, req, res, next) {
        //var log = require('debug')('server:rest:errorHandler');
        if (error instanceof Error) {
            winston.error('Error in ' + req.method +' ' + req.url + ' Error name: ' + error.name
                + ' Error message: ' + error.message + '\n Stack:' + error.stack);
        }
        else {
            winston.error('Error in ' + req.method + ' ' + req.originalUrl + ' ' + res.statudCode + error);
        }
        next(); /* let the default error handler (RestAdapter.errorHandler) run next */
    },
    debug: false
};


//endregion
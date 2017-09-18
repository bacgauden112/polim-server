/**
 * Created by Piggat on 7/25/2017.
 */
export = function(server) {
    // Install a `/` route that returns server status
    let router = server.loopback.Router();
    router.get('/status', server.loopback.status());

    router.get('/agent', agent());
    server.use(router);
};

function agent() {
    return function(req, res) {
        res.send({
            "user-agent": req.headers['user-agent']
        });
    };
}